import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
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
        {currentPage === 'admin' && <AdminPage />}
      </main>
    </div>
  );
}

export default App;
