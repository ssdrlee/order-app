import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'order' && <OrderPage />}
        {currentPage === 'admin' && (
          <div className="admin-placeholder">
            <h2>관리자 화면</h2>
            <p>관리자 화면은 추후 구현 예정입니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
