import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
// import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import Watchlist from './pages/Watchlist';
import Market from './pages/Market';
import Sectors from './pages/Sectors';
import Individual from './pages/Individual';
// import Panorama from './pages/Panorama';
// import Futures from './pages/Futures';
// import Funds from './pages/Funds';
// import Bonds from './pages/Bonds';
import { User } from './utils/auth';

// 页面类型定义
type PageType = 'login' | 'home' | 'dashboard' | 'stocks' | 'watchlist' | 'market' | 'sectors' | 'individual' | 'panorama' | 'futures' | 'funds' | 'bonds';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('login');

  // 检查用户登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    console.log('savedUser----', savedUser);
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        console.log('dashboard----');
        
        setCurrentPage('dashboard'); // 如果已登录，默认跳转到dashboard
      } catch (error) {
        console.error('解析用户信息失败:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // 处理登录成功
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('handleLoginSuccess----', user);
    
    setCurrentPage('dashboard'); // 登录成功后跳转到Dashboard页面
  };

  // 处理登出
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  // 处理页面切换
  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType);
  };

  // 根据当前页面渲染对应组件
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLoginSuccess={() => {
          // 从localStorage获取用户信息
          const savedUser = localStorage.getItem('auth_user');
          console.log('savedUser----', savedUser);
          
          if (savedUser) {
            const user = JSON.parse(savedUser);
            handleLoginSuccess(user);
          }
        }} />;
      case 'home':
        return <div>Home页面开发中...</div>;
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} currentUser={currentUser} onPageChange={handlePageChange} />;
      case 'stocks':
        return <Stocks onLogout={handleLogout} currentUser={currentUser} onPageChange={handlePageChange} />;
      case 'watchlist':
        return <Watchlist />;
      case 'market':
        return <Market />;
      case 'sectors':
        return <Sectors />;
      case 'individual':
        return <Individual />;
      case 'panorama':
        return <div>全景页面开发中...</div>;
      case 'futures':
        return <div>期货页面开发中...</div>;
      case 'funds':
        return <div>基金页面开发中...</div>;
      case 'bonds':
        return <div>债券页面开发中...</div>;
      default:
        return <Login onLoginSuccess={() => {
          // 从localStorage获取用户信息
          const savedUser = localStorage.getItem('auth_user');
          console.log('savedUser1221----', savedUser);
          
          if (savedUser) {
            const user = JSON.parse(savedUser);
            handleLoginSuccess(user);
          }
        }} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
