import '../styles/OrderList.css';

function OrderList({ orders, inventory, onStatusChange, onInventoryUpdate }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const formatOrderItems = (items) => {
    return items.map(item => {
      let name = item.name;
      if (item.options) {
        const options = [];
        if (item.options.shot) options.push('샷 추가');
        if (item.options.syrup) options.push('시럽 추가');
        if (options.length > 0) {
          name += ` (${options.join(', ')})`;
        }
      }
      return `${name} x ${item.quantity}`;
    }).join(', ');
  };

  const handleStatusChange = (orderId, newStatus) => {
    // 제조 시작 시 재고 차감
    if (newStatus === '제조 중') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.items) {
        order.items.forEach(item => {
          // 재고 차감
          const currentStock = inventory.find(inv => inv.menuId === item.menuId);
          if (currentStock) {
            const newStock = Math.max(0, currentStock.stock - item.quantity);
            onInventoryUpdate(item.menuId, newStock);
          }
        });
      }
    }
    onStatusChange(orderId, newStatus);
  };

  const getStatusButton = (order) => {
    if (order.status === '주문 접수') {
      return (
        <button 
          className="status-button status-received"
          onClick={() => handleStatusChange(order.id, '제조 중')}
        >
          제조 시작
        </button>
      );
    } else if (order.status === '제조 중') {
      return (
        <button 
          className="status-button status-in-progress"
          onClick={() => handleStatusChange(order.id, '제조 완료')}
        >
          제조 완료
        </button>
      );
    } else {
      return (
        <button 
          className="status-button status-completed"
          disabled
        >
          제조 완료
        </button>
      );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="order-list">
        <h2 className="order-list-title">주문 현황</h2>
        <p className="order-list-empty">주문이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="order-list">
      <h2 className="order-list-title">주문 현황</h2>
      <div className="order-items">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-info">
              <div className="order-date">{formatDate(order.orderDate)}</div>
              <div className="order-items-list">{formatOrderItems(order.items)}</div>
              <div className="order-amount">{order.totalAmount.toLocaleString()}원</div>
            </div>
            <div className="order-actions">
              {getStatusButton(order)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;

