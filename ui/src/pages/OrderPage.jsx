import { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { menuAPI, orderAPI } from '../utils/api';
import '../styles/OrderPage.css';

function OrderPage() {
  const [cart, setCart] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 데이터 로드
  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const menus = await menuAPI.getAll();
      setMenuData(menus);
    } catch (err) {
      console.error('메뉴 로드 오류:', err);
      setError('메뉴를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      const SHOT_PRICE = 500;
      const unitPrice = existingItem.basePrice + 
        (existingItem.options.shot ? SHOT_PRICE : 0) + 
        (existingItem.options.syrup ? 0 : 0);
      existingItem.totalPrice = unitPrice * existingItem.quantity;
      setCart(updatedCart);
    } else {
      // 없으면 새로 추가
      setCart([...cart, item]);
    }
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    try {
      // 주문 데이터 생성
      const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
      const orderItems = cart.map(item => ({
        menuId: item.menuId,
        name: item.name,
        quantity: item.quantity,
        price: item.basePrice,
        options: item.options,
      }));

      // API를 통해 주문 생성
      const result = await orderAPI.create(orderItems, totalAmount);
      
      alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`);
      // 장바구니 비우기
      setCart([]);
    } catch (err) {
      console.error('주문 생성 오류:', err);
      alert(`주문에 실패했습니다: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="order-page">메뉴를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="order-page">
        <div style={{ color: 'red', padding: '2rem' }}>{error}</div>
        <button onClick={loadMenus}>다시 시도</button>
      </div>
    );
  }

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

