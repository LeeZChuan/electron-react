import React from 'react';
import './styles.css';
import { User } from '../../utils/auth';

interface WatchlistProps {
  onLogout?: () => void;
  currentUser?: User | null;
  onPageChange?: (page: string) => void;
  isSubPage?: boolean;
}

const Watchlist: React.FC<WatchlistProps> = ({ onLogout, currentUser, onPageChange, isSubPage = false }) => {
  // 如果是子页面，使用简化的布局
  if (isSubPage) {
    return (
      <div className="watchlist-sub-page">
        <div className="watchlist-content">
          <div className="watchlist-table">
            <div className="table-header">
              <div className="col-code">代码</div>
              <div className="col-name">名称</div>
              <div className="col-price">最新价</div>
              <div className="col-change">涨跌幅</div>
              <div className="col-actions">操作</div>
            </div>
            
            <div className="table-body">
              <div className="table-row">
                <div className="col-code">000001</div>
                <div className="col-name">平安银行</div>
                <div className="col-price">12.34</div>
                <div className="col-change positive">+2.45%</div>
                <div className="col-actions">
                  <button className="btn-small">K线</button>
                  <button className="btn-small">删除</button>
                </div>
              </div>
              
              <div className="table-row">
                <div className="col-code">000002</div>
                <div className="col-name">万科A</div>
                <div className="col-price">18.56</div>
                <div className="col-change negative">-1.23%</div>
                <div className="col-actions">
                  <button className="btn-small">K线</button>
                  <button className="btn-small">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <div className="page-header">
        <h1>自选股</h1>
        <div className="header-actions">
          <button className="btn-primary">添加自选</button>
          <button className="btn-secondary">导入</button>
          <button className="btn-secondary">导出</button>
        </div>
      </div>
      
      <div className="watchlist-content">
        <div className="watchlist-table">
          <div className="table-header">
            <div className="col-code">代码</div>
            <div className="col-name">名称</div>
            <div className="col-price">最新价</div>
            <div className="col-change">涨跌幅</div>
            <div className="col-volume">成交量</div>
            <div className="col-amount">成交额</div>
            <div className="col-actions">操作</div>
          </div>
          
          <div className="table-body">
            <div className="table-row">
              <div className="col-code">000001</div>
              <div className="col-name">平安银行</div>
              <div className="col-price">12.34</div>
              <div className="col-change positive">+2.45%</div>
              <div className="col-volume">1,234,567</div>
              <div className="col-amount">15,234.56万</div>
              <div className="col-actions">
                <button className="btn-small">K线</button>
                <button className="btn-small">删除</button>
              </div>
            </div>
            
            <div className="table-row">
              <div className="col-code">000002</div>
              <div className="col-name">万科A</div>
              <div className="col-price">18.56</div>
              <div className="col-change negative">-1.23%</div>
              <div className="col-volume">2,345,678</div>
              <div className="col-amount">43,567.89万</div>
              <div className="col-actions">
                <button className="btn-small">K线</button>
                <button className="btn-small">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist; 