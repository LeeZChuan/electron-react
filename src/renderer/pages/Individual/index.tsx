import React from 'react';
import './styles.css';

const Individual: React.FC = () => {
  return (
    <div className="individual-container">
      <div className="page-header">
        <h1>个股行情</h1>
        <div className="header-actions">
          <input type="text" placeholder="输入股票代码或名称" className="search-input" />
          <button className="btn-primary">搜索</button>
        </div>
      </div>
      
      <div className="individual-content">
        <div className="stock-info">
          <div className="stock-header">
            <div className="stock-name">平安银行</div>
            <div className="stock-code">000001</div>
          </div>
          
          <div className="stock-price">
            <div className="current-price">12.34</div>
            <div className="price-change positive">+0.45 (+3.78%)</div>
          </div>
          
          <div className="stock-details">
            <div className="detail-row">
              <span className="label">今开</span>
              <span className="value">12.00</span>
            </div>
            <div className="detail-row">
              <span className="label">最高</span>
              <span className="value">12.56</span>
            </div>
            <div className="detail-row">
              <span className="label">最低</span>
              <span className="value">11.89</span>
            </div>
            <div className="detail-row">
              <span className="label">昨收</span>
              <span className="value">11.89</span>
            </div>
            <div className="detail-row">
              <span className="label">成交量</span>
              <span className="value">1,234,567手</span>
            </div>
            <div className="detail-row">
              <span className="label">成交额</span>
              <span className="value">15,234.56万</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Individual; 