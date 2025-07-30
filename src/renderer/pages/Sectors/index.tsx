import React from 'react';
import './styles.css';

const Sectors: React.FC = () => {
  return (
    <div className="sectors-container">
      <div className="page-header">
        <h1>板块行情</h1>
        <div className="header-actions">
          <button className="btn-primary">刷新</button>
          <button className="btn-secondary">排序</button>
        </div>
      </div>
      
      <div className="sectors-content">
        <div className="sectors-grid">
          <div className="sector-card positive">
            <div className="sector-name">银行</div>
            <div className="sector-change">+2.34%</div>
            <div className="sector-count">42只股票</div>
          </div>
          
          <div className="sector-card positive">
            <div className="sector-name">房地产</div>
            <div className="sector-change">+1.87%</div>
            <div className="sector-count">38只股票</div>
          </div>
          
          <div className="sector-card negative">
            <div className="sector-name">科技</div>
            <div className="sector-change">-0.56%</div>
            <div className="sector-count">156只股票</div>
          </div>
          
          <div className="sector-card positive">
            <div className="sector-name">医药</div>
            <div className="sector-change">+3.21%</div>
            <div className="sector-count">89只股票</div>
          </div>
          
          <div className="sector-card negative">
            <div className="sector-name">汽车</div>
            <div className="sector-change">-1.23%</div>
            <div className="sector-count">67只股票</div>
          </div>
          
          <div className="sector-card positive">
            <div className="sector-name">消费</div>
            <div className="sector-change">+0.98%</div>
            <div className="sector-count">123只股票</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sectors; 