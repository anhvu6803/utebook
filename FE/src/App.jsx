
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './layout/MainLayout/MainLayout'
import WelcomPage from './pages/WelcomePage'
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WelcomPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </Router>
   
  )
}

export default App
