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
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

const TopBar: React.FC<TopBarProps> = ({ tabs, activeKey, user, onLogout, onPageChange, onSubPageChange, theme = 'dark', onThemeChange }) => {
  return (
    <div className={`topbar-container ${theme}`}>
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
        {/* 换肤按钮 */}
        <button 
          className="theme-toggle-btn" 
          onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
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