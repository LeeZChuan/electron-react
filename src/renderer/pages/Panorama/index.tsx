import React from 'react';
import './styles.css';

const Panorama: React.FC = () => {
  return (
    <div className="panorama-container">
      <div className="page-header">
        <h1>市场全景</h1>
        <div className="header-actions">
          <button className="btn-primary">刷新</button>
          <button className="btn-secondary">设置</button>
        </div>
      </div>
      
      <div className="panorama-content">
        <div className="panorama-overview">
          <div className="overview-card">
            <h3>市场概况</h3>
            <div className="overview-stats">
              <div className="stat-item">
                <span className="label">上涨家数</span>
                <span className="value positive">1,234</span>
              </div>
              <div className="stat-item">
                <span className="label">下跌家数</span>
                <span className="value negative">567</span>
              </div>
              <div className="stat-item">
                <span className="label">平盘家数</span>
                <span className="value">89</span>
              </div>
            </div>
          </div>
          
          <div className="overview-card">
            <h3>板块表现</h3>
            <div className="sector-performance">
              <div className="sector-item positive">
                <span>银行</span>
                <span>+2.34%</span>
              </div>
              <div className="sector-item positive">
                <span>房地产</span>
                <span>+1.87%</span>
              </div>
              <div className="sector-item negative">
                <span>科技</span>
                <span>-0.56%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panorama; 