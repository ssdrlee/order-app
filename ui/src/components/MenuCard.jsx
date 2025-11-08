import { useState } from 'react';
import '../styles/MenuCard.css';

// 상수 정의 (매직 넘버 제거)
const SHOT_PRICE = 500;
const SYRUP_PRICE = 0;

function MenuCard({ menu, onAddToCart }) {
  const [shotAdded, setShotAdded] = useState(false);
  const [syrupAdded, setSyrupAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const calculatePrice = () => {
    let total = menu.price;
    if (shotAdded) total += SHOT_PRICE;
    if (syrupAdded) total += SYRUP_PRICE;
    return total;
  };

  const handleAddToCart = () => {
    const item = {
      menuId: menu.id,
      name: menu.name,
      basePrice: menu.price,
      options: {
        shot: shotAdded,
        syrup: syrupAdded
      },
      quantity: 1,
      totalPrice: calculatePrice()
    };
    
    onAddToCart(item);
    
    // 옵션 초기화
    setShotAdded(false);
    setSyrupAdded(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        {imageError ? (
          <div className="image-placeholder">☕</div>
        ) : (
          <img src={menu.image} alt={menu.name} onError={handleImageError} />
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
        
        <div className="menu-options">
          <label className="option-label">
            <input
              type="checkbox"
              checked={shotAdded}
              onChange={(e) => setShotAdded(e.target.checked)}
            />
            <span>샷 추가 (+{SHOT_PRICE.toLocaleString()}원)</span>
          </label>
          <label className="option-label">
            <input
              type="checkbox"
              checked={syrupAdded}
              onChange={(e) => setSyrupAdded(e.target.checked)}
            />
            <span>시럽 추가 (+{SYRUP_PRICE.toLocaleString()}원)</span>
          </label>
        </div>
        
        <div className="menu-footer">
          <p className="final-price">최종 가격: {calculatePrice().toLocaleString()}원</p>
          <button className="add-button" onClick={handleAddToCart}>
            담기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;

