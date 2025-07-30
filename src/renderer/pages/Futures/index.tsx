import React from 'react';
import './styles.css';

const Futures: React.FC = () => {
  return (
    <div className="futures-container">
      <div className="page-header">
        <h1>期货行情</h1>
        <div className="header-actions">
          <button className="btn-primary">刷新</button>
          <button className="btn-secondary">设置</button>
        </div>
      </div>
      
      <div className="futures-content">
        <div className="futures-overview">
          <div className="futures-card">
            <div className="futures-name">黄金期货</div>
            <div className="futures-code">AU2406</div>
            <div className="futures-price">2,345.67</div>
            <div className="futures-change positive">+12.34 (+0.53%)</div>
          </div>
          
          <div className="futures-card">
            <div className="futures-name">原油期货</div>
            <div className="futures-code">SC2406</div>
            <div className="futures-price">456.78</div>
            <div className="futures-change negative">-3.45 (-0.75%)</div>
          </div>
          
          <div className="futures-card">
            <div className="futures-name">铜期货</div>
            <div className="futures-code">CU2406</div>
            <div className="futures-price">67,890.12</div>
            <div className="futures-change positive">+234.56 (+0.35%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futures; 