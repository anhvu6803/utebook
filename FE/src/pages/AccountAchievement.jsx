// src/components/AchievementDashboard.js
import React from 'react';
import './styles/AccountAchievement.scss';

function AccountAchievement() {
  const stats = {
    companionTime: '2 tháng',
    booksRead: 4,
    audioBookListened: 1,
    readTimeToday: 0,
    listenTimeToday: 0,
    moneySaved: 120000,
  };


  return (
    <div className='achievement-settings'>
      <div className="achievement-header">
        <h1 className="title">Thành tích</h1>
      </div>
      <div className="achievement-content">
      <h1 className="achievement-content-title">Chung cuộc</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <i className="icon-companion"></i>
            <span>{stats.companionTime}</span>
            <label>Bạn đã đồng hành với Waka</label>
          </div>
          <div className="stat-card">
            <i className="icon-books"></i>
            <span>{stats.booksRead}</span>
            <label>Số sách đã đọc</label>
          </div>
          <div className="stat-card">
            <i className="icon-audiobooks"></i>
            <span>{stats.audioBookListened}</span>
            <label>Số audio sách đã nghe</label>
          </div>
          <div className="stat-card">
            <i className="icon-time"></i>
            <span>{stats.readTimeToday}</span>
            <label>Thời gian đọc hôm nay</label>
          </div>
          <div className="stat-card">
            <i className="icon-time"></i>
            <span>{stats.listenTimeToday}</span>
            <label>Thời gian nghe hôm nay</label>
          </div>
          <div className="stat-card">
            <i className="icon-money"></i>
            <span>{stats.moneySaved.toLocaleString()}đ</span>
            <label>Chi phí đã tiết kiệm</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountAchievement;