import pool, { query } from '../config/database.js';

// 주문 생성
export const createOrderInDB = async (items, totalAmount) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. 주문 생성
    const orderResult = await client.query(
      'INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING id, order_date, status, total_amount',
      [totalAmount, '주문 접수']
    );
    const order = orderResult.rows[0];
    const orderId = order.id;
    
    // 2. 주문 항목 생성 및 옵션 연결
    for (const item of items) {
      const unitPrice = item.price + (item.options?.shot ? 500 : 0) + (item.options?.syrup ? 0 : 0);
      const totalPrice = unitPrice * item.quantity;
      
      // 주문 항목 생성
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [orderId, item.menuId, item.quantity, unitPrice, totalPrice]
      );
      const orderItemId = itemResult.rows[0].id;
      
      // 옵션 연결 (샷 추가)
      if (item.options?.shot) {
        const shotOption = await client.query(
          "SELECT id FROM options WHERE name = '샷 추가' LIMIT 1"
        );
        if (shotOption.rows.length > 0) {
          await client.query(
            'INSERT INTO order_item_options (order_item_id, option_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [orderItemId, shotOption.rows[0].id]
          );
        }
      }
      
      // 옵션 연결 (시럽 추가)
      if (item.options?.syrup) {
        const syrupOption = await client.query(
          "SELECT id FROM options WHERE name = '시럽 추가' LIMIT 1"
        );
        if (syrupOption.rows.length > 0) {
          await client.query(
            'INSERT INTO order_item_options (order_item_id, option_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [orderItemId, syrupOption.rows[0].id]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    return orderId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 생성 오류:', error);
    throw error;
  } finally {
    client.release();
  }
};

// 주문 상세 조회
export const getOrderByIdFromDB = async (id) => {
  try {
    // 주문 기본 정보 조회
    const orderResult = await query(
      'SELECT id, order_date, status, total_amount FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return null;
    }
    
    const order = orderResult.rows[0];
    
    // 주문 항목 조회
    const itemsResult = await query(
      `SELECT oi.id, oi.menu_id as "menuId", m.name as "menuName", 
              oi.quantity, oi.unit_price as "unitPrice", oi.total_price as "totalPrice"
       FROM order_items oi
       JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = $1`,
      [id]
    );
    
    // 각 주문 항목의 옵션 조회
    const items = await Promise.all(
      itemsResult.rows.map(async (item) => {
        const optionsResult = await query(
          `SELECT o.id, o.name, o.price
           FROM order_item_options oio
           JOIN options o ON oio.option_id = o.id
           WHERE oio.order_item_id = $1`,
          [item.id]
        );
        
        return {
          menuId: item.menuId,
          menuName: item.menuName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          options: optionsResult.rows
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
  } catch (error) {
    console.error('주문 조회 오류:', error);
    throw error;
  }
};

