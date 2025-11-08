import pool, { query } from '../config/database.js';

// 대시보드 통계 조회
export const getDashboardStatsFromDB = async () => {
  try {
    const totalResult = await query('SELECT COUNT(*) as count FROM orders');
    const receivedResult = await query("SELECT COUNT(*) as count FROM orders WHERE status = '주문 접수'");
    const inProgressResult = await query("SELECT COUNT(*) as count FROM orders WHERE status = '제조 중'");
    const completedResult = await query("SELECT COUNT(*) as count FROM orders WHERE status = '제조 완료'");
    
    return {
      total: parseInt(totalResult.rows[0].count),
      received: parseInt(receivedResult.rows[0].count),
      inProgress: parseInt(inProgressResult.rows[0].count),
      completed: parseInt(completedResult.rows[0].count)
    };
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    throw error;
  }
};

// 재고 목록 조회
export const getInventoryFromDB = async () => {
  try {
    const result = await query(
      'SELECT id as "menuId", name, stock FROM menus ORDER BY id'
    );
    return result.rows;
  } catch (error) {
    console.error('재고 목록 조회 오류:', error);
    throw error;
  }
};

// 재고 수정
export const updateInventoryInDB = async (menuId, stock) => {
  try {
    const result = await query(
      'UPDATE menus SET stock = $1 WHERE id = $2 RETURNING id, name, stock',
      [stock, menuId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('재고 수정 오류:', error);
    throw error;
  }
};

// 모든 주문 목록 조회
export const getAllOrdersFromDB = async (status = null) => {
  try {
    // 주문 목록 조회 (간단한 방법)
    let orderQuery = 'SELECT id, order_date, status, total_amount FROM orders';
    const params = [];
    if (status) {
      orderQuery += ' WHERE status = $1';
      params.push(status);
    }
    orderQuery += ' ORDER BY order_date DESC';
    
    const ordersResult = await query(orderQuery, params);
    
    // 각 주문의 항목 조회
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await query(
          `SELECT oi.menu_id as "menuId", m.name as "menuName", 
                  oi.quantity, oi.unit_price as "unitPrice", oi.total_price as "totalPrice",
                  oi.id as "orderItemId"
           FROM order_items oi
           JOIN menus m ON oi.menu_id = m.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        
        // 각 항목의 옵션 조회
        const items = await Promise.all(
          itemsResult.rows.map(async (item) => {
            const optionsResult = await query(
              `SELECT op.name
               FROM order_item_options oio
               JOIN options op ON oio.option_id = op.id
               WHERE oio.order_item_id = $1`,
              [item.orderItemId]
            );
            
            const optionNames = optionsResult.rows.map(r => r.name);
            
            return {
              menuId: item.menuId,
              name: item.menuName,
              quantity: item.quantity,
              price: item.unitPrice,
              options: {
                shot: optionNames.includes('샷 추가'),
                syrup: optionNames.includes('시럽 추가')
              }
            };
          })
        );
        
        return {
          id: order.id,
          orderDate: order.order_date,
          status: order.status,
          totalAmount: order.total_amount,
          items
        };
      })
    );
    
    return orders;
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    throw error;
  }
};

// 주문 상태 변경
export const updateOrderStatusInDB = async (orderId, status) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 주문 조회
    const orderResult = await client.query(
      'SELECT id, status FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    
    // 상태가 '제조 중'으로 변경되는 경우 재고 차감
    if (status === '제조 중') {
      // 주문 항목 조회
      const itemsResult = await client.query(
        'SELECT menu_id, quantity FROM order_items WHERE order_id = $1',
        [orderId]
      );
      
      // 재고 확인 및 차감
      for (const item of itemsResult.rows) {
        // 현재 재고 확인
        const stockResult = await client.query(
          'SELECT stock FROM menus WHERE id = $1',
          [item.menu_id]
        );
        
        if (stockResult.rows.length === 0) {
          await client.query('ROLLBACK');
          throw new Error(`메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`);
        }
        
        const currentStock = stockResult.rows[0].stock;
        if (currentStock < item.quantity) {
          await client.query('ROLLBACK');
          throw new Error(`재고가 부족합니다. 메뉴 ID: ${item.menu_id}`);
        }
        
        // 재고 차감
        await client.query(
          'UPDATE menus SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.menu_id]
        );
      }
    }
    
    // 주문 상태 업데이트
    const updateResult = await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status',
      [status, orderId]
    );
    
    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 상태 변경 오류:', error);
    throw error;
  } finally {
    client.release();
  }
};

