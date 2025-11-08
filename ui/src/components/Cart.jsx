import '../styles/Cart.css';

function Cart({ cartItems, onOrder }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const formatItemName = (item) => {
    let name = item.name;
    const options = [];
    if (item.options.shot) options.push('샷 추가');
    if (item.options.syrup) options.push('시럽 추가');
    if (options.length > 0) {
      name += ` (${options.join(', ')})`;
    }
    return name;
  };

  return (
    <div className="cart">
      <h2 className="cart-title">장바구니</h2>
      
      {cartItems.length === 0 ? (
        <p className="cart-empty">장바구니가 비어있습니다.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cartItems.map((item) => {
                // 고유 key 생성: menuId + 옵션 조합
                const uniqueKey = `${item.menuId}-${item.options.shot ? 'shot' : ''}-${item.options.syrup ? 'syrup' : ''}`;
                return (
                  <div key={uniqueKey} className="cart-item">
                    <span className="cart-item-name">{formatItemName(item)}</span>
                    <span className="cart-item-quantity">X {item.quantity}</span>
                    <span className="cart-item-price">{item.totalPrice.toLocaleString()}원</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="cart-summary-section">
            <div className="cart-total">
              <span>총 금액 </span>
              <span className="total-amount">{totalAmount.toLocaleString()}원</span>
            </div>
            
            <button className="order-button" onClick={onOrder}>
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

