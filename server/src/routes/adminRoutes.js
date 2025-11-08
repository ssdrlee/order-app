import express from 'express';
import { 
  getDashboardStats,
  getInventory,
  updateInventory,
  getAllOrders,
  updateOrderStatus
} from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/dashboard - 대시보드 통계 조회
router.get('/dashboard', getDashboardStats);

// GET /api/admin/inventory - 재고 목록 조회
router.get('/inventory', getInventory);

// PUT /api/admin/inventory/:menuId - 재고 수정
router.put('/inventory/:menuId', updateInventory);

// GET /api/admin/orders - 주문 목록 조회
router.get('/orders', getAllOrders);

// PUT /api/admin/orders/:orderId/status - 주문 상태 변경
router.put('/orders/:orderId/status', updateOrderStatus);

export default router;

