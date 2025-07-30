import React from 'react';
import './styles.css';

const Funds: React.FC = () => {
  return (
    <div className="funds-container">
      <div className="page-header">
        <h1>基金行情</h1>
        <div className="header-actions">
          <button className="btn-primary">刷新</button>
          <button className="btn-secondary">设置</button>
        </div>
      </div>
      
      <div className="funds-content">
        <div className="funds-overview">
          <div className="funds-card">
            <div className="funds-name">华夏成长混合</div>
            <div className="funds-code">000001</div>
            <div className="funds-price">1.2345</div>
            <div className="funds-change positive">+0.0234 (+1.94%)</div>
          </div>
          
          <div className="funds-card">
            <div className="funds-name">易方达消费行业</div>
            <div className="funds-code">110022</div>
            <div className="funds-price">2.3456</div>
            <div className="funds-change negative">-0.0123 (-0.52%)</div>
          </div>
          
          <div className="funds-card">
            <div className="funds-name">嘉实增长混合</div>
            <div className="funds-code">070002</div>
            <div className="funds-price">3.4567</div>
            <div className="funds-change positive">+0.0456 (+1.34%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds; 