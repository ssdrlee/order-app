import { useState } from 'react';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { orderStorage } from '../utils/storage';
import '../styles/OrderPage.css';

// 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    image: '/americano-ice.jpg'
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    image: '/americano-hot.jpg'
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드럽고 고소한 카페라떼',
    image: '/caffe-latte.jpg'
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '우유 거품이 올라간 카푸치노',
    image: '/caffe-latte.jpg' // 임시 이미지
  },
  {
    id: 5,
    name: '에스프레소',
    price: 3500,
    description: '진한 에스프레소',
    image: '/americano-hot.jpg' // 임시 이미지
  },
  {
    id: 6,
    name: '바닐라라떼',
    price: 5500,
    description: '바닐라 시럽이 들어간 달콤한 라떼',
    image: '/caffe-latte.jpg' // 임시 이미지
  }
];

function OrderPage() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    // 같은 메뉴와 옵션 조합이 이미 장바구니에 있는지 확인
    const existingItemIndex = cart.findIndex(
      cartItem =>
        cartItem.menuId === item.menuId &&
        cartItem.options.shot === item.options.shot &&
        cartItem.options.syrup === item.options.syrup
    );

    if (existingItemIndex >= 0) {
      // 이미 있으면 수량 증가
      const updatedCart = [...cart];
      const existingItem = updatedCart[existingItemIndex];
      existingItem.quantity += 1;
      // 개별 가격 재계산: (기본 가격 + 옵션 가격) * 수량
      const unitPrice = existingItem.basePrice + 
        (existingItem.options.shot ? 500 : 0) + 
        (existingItem.options.syrup ? 0 : 0);
      existingItem.totalPrice = unitPrice * existingItem.quantity;
      setCart(updatedCart);
    } else {
      // 없으면 새로 추가
      setCart([...cart, item]);
    }
  };

  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    // 주문 데이터 생성
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const order = {
      items: cart.map(item => ({
        menuId: item.menuId,
        name: item.name,
        quantity: item.quantity,
        price: item.basePrice,
        options: item.options,
      })),
      totalAmount: totalAmount,
    };

    // 주문 저장
    orderStorage.add(order);
    
    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`);
    
    // 장바구니 비우기
    setCart([]);
  };

  return (
    <div className="order-page">
      <div className="menu-section">
        <h2 className="section-title">메뉴</h2>
        <div className="menu-grid">
          {menuData.map(menu => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
      
      <div className="cart-section">
        <Cart cartItems={cart} onOrder={handleOrder} />
      </div>
    </div>
  );
}

export default OrderPage;

