import '../styles/Dashboard.css';

function Dashboard({ orders }) {
  // 주문 통계 계산
  const stats = {
    total: orders.length,
    received: orders.filter(order => order.status === '주문 접수').length,
    inProgress: orders.filter(order => order.status === '제조 중').length,
    completed: orders.filter(order => order.status === '제조 완료').length,
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{stats.received}</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

