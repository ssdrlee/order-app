import '../styles/InventoryCard.css';

function InventoryCard({ inventory, onUpdate }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'status-out-of-stock' };
    if (stock < 5) return { text: '주의', className: 'status-warning' };
    return { text: '정상', className: 'status-normal' };
  };

  const handleIncrease = () => {
    onUpdate(inventory.menuId, inventory.stock + 1);
  };

  const handleDecrease = () => {
    if (inventory.stock > 0) {
      onUpdate(inventory.menuId, inventory.stock - 1);
    }
  };

  const status = getStockStatus(inventory.stock);

  return (
    <div className="inventory-card">
      <h3 className="inventory-menu-name">{inventory.name}</h3>
      <div className="inventory-stock-info">
        <span className="inventory-stock">{inventory.stock}개</span>
        <span className={`inventory-status ${status.className}`}>{status.text}</span>
      </div>
      <div className="inventory-controls">
        <button 
          className="inventory-button decrease-button" 
          onClick={handleDecrease}
          disabled={inventory.stock === 0}
        >
          -
        </button>
        <button 
          className="inventory-button increase-button" 
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default InventoryCard;

