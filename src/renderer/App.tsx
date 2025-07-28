import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { checkLoginStatus, getCurrentUser, logout, User } from './utils/auth';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = checkLoginStatus();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const user = getCurrentUser();
        setCurrentUser(user);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 登录成功处理
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const user = getCurrentUser();
    setCurrentUser(user);
  };

  // 登出处理
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // 加载中显示
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>正在加载...</p>
      </div>
    );
  }

  // 根据登录状态显示不同页面
  return (
    <div className="app">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} currentUser={currentUser} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
