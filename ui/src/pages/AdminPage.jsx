import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import InventoryCard from '../components/InventoryCard';
import OrderList from '../components/OrderList';
import { orderStorage, inventoryStorage } from '../utils/storage';
import '../styles/AdminPage.css';

function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  // 데이터 로드
  useEffect(() => {
    loadData();
    
    // 주기적으로 데이터 새로고침 (실제로는 WebSocket이나 폴링 사용)
    // 5초마다 새로고침으로 변경 (성능 개선)
    const interval = setInterval(() => {
      loadData();
    }, 5000); // 5초마다 새로고침

    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setOrders(orderStorage.getAll());
    setInventory(inventoryStorage.getAll());
  };

  // 재고 업데이트
  const handleInventoryUpdate = (menuId, newStock) => {
    inventoryStorage.update(menuId, newStock);
    setInventory(inventoryStorage.getAll());
  };

  // 주문 상태 변경
  const handleStatusChange = (orderId, newStatus) => {
    orderStorage.updateStatus(orderId, newStatus);
    setOrders(orderStorage.getAll());
  };

  return (
    <div className="admin-page">
      <div className="dashboard-section">
        <Dashboard orders={orders} />
      </div>

      <div className="inventory-section">
        <h2 className="section-title">재고 현황</h2>
        <div className="inventory-grid">
          {inventory.map(item => (
            <InventoryCard
              key={item.menuId}
              inventory={item}
              onUpdate={handleInventoryUpdate}
            />
          ))}
        </div>
      </div>

      <div className="order-section">
        <OrderList
          orders={orders}
          inventory={inventory}
          onStatusChange={handleStatusChange}
          onInventoryUpdate={handleInventoryUpdate}
        />
      </div>
    </div>
  );
}

export default AdminPage;

