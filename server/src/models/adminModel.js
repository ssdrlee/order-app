import { query } from '../config/database.js';

// 대시보드 통계 조회
export const getDashboardStatsFromDB = async () => {
  // TODO: 데이터베이스 연결 후 구현
  return {
    total: 0,
    received: 0,
    inProgress: 0,
    completed: 0
  };
};

// 재고 목록 조회
export const getInventoryFromDB = async () => {
  // TODO: 데이터베이스 연결 후 구현
  return [
    { menuId: 1, name: '아메리카노(ICE)', stock: 10 },
    { menuId: 2, name: '아메리카노(HOT)', stock: 10 },
    { menuId: 3, name: '카페라떼', stock: 10 }
  ];
};

// 재고 수정
export const updateInventoryInDB = async (menuId, stock) => {
  // TODO: 데이터베이스 연결 후 구현
  return { menuId: parseInt(menuId), stock };
};

// 모든 주문 목록 조회
export const getAllOrdersFromDB = async (status = null) => {
  // TODO: 데이터베이스 연결 후 구현
  return [];
};

// 주문 상태 변경
export const updateOrderStatusInDB = async (orderId, status) => {
  // TODO: 데이터베이스 연결 후 구현
  return { id: parseInt(orderId), status };
};

