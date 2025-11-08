import '../styles/Header.css';

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <span className="brand-name">COZY</span>
        </div>
        <nav className="navigation">
          <button 
            className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => onNavigate('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

