import { createOrderInDB, getOrderByIdFromDB } from '../models/orderModel.js';

// POST /api/orders - 주문 생성
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;
    
    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR-203',
          message: '주문 항목이 필요합니다.'
        }
      });
    }
    
    if (!totalAmount || typeof totalAmount !== 'number') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR-203',
          message: '총 금액이 필요합니다.'
        }
      });
    }
    
    const orderId = await createOrderInDB(items, totalAmount);
    
    res.status(201).json({
      success: true,
      orderId,
      message: '주문이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id - 주문 상세 조회
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdFromDB(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ERR-202',
          message: '주문을 찾을 수 없습니다.'
        }
      });
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
};

