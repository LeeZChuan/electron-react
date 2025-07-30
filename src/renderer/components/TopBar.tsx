import React from 'react';
import './TopBar.css';

export interface TopBarTab {
  key: string;
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface TopBarProps {
  tabs: TopBarTab[];
  activeKey: string;
  user: {
    username: string;
    role?: string;
  } | null;
  onLogout: () => void;
  onPageChange?: (page: string) => void;
  onSubPageChange?: (subPage: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ tabs, activeKey, user, onLogout, onPageChange, onSubPageChange }) => {
  return (
    <div className="topbar-container">
      <div className="topbar-tabs">
        {tabs.map(tab => (
          <a
            key={tab.key}
            href={tab.href || '#'}
            className={`topbar-tab${activeKey === tab.key ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if (tab.onClick) {
                tab.onClick();
              } else if (activeKey === 'dashboard' && onSubPageChange) {
                // 如果在dashboard页面，切换到子页面
                onSubPageChange(tab.key);
              } else if (onPageChange) {
                onPageChange(tab.key);
              }
            }}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="topbar-user">
        <div className="user-avatar">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.username || '用户'}</div>
          <div className="user-role">{user?.role === 'admin' ? '管理员' : '普通用户'}</div>
        </div>
        <button className="logout-btn" onClick={onLogout}>退出</button>
      </div>
    </div>
  );
};

export default TopBar; 