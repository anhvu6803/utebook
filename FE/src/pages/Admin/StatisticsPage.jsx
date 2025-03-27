import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './styles/StatisticsPage.scss';
import * as XLSX from 'xlsx';

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [statisticsData, setStatisticsData] = useState({
    summary: {
      totalRevenue: 0,
      totalUsers: 0,
      activeReaders: 0,
      totalBooks: 0
    },
    revenueData: [],
    membershipData: [],
    pointsData: [],
    readingData: []
  });
  const statisticsRef = useRef(null);

  useEffect(() => {
    // Giả lập dữ liệu - sau này sẽ thay bằng API call
    const generateData = () => {
      // Dữ liệu doanh thu
      const revenue = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        membership: Math.floor(Math.random() * 5000000) + 1000000,
        points: Math.floor(Math.random() * 3000000) + 500000,
        total: 0
      }));
      revenue.forEach(day => day.total = day.membership + day.points);

      // Dữ liệu hội viên
      const membership = [
        { name: 'Gói tháng', value: 45 },
        { name: 'Gói quý', value: 30 },
        { name: 'Gói năm', value: 25 }
      ];

      // Dữ liệu đọc sách
      const reading = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        users: Math.floor(Math.random() * 1000) + 500,
        books: Math.floor(Math.random() * 2000) + 1000
      }));

      // Dữ liệu nạp điểm
      const points = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        amount: Math.floor(Math.random() * 1000000) + 200000,
        transactions: Math.floor(Math.random() * 100) + 20
      }));

      setStatisticsData({
        summary: {
          totalRevenue: revenue.reduce((acc, curr) => acc + curr.total, 0),
          totalUsers: 15000,
          activeReaders: 8500,
          totalBooks: 12000
        },
        revenueData: revenue,
        membershipData: membership,
        pointsData: points,
        readingData: reading
      });
    };

    generateData();
  }, [timeRange]);

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleDownloadExcel = () => {
    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();

    // Hàm tạo style cho cell
    const createStyle = (opts = {}) => ({
      font: { name: 'Arial', bold: opts.bold, sz: opts.fontSize || 11 },
      alignment: { 
        horizontal: opts.align || 'left',
        vertical: 'center',
        wrapText: opts.wrap || false
      },
      fill: opts.fill ? {
        fgColor: { rgb: opts.fill },
        patternType: 'solid'
      } : undefined,
      border: opts.border ? {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      } : undefined
    });

    // 1. Sheet Tổng quan
    const summaryData = [
      ['BÁO CÁO THỐNG KÊ TỔNG QUAN'],
      ['Thời gian xuất báo cáo:', new Date().toLocaleString('vi-VN')],
      [],
      ['CHỈ SỐ', 'GIÁ TRỊ', 'SO VỚI KỲ TRƯỚC', 'BIẾN ĐỘNG'],
      ['Tổng doanh thu', formatCurrency(statisticsData.summary.totalRevenue), '+15%', '↑'],
      ['Tổng người dùng', statisticsData.summary.totalUsers, '+8%', '↑'],
      ['Người dùng hoạt động', statisticsData.summary.activeReaders, '+12%', '↑'],
      ['Tổng số sách', statisticsData.summary.totalBooks, '+5%', '↑'],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // 2. Sheet Doanh thu
    const revenueData = [
      ['THỐNG KÊ DOANH THU THEO NGÀY'],
      [],
      ['Ngày', 'Doanh thu hội viên (VNĐ)', 'Doanh thu nạp điểm (VNĐ)', 'Tổng doanh thu (VNĐ)'],
      ...statisticsData.revenueData.map(item => [
        item.date,
        item.membership,
        item.points,
        item.membership + item.points
      ])
    ];
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);

    // Thêm chart range cho sheet doanh thu
    revenueSheet['!charts'] = [{
      type: 'line',
      range: ['C4', `D${revenueData.length}`],
      title: 'Biểu đồ doanh thu theo ngày',
      labels: ['B4', `B${revenueData.length}`]
    }];

    // 3. Sheet Hội viên với biểu đồ tròn
    const membershipData = [
      ['PHÂN BỒ GÓI HỘI VIÊN'],
      [],
      ['Loại gói', 'Số lượng', 'Tỷ lệ (%)'],
      ...statisticsData.membershipData.map(item => [
        item.name,
        item.value,
        `${item.value}%`
      ])
    ];
    const membershipSheet = XLSX.utils.aoa_to_sheet(membershipData);

    // Thêm chart range cho sheet hội viên
    membershipSheet['!charts'] = [{
      type: 'pie',
      range: ['B4', `B${membershipData.length}`],
      title: 'Phân bố gói hội viên',
      labels: ['A4', `A${membershipData.length}`]
    }];

    // 4. Sheet Đọc sách với biểu đồ cột
    const readingData = [
      ['THỐNG KÊ ĐỌC SÁCH'],
      [],
      ['Ngày', 'Số người đọc', 'Số sách được đọc', 'Tỷ lệ sách/người'],
      ...statisticsData.readingData.map(item => [
        item.date,
        item.users,
        item.books,
        (item.books / item.users).toFixed(2)
      ])
    ];
    const readingSheet = XLSX.utils.aoa_to_sheet(readingData);

    // Thêm chart range cho sheet đọc sách
    readingSheet['!charts'] = [{
      type: 'column',
      range: ['B4', `C${readingData.length}`],
      title: 'Thống kê đọc sách theo ngày',
      labels: ['A4', `A${readingData.length}`]
    }];

    // 5. Sheet Nạp điểm
    const pointsData = [
      ['THỐNG KÊ NẠP ĐIỂM'],
      [],
      ['Ngày', 'Số điểm', 'Số giao dịch', 'Điểm trung bình/giao dịch'],
      ...statisticsData.pointsData.map(item => [
        item.date,
        item.amount,
        item.transactions,
        Math.round(item.amount / item.transactions)
      ])
    ];
    const pointsSheet = XLSX.utils.aoa_to_sheet(pointsData);

    // Áp dụng style cho tất cả các sheet
    [summarySheet, revenueSheet, membershipSheet, readingSheet, pointsSheet].forEach(sheet => {
      // Đặt độ rộng cột
      sheet['!cols'] = [
        { wch: 25 }, // Cột A
        { wch: 20 }, // Cột B
        { wch: 20 }, // Cột C
        { wch: 20 }  // Cột D
      ];

      // Đặt độ cao hàng
      sheet['!rows'] = [{ hpt: 30 }]; // Hàng tiêu đề cao hơn

      // Style cho tiêu đề chính
      if (sheet['A1']) {
        sheet['A1'].s = createStyle({
          bold: true,
          fontSize: 16,
          align: 'center',
          fill: 'E6E6FA',
          border: true
        });
      }

      // Style cho header của bảng
      const headerRow = sheet['A3'] ? 3 : 4;
      for (let col = 0; col < 4; col++) {
        const cell = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (sheet[cell]) {
          sheet[cell].s = createStyle({
            bold: true,
            align: 'center',
            fill: 'F0F8FF',
            border: true
          });
        }
      }

      // Style cho dữ liệu
      for (let row = headerRow + 1; row < 20; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: col });
          if (sheet[cell]) {
            sheet[cell].s = createStyle({
              border: true,
              align: col === 0 ? 'left' : 'right'
            });
          }
        }
      }
    });

    // Thêm các sheet vào workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan");
    XLSX.utils.book_append_sheet(workbook, revenueSheet, "Doanh thu");
    XLSX.utils.book_append_sheet(workbook, membershipSheet, "Hội viên");
    XLSX.utils.book_append_sheet(workbook, readingSheet, "Đọc sách");
    XLSX.utils.book_append_sheet(workbook, pointsSheet, "Nạp điểm");

    // Xuất file với tên có timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `bao-cao-thong-ke-${timestamp}.xlsx`, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true,
      compression: true
    });
  };

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>Thống kê tổng quan</h1>
        <div className="header-actions">
          <div className="time-range-selector">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="year">365 ngày qua</option>
            </select>
          </div>
          <button className="download-btn" onClick={handleDownloadExcel}>
            <FileDownloadIcon /> Tải Excel
          </button>
        </div>
      </div>

      <div ref={statisticsRef}>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon revenue">
              <TrendingUpIcon />
            </div>
            <div className="card-content">
              <h3>Tổng doanh thu</h3>
              <p>{formatCurrency(statisticsData.summary.totalRevenue)}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon users">
              <PeopleIcon />
            </div>
            <div className="card-content">
              <h3>Tổng người dùng</h3>
              <p>{statisticsData.summary.totalUsers.toLocaleString()}</p>
              <span className="sub-text">
                {statisticsData.summary.activeReaders.toLocaleString()} người dùng hoạt động
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon books">
              <MenuBookIcon />
            </div>
            <div className="card-content">
              <h3>Tổng số sách</h3>
              <p>{statisticsData.summary.totalBooks.toLocaleString()}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon points">
              <AccountBalanceWalletIcon />
            </div>
            <div className="card-content">
              <h3>Giao dịch điểm</h3>
              <p>{statisticsData.pointsData[statisticsData.pointsData.length - 1]?.transactions || 0} giao dịch</p>
              <span className="sub-text">Hôm nay</span>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container revenue-chart">
            <h2>Doanh thu theo ngày</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statisticsData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
                  tickMargin={10}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelStyle={{ color: '#333' }}
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="membership" 
                  name="Hội viên" 
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4CAF50' }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  name="Nạp điểm" 
                  stroke="#2196F3"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#2196F3' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container membership-chart">
            <h2>Phân bố gói hội viên</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statisticsData.membershipData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container reading-chart">
            <h2>Thống kê đọc sách</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statisticsData.readingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Người đọc" fill="#8884d8" />
                <Bar dataKey="books" name="Sách được đọc" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container points-chart">
            <h2>Thống kê nạp điểm</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statisticsData.pointsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Số điểm" stroke="#8884d8" />
                <Line type="monotone" dataKey="transactions" name="Số giao dịch" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
