import "./styles/StatisticsPage.scss";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const bookSalesData = [
  { month: "Jan", sales: 500 },
  { month: "Feb", sales: 700 },
  { month: "Mar", sales: 800 },
  { month: "Apr", sales: 600 },
  { month: "May", sales: 900 },
];

const memberGrowthData = [
  { month: "Jan", members: 200 },
  { month: "Feb", members: 400 },
  { month: "Mar", members: 600 },
  { month: "Apr", members: 800 },
  { month: "May", members: 1000 },
];

const StatisticsPage = () => {
  return (
    <div className="statistics-page">
      <h1 className="title">📊 Thống kê Doanh thu & Hội viên</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h2>📚 Sách đã bán</h2>
          <p>10,000</p>
        </div>
        <div className="stat-card">
          <h2>💰 Tổng doanh thu</h2>
          <p>$200,000</p>
        </div>
        <div className="stat-card">
          <h2>👥 Hội viên đang hoạt động</h2>
          <p>5,000</p>
        </div>
        <div className="stat-card">
          <h2>🆕 Đăng ký mới</h2>
          <p>1,200</p>
        </div>
      </div>
      
      <div className="charts">
        <div className="chart">
          <h2>📈 Doanh số bán sách hàng tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart">
          <h2>📊 Tăng trưởng hội viên theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={memberGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="members" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
