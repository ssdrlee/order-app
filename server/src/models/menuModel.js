import { query } from '../config/database.js';

// 모든 메뉴 목록 조회
export const getMenusFromDB = async () => {
  // TODO: 데이터베이스 연결 후 구현
  // 현재는 더미 데이터 반환
  return [
    {
      id: 1,
      name: '아메리카노(ICE)',
      description: '시원하고 깔끔한 아이스 아메리카노',
      price: 4000,
      image: '/images/americano-ice.jpg'
    },
    {
      id: 2,
      name: '아메리카노(HOT)',
      description: '따뜻하고 진한 핫 아메리카노',
      price: 4000,
      image: '/images/americano-hot.jpg'
    },
    {
      id: 3,
      name: '카페라떼',
      description: '부드럽고 고소한 카페라떼',
      price: 5000,
      image: '/images/caffe-latte.jpg'
    }
  ];
};

// 특정 메뉴 조회
export const getMenuByIdFromDB = async (id) => {
  // TODO: 데이터베이스 연결 후 구현
  const menus = await getMenusFromDB();
  return menus.find(menu => menu.id === parseInt(id));
};

