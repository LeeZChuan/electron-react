import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import About from './Abort';
import Messages from './Dashboard';

export default function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard/messages">Messages (Dashboard)</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* 这里处理 Home 组件的内部路由 */}
      <Routes>
        <Route path="/" element={<div>Welcome to Home Page!</div>} />
        <Route path="about" element={<About />} />
        <Route path="dashboard/messages" element={<Messages />} />
      </Routes>
    </div>
  );
}
