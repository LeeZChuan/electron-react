import React, { useState, useEffect } from 'react';
import './styles.css';
import { User } from '../../utils/auth';
import TopBar, { TopBarTab } from '../../components/TopBar';
import Stocks from '../Stocks';
import Watchlist from '../Watchlist';

interface DashboardLayoutProps {
  onLogout?: () => void;
  currentUser?: User | null;
  onPageChange?: (page: string) => void;
  currentSubPage?: string;
}

function DashboardLayout({ onLogout, currentUser, onPageChange, currentSubPage = 'stocks' }: DashboardLayoutProps) {
  const [currentSubPageState, setCurrentSubPageState] = useState(currentSubPage);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // 初始化主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 顶部导航栏tab配置
  const tabs: TopBarTab[] = [
    { key: 'watchlist', label: '自选股', href: '#/watchlist' },
    { key: 'market', label: '大盘', href: '#/market' },
    { key: 'sectors', label: '板块', href: '#/sectors' },
    { key: 'individual', label: '个股', href: '#/individual' },
    { key: 'panorama', label: '全景', href: '#/panorama' },
    { key: 'futures', label: '期货', href: '#/futures' },
    { key: 'funds', label: '基金', href: '#/funds' },
    { key: 'bonds', label: '债券', href: '#/bonds' },
    { key: 'stocks', label: '股票', href: '#/stocks' },
  ];

  // 处理子页面切换
  const handleSubPageChange = (subPage: string) => {
    setCurrentSubPageState(subPage);
  };

  // 处理登出
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // 处理主题切换
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    // 保存主题设置到本地存储
    localStorage.setItem('theme', newTheme);
  };

  // 渲染子页面内容
  const renderSubPage = () => {
    switch (currentSubPageState) {
      case 'stocks':
        return (
          <div className="sub-page-wrapper">
            <Stocks 
              onLogout={handleLogout} 
              currentUser={currentUser} 
              onPageChange={onPageChange}
              isSubPage={true}
              theme={theme}
              onThemeChange={handleThemeChange}
            />
          </div>
        );
      case 'watchlist':
        return (
          <div className="sub-page-wrapper">
            <Watchlist 
              onLogout={handleLogout} 
              currentUser={currentUser} 
              onPageChange={onPageChange}
              isSubPage={true}
            />
          </div>
        );
      case 'market':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>大盘行情</h2>
              <p>市场整体表现</p>
            </div>
            <div className="sub-page-content">
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
            </div>
          </div>
        );
      case 'sectors':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>板块行情</h2>
              <p>行业板块表现</p>
            </div>
            <div className="sub-page-content">
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
              </div>
            </div>
          </div>
        );
      case 'individual':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>个股行情</h2>
              <p>个股详细信息</p>
            </div>
            <div className="sub-page-content">
              <div className="individual-info">
                <p>个股页面开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'panorama':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>市场全景</h2>
              <p>市场整体概况</p>
            </div>
            <div className="sub-page-content">
              <div className="panorama-info">
                <p>全景页面开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'futures':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>期货行情</h2>
              <p>期货市场数据</p>
            </div>
            <div className="sub-page-content">
              <div className="futures-info">
                <p>期货页面开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'funds':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>基金行情</h2>
              <p>基金市场数据</p>
            </div>
            <div className="sub-page-content">
              <div className="funds-info">
                <p>基金页面开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'bonds':
        return (
          <div className="sub-page-container">
            <div className="sub-page-header">
              <h2>债券行情</h2>
              <p>债券市场数据</p>
            </div>
            <div className="sub-page-content">
              <div className="bonds-info">
                <p>债券页面开发中...</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="sub-page-wrapper">
            <Stocks 
              onLogout={handleLogout} 
              currentUser={currentUser} 
              onPageChange={onPageChange}
              isSubPage={true}
            />
          </div>
        );
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* 顶部导航栏 */}
      <TopBar
        tabs={tabs}
        activeKey={'dashboard'}
        user={currentUser || null}
        onLogout={handleLogout}
        onPageChange={onPageChange}
        onSubPageChange={handleSubPageChange}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      <div className="dashboard-main">
        {renderSubPage()}
      </div>
    </div>
  );
}

interface DashboardProps {
  onLogout?: () => void;
  currentUser?: User | null;
  onPageChange?: (page: string) => void;
}

export default function Dashboard({ onLogout, currentUser, onPageChange }: DashboardProps) {
  return <DashboardLayout onLogout={onLogout} currentUser={currentUser} onPageChange={onPageChange} />;
}
