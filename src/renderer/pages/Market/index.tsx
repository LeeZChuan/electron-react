import React from 'react';
import './styles.css';

const Market: React.FC = () => {
  return (
    <div className="market-container">
      <div className="page-header">
        <h1>大盘行情</h1>
        <div className="header-actions">
          <button className="btn-primary">刷新</button>
          <button className="btn-secondary">设置</button>
        </div>
      </div>
      
      <div className="market-content">
        <div className="market-overview">
          <div className="market-card">
            <div className="market-name">上证指数</div>
            <div className="market-code">000001</div>
            <div className="market-price">3,234.56</div>
            <div className="market-change positive">+45.67 (+1.43%)</div>
          </div>
          
          <div className="market-card">
            <div className="market-name">深证成指</div>
            <div className="market-code">399001</div>
            <div className="market-price">12,345.67</div>
            <div className="market-change positive">+123.45 (+1.01%)</div>
          </div>
          
          <div className="market-card">
            <div className="market-name">创业板指</div>
            <div className="market-code">399006</div>
            <div className="market-price">2,345.67</div>
            <div className="market-change negative">-23.45 (-0.99%)</div>
          </div>
        </div>
        
        <div className="market-details">
          <div className="detail-section">
            <h3>市场概况</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">上涨家数</span>
                <span className="value positive">1,234</span>
              </div>
              <div className="detail-item">
                <span className="label">下跌家数</span>
                <span className="value negative">567</span>
              </div>
              <div className="detail-item">
                <span className="label">平盘家数</span>
                <span className="value">89</span>
              </div>
              <div className="detail-item">
                <span className="label">涨停家数</span>
                <span className="value positive">45</span>
              </div>
              <div className="detail-item">
                <span className="label">跌停家数</span>
                <span className="value negative">12</span>
              </div>
              <div className="detail-item">
                <span className="label">总成交额</span>
                <span className="value">5,678.90亿</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market; 