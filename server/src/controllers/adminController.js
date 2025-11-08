import { 
  getDashboardStatsFromDB,
  getInventoryFromDB,
  updateInventoryInDB,
  getAllOrdersFromDB,
  updateOrderStatusInDB
} from '../models/adminModel.js';

// GET /api/admin/dashboard - 대시보드 통계 조회
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsFromDB();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/inventory - 재고 목록 조회
export const getInventory = async (req, res, next) => {
  try {
    const inventory = await getInventoryFromDB();
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/inventory/:menuId - 재고 수정
export const updateInventory = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const { stock } = req.body;
    
    // 입력 검증
    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR-207',
          message: '재고 수량은 0 이상의 정수여야 합니다.'
        }
      });
    }
    
    const updatedInventory = await updateInventoryInDB(menuId, stock);
    
    if (!updatedInventory) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ERR-201',
          message: '메뉴를 찾을 수 없습니다.'
        }
      });
    }
    
    res.json({
      success: true,
      menuId: parseInt(menuId),
      stock: updatedInventory.stock,
      message: '재고가 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders - 주문 목록 조회
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query; // 쿼리 파라미터로 필터링 가능
    const orders = await getAllOrdersFromDB(status);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/orders/:orderId/status - 주문 상태 변경
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // 입력 검증
    const validStatuses = ['주문 접수', '제조 중', '제조 완료'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR-205',
          message: '유효하지 않은 주문 상태입니다.'
        }
      });
    }
    
    try {
      const updatedOrder = await updateOrderStatusInDB(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'ERR-202',
            message: '주문을 찾을 수 없습니다.'
          }
        });
      }
      
      res.json({
        success: true,
        orderId: parseInt(orderId),
        status: updatedOrder.status,
        message: '주문 상태가 업데이트되었습니다.'
      });
    } catch (dbError) {
      // 재고 부족 에러 처리
      if (dbError.message.includes('재고가 부족')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'ERR-206',
            message: dbError.message
          }
        });
      }
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

