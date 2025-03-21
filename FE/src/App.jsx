
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './layout/MainLayout'
import UserLayout from './layout/UserLayout/UserLayout'
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import WelcomPage from './pages/WelcomePage'
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassPage";
import ChangePasswordPage from "./pages/ChangePassPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ManageUserPage from "./pages/Admin/ManageUserPage";
import ManageBookPage from "./pages/Admin/ManageBookPage";
import ManageAudioBookPage from "./pages/Admin/ManageAudioBookPage";
import ManageCategoryPage from "./pages/Admin/ManageCategoryPage";
import ManageOrderPage from "./pages/Admin/ManageOrderPage";
import StatisticsPage from "./pages/Admin/StatisticsPage";
import HomeLayout from "./layout/HomeLayout";
import AccountSettingPage from "./pages/AccountSettingPage";
import AccountSettingLayout from "./layout/AccountSettingLayout";
import AccountHistoryTransactionPage from "./pages/AccountHistoryTransactionPage";
import AccountLibraryPage from "./pages/AccountLibraryPage";
import AccountOderPage from "./pages/AccountOderPage";
import AccountSupportPage from "./pages/AccountSupportPage";
import AccountDetailOrderPage from "./pages/AccountDetailOrderPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WelcomPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/utebook" element={<HomeLayout />}>
          <Route path="account" element={<AccountSettingLayout />}>
            <Route path="profile" element={<AccountSettingPage />} />
            <Route path="bookcase" element={<AccountLibraryPage />} />
            <Route path="orders" element={<AccountOderPage />} >
              <Route path=":orderId" element={<AccountDetailOrderPage />} />
            </Route>
            <Route path="transaction-histories" element={<AccountHistoryTransactionPage />} />
            <Route path="support" element={<AccountSupportPage />} />
          </Route>
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="/utebook-admin" element={<AdminLayout />}>
          <Route index element={<ManageUserPage />} />
          <Route path="books" element={<ManageBookPage />} />
          <Route path="audio-books" element={<ManageAudioBookPage />} />
          <Route path="categories" element={<ManageCategoryPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="order" element={<ManageOrderPage />} />

        </Route>
      </Routes>
    </Router>

  )
}
export default App
