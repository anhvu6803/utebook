
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './layout/MainLayout'
import WelcomPage from './pages/WelcomePage'
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassPage";
import HomeLayout from "./layout/HomeLayout";
import AccountSettingPage from "./pages/AccountSettingPage";
import AccountSettingLayout from "./layout/AccountSettingLayout";
import AccountHistoryTransactionPage from "./pages/AccountHistoryTransactionPage";
import AccountLibraryPage from "./pages/AccountLibraryPage";
import AccountOderPage from "./pages/AccountOderPage";
import AccountSupportPage from "./pages/AccountSupportPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WelcomPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/utebook" element={<HomeLayout />}>
          <Route path="account" element={<AccountSettingLayout />}>
            <Route path="profile" element={<AccountSettingPage />} />
            <Route path="bookcase" element={<AccountLibraryPage />} />
            <Route path="orders" element={<AccountOderPage />} />
            <Route path="transaction-histories" element={<AccountHistoryTransactionPage />} />
            <Route path="support" element={<AccountSupportPage />} />
          </Route>
        </Route>

      </Routes>
    </Router>

  )
}

export default App
