// localStorage를 사용한 간단한 데이터 저장/조회 유틸리티
// 추후 백엔드 API로 대체 예정

const STORAGE_KEYS = {
  ORDERS: 'cozy_orders',
  INVENTORY: 'cozy_inventory',
};

// 고유 ID 생성 (중복 방지)
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// localStorage 에러 처리 헬퍼
const safeGetItem = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    // localStorage 용량 초과 등의 경우 처리
    if (error.name === 'QuotaExceededError') {
      alert('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
    }
    return false;
  }
};

// 주문 데이터 관리
export const orderStorage = {
  // 모든 주문 조회
  getAll: () => {
    return safeGetItem(STORAGE_KEYS.ORDERS, []);
  },

  // 주문 추가
  add: (order) => {
    const orders = orderStorage.getAll();
    const newOrder = {
      id: generateId(), // 고유 ID 생성
      ...order,
      status: '주문 접수',
      orderDate: new Date().toISOString(),
    };
    orders.unshift(newOrder); // 최신 주문이 앞에 오도록
    const success = safeSetItem(STORAGE_KEYS.ORDERS, orders);
    return success ? newOrder : null;
  },

  // 주문 상태 업데이트
  updateStatus: (orderId, status) => {
    const orders = orderStorage.getAll();
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    return safeSetItem(STORAGE_KEYS.ORDERS, updatedOrders);
  },

  // 주문 삭제 (선택 사항)
  remove: (orderId) => {
    const orders = orderStorage.getAll();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    return safeSetItem(STORAGE_KEYS.ORDERS, filteredOrders);
  },
};

// 재고 데이터 관리
export const inventoryStorage = {
  // 모든 재고 조회
  getAll: () => {
    const data = safeGetItem(STORAGE_KEYS.INVENTORY);
    if (data && data.length > 0) {
      return data;
    }
    // 초기 재고 데이터
    const initialInventory = [
      { menuId: 1, name: '아메리카노(ICE)', stock: 10 },
      { menuId: 2, name: '아메리카노(HOT)', stock: 10 },
      { menuId: 3, name: '카페라떼', stock: 10 },
    ];
    safeSetItem(STORAGE_KEYS.INVENTORY, initialInventory);
    return initialInventory;
  },

  // 재고 업데이트
  update: (menuId, stock) => {
    const inventory = inventoryStorage.getAll();
    const updatedInventory = inventory.map(item =>
      item.menuId === menuId ? { ...item, stock: Math.max(0, stock) } : item
    );
    safeSetItem(STORAGE_KEYS.INVENTORY, updatedInventory);
    return updatedInventory;
  },

  // 재고 조회 (단일 메뉴)
  get: (menuId) => {
    const inventory = inventoryStorage.getAll();
    return inventory.find(item => item.menuId === menuId);
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

