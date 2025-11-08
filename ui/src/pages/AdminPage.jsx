import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import InventoryCard from '../components/InventoryCard';
import OrderList from '../components/OrderList';
import { adminAPI } from '../utils/api';
import '../styles/AdminPage.css';

function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, received: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로드
  useEffect(() => {
    loadData();
    
    // 주기적으로 데이터 새로고침 (5초마다)
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [ordersData, inventoryData, statsData] = await Promise.all([
        adminAPI.getAllOrders(),
        adminAPI.getInventory(),
        adminAPI.getDashboardStats()
      ]);
      setOrders(ordersData);
      setInventory(inventoryData);
      setStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 재고 업데이트
  const handleInventoryUpdate = async (menuId, newStock) => {
    try {
      await adminAPI.updateInventory(menuId, newStock);
      // 업데이트 후 재고 목록 새로고침
      const inventoryData = await adminAPI.getInventory();
      setInventory(inventoryData);
    } catch (err) {
      console.error('재고 업데이트 오류:', err);
      alert(`재고 업데이트에 실패했습니다: ${err.message}`);
    }
  };

  // 주문 상태 변경
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      // 업데이트 후 주문 목록 및 통계 새로고침
      const [ordersData, statsData, inventoryData] = await Promise.all([
        adminAPI.getAllOrders(),
        adminAPI.getDashboardStats(),
        adminAPI.getInventory()
      ]);
      setOrders(ordersData);
      setStats(statsData);
      setInventory(inventoryData);
    } catch (err) {
      console.error('주문 상태 변경 오류:', err);
      throw err; // OrderList에서 에러 메시지를 표시할 수 있도록 throw
    }
  };

  if (loading) {
    return <div className="admin-page">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="admin-page">
        <div style={{ color: 'red', padding: '2rem' }}>{error}</div>
        <button onClick={loadData}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="dashboard-section">
        <Dashboard stats={stats} />
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

