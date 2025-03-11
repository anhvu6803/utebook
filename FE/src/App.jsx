
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './layout/MainLayout'
import WelcomPage from './pages/WelcomePage'
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassPage";
import HomeLayout from "./layout/HomeLayout";
import AccountSettingPage from "./pages/AccountSettingPage";
import AccountSettingLayout from "./layout/AccountSettingLayout";

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
          </Route>
        </Route>

      </Routes>
    </Router>

  )
}

export default App
