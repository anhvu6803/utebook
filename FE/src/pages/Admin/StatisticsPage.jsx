import { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './styles/StatisticsPage.scss';
import * as XLSX from 'xlsx';
import axios from 'axios';

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [statisticsData, setStatisticsData] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeMembers: 0,
    revenue: {
      totalAmount: 0,
      totalTransactions: 0
    },
    packageStatistics: {
      membership: [],
      point: []
    },
    paymentStatistics: []
  });
  const statisticsRef = useRef(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/statistics');
        if (response.data.success) {
          setStatisticsData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // 1. Sheet Tổng quan
    const summaryData = [
      ['BÁO CÁO THỐNG KÊ TỔNG QUAN'],
      ['Thời gian xuất báo cáo:', new Date().toLocaleString('vi-VN')],
      [],
      ['CHỈ SỐ', 'GIÁ TRỊ'],
      ['Tổng doanh thu', formatCurrency(statisticsData.revenue.totalAmount)],
      ['Tổng người dùng', statisticsData.totalUsers],
      ['Hội viên đang hoạt động', statisticsData.activeMembers],
      ['Tổng số sách', statisticsData.totalBooks],
      ['Tổng số giao dịch', statisticsData.revenue.totalTransactions],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // 2. Sheet Gói hội viên
    const membershipData = [
      ['THỐNG KÊ GÓI HỘI VIÊN'],
      [],
      ['Tên gói', 'Số lượng', 'Tổng tiền', 'Giá gốc', 'Giảm giá'],
      ...statisticsData.packageStatistics.membership.map(item => [
        item.packageName,
        item.count,
        formatCurrency(item.totalAmount),
        formatCurrency(item.packagePrice),
        formatCurrency(item.discount)
      ])
    ];
    const membershipSheet = XLSX.utils.aoa_to_sheet(membershipData);

    // 3. Sheet Gói điểm
    const pointData = [
      ['THỐNG KÊ GÓI ĐIỂM'],
      [],
      ['Tên gói', 'Số lượng', 'Tổng tiền', 'Giá gốc', 'Giảm giá', 'Tổng điểm'],
      ...statisticsData.packageStatistics.point.map(item => [
        item.packageName,
        item.count,
        formatCurrency(item.totalAmount),
        formatCurrency(item.packagePrice),
        formatCurrency(item.discount),
        item.totalPoints || 0
      ])
    ];
    const pointSheet = XLSX.utils.aoa_to_sheet(pointData);

    // 4. Sheet Phương thức thanh toán
    const paymentData = [
      ['THỐNG KÊ PHƯƠNG THỨC THANH TOÁN'],
      [],
      ['Phương thức', 'Số giao dịch', 'Tổng tiền'],
      ...statisticsData.paymentStatistics.map(item => [
        item.method.toUpperCase(),
        item.count,
        formatCurrency(item.totalAmount)
      ])
    ];
    const paymentSheet = XLSX.utils.aoa_to_sheet(paymentData);

    // Áp dụng style cho tất cả các sheet
    [summarySheet, membershipSheet, pointSheet, paymentSheet].forEach(sheet => {
      // Đặt độ rộng cột
      sheet['!cols'] = [
        { wch: 30 }, // Cột A
        { wch: 15 }, // Cột B
        { wch: 20 }, // Cột C
        { wch: 20 }, // Cột D
        { wch: 20 }, // Cột E
        { wch: 20 }  // Cột F
      ];

      // Style cho tiêu đề chính
      if (sheet['A1']) {
        sheet['A1'].s = {
          font: { bold: true, sz: 16 },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: "E6E6FA" } }
        };
      }
    });

    // Thêm các sheet vào workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan");
    XLSX.utils.book_append_sheet(workbook, membershipSheet, "Gói hội viên");
    XLSX.utils.book_append_sheet(workbook, pointSheet, "Gói điểm");
    XLSX.utils.book_append_sheet(workbook, paymentSheet, "Thanh toán");

    // Xuất file
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `bao-cao-thong-ke-${timestamp}.xlsx`);
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
              <p>{formatCurrency(statisticsData.revenue.totalAmount)}</p>
              <span className="sub-text">
                {statisticsData.revenue.totalTransactions} giao dịch
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon users">
              <PeopleIcon />
            </div>
            <div className="card-content">
              <h3>Tổng người dùng</h3>
              <p>{statisticsData.totalUsers.toLocaleString()}</p>
              <span className="sub-text">
                {statisticsData.activeMembers.toLocaleString()} hội viên đang hoạt động
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon books">
              <MenuBookIcon />
            </div>
            <div className="card-content">
              <h3>Tổng số sách</h3>
              <p>{statisticsData.totalBooks.toLocaleString()}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon points">
              <AccountBalanceWalletIcon />
            </div>
            <div className="card-content">
              <h3>Gói điểm</h3>
              <p>{statisticsData.packageStatistics.point.length} loại gói</p>
              <span className="sub-text">
                {statisticsData.packageStatistics.point.reduce((sum, pkg) => sum + pkg.count, 0)} giao dịch
              </span>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container membership-chart">
            <h2>Phân bố gói hội viên</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statisticsData.packageStatistics.membership}
                  dataKey="count"
                  nameKey="packageName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container point-chart">
            <h2>Phân bố gói điểm</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statisticsData.packageStatistics.point}
                  dataKey="count"
                  nameKey="packageName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container payment-chart">
            <h2>Phương thức thanh toán</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statisticsData.paymentStatistics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="totalAmount" name="Tổng tiền" fill="#8884d8" />
                <Bar dataKey="count" name="Số giao dịch" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container revenue-chart">
            <h2>Doanh thu theo loại gói</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                {
                  name: 'Hội viên',
                  amount: statisticsData.packageStatistics.membership.reduce((sum, pkg) => sum + pkg.totalAmount, 0)
                },
                {
                  name: 'Điểm',
                  amount: statisticsData.packageStatistics.point.reduce((sum, pkg) => sum + pkg.totalAmount, 0)
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" name="Doanh thu" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
