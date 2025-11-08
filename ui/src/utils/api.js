// API 클라이언트
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API 호출 헬퍼 함수
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 요청 실패');
    }

    return data;
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};

// 메뉴 API
export const menuAPI = {
  // 모든 메뉴 조회
  getAll: async () => {
    const response = await apiCall('/menus');
    return Array.isArray(response) ? response : response.data || [];
  },

  // 특정 메뉴 조회
  getById: async (id) => {
    const response = await apiCall(`/menus/${id}`);
    return response.data || response;
  },
};

// 주문 API
export const orderAPI = {
  // 주문 생성
  create: async (items, totalAmount) => {
    const response = await apiCall('/orders', {
      method: 'POST',
      body: { items, totalAmount },
    });
    return response.data || response;
  },

  // 주문 상세 조회
  getById: async (id) => {
    const response = await apiCall(`/orders/${id}`);
    return response.data || response;
  },
};

// 관리자 API
export const adminAPI = {
  // 대시보드 통계 조회
  getDashboardStats: async () => {
    const response = await apiCall('/admin/dashboard');
    return response.data || response;
  },

  // 재고 목록 조회
  getInventory: async () => {
    const response = await apiCall('/admin/inventory');
    return Array.isArray(response) ? response : response.data || [];
  },

  // 재고 수정
  updateInventory: async (menuId, stock) => {
    const response = await apiCall(`/admin/inventory/${menuId}`, {
      method: 'PUT',
      body: { stock },
    });
    return response.data || response;
  },

  // 주문 목록 조회
  getAllOrders: async (status = null) => {
    const endpoint = status 
      ? `/admin/orders?status=${encodeURIComponent(status)}`
      : '/admin/orders';
    const response = await apiCall(endpoint);
    return Array.isArray(response) ? response : response.data || [];
  },

  // 주문 상태 변경
  updateOrderStatus: async (orderId, status) => {
    const response = await apiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
    });
    return response.data || response;
  },
};

