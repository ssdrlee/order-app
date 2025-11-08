// localStorage를 사용한 간단한 데이터 저장/조회 유틸리티
// 추후 백엔드 API로 대체 예정

const STORAGE_KEYS = {
  ORDERS: 'cozy_orders',
  INVENTORY: 'cozy_inventory',
};

// 주문 데이터 관리
export const orderStorage = {
  // 모든 주문 조회
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  // 주문 추가
  add: (order) => {
    const orders = orderStorage.getAll();
    const newOrder = {
      id: Date.now(),
      ...order,
      status: '주문 접수',
      orderDate: new Date().toISOString(),
    };
    orders.unshift(newOrder); // 최신 주문이 앞에 오도록
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  // 주문 상태 업데이트
  updateStatus: (orderId, status) => {
    const orders = orderStorage.getAll();
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
  },

  // 주문 삭제 (선택 사항)
  remove: (orderId) => {
    const orders = orderStorage.getAll();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filteredOrders));
  },
};

// 재고 데이터 관리
export const inventoryStorage = {
  // 모든 재고 조회
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (data) {
      return JSON.parse(data);
    }
    // 초기 재고 데이터
    const initialInventory = [
      { menuId: 1, name: '아메리카노(ICE)', stock: 10 },
      { menuId: 2, name: '아메리카노(HOT)', stock: 10 },
      { menuId: 3, name: '카페라떼', stock: 10 },
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(initialInventory));
    return initialInventory;
  },

  // 재고 업데이트
  update: (menuId, stock) => {
    const inventory = inventoryStorage.getAll();
    const updatedInventory = inventory.map(item =>
      item.menuId === menuId ? { ...item, stock } : item
    );
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updatedInventory));
    return updatedInventory;
  },

  // 재고 증가
  increase: (menuId, amount = 1) => {
    const inventory = inventoryStorage.getAll();
    const item = inventory.find(item => item.menuId === menuId);
    if (item) {
      return inventoryStorage.update(menuId, item.stock + amount);
    }
    return inventory;
  },

  // 재고 감소
  decrease: (menuId, amount = 1) => {
    const inventory = inventoryStorage.getAll();
    const item = inventory.find(item => item.menuId === menuId);
    if (item) {
      const newStock = Math.max(0, item.stock - amount);
      return inventoryStorage.update(menuId, newStock);
    }
    return inventory;
  },
};

