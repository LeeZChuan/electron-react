import React from 'react';
import './styles.css';

const Bonds: React.FC = () => {
  return (
    <div className="bonds-container">
      <div className="page-header">
        <h1>债券行情</h1>
        <div className="header-actions">
          <button className="btn-primary">刷新</button>
          <button className="btn-secondary">设置</button>
        </div>
      </div>
      
      <div className="bonds-content">
        <div className="bonds-overview">
          <div className="bonds-card">
            <div className="bonds-name">国债10年期</div>
            <div className="bonds-code">019654</div>
            <div className="bonds-price">101.234</div>
            <div className="bonds-change positive">+0.123 (+0.12%)</div>
          </div>
          
          <div className="bonds-card">
            <div className="bonds-name">国开债5年期</div>
            <div className="bonds-code">018006</div>
            <div className="bonds-price">100.567</div>
            <div className="bonds-change negative">-0.045 (-0.04%)</div>
          </div>
          
          <div className="bonds-card">
            <div className="bonds-name">地方政府债</div>
            <div className="bonds-code">127045</div>
            <div className="bonds-price">99.876</div>
            <div className="bonds-change positive">+0.234 (+0.23%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bonds; 