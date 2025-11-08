import { useState } from 'react';
import '../styles/MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [shotAdded, setShotAdded] = useState(false);
  const [syrupAdded, setSyrupAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const shotPrice = 500;
  const syrupPrice = 0;
  
  const calculatePrice = () => {
    let total = menu.price;
    if (shotAdded) total += shotPrice;
    if (syrupAdded) total += syrupPrice;
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
            <span>샷 추가 (+{shotPrice.toLocaleString()}원)</span>
          </label>
          <label className="option-label">
            <input
              type="checkbox"
              checked={syrupAdded}
              onChange={(e) => setSyrupAdded(e.target.checked)}
            />
            <span>시럽 추가 (+{syrupPrice.toLocaleString()}원)</span>
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

