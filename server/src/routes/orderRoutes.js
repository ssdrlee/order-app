import express from 'express';
import { createOrder, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders - 주문 생성
router.post('/', createOrder);

// GET /api/orders/:id - 주문 상세 조회
router.get('/:id', getOrderById);

export default router;

