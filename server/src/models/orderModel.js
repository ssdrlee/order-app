import { query } from '../config/database.js';

// 주문 생성
export const createOrderInDB = async (items, totalAmount) => {
  // TODO: 데이터베이스 연결 후 구현
  // 현재는 더미 ID 반환
  return Date.now();
};

// 주문 상세 조회
export const getOrderByIdFromDB = async (id) => {
  // TODO: 데이터베이스 연결 후 구현
  return null;
};

