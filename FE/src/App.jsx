import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider } from './contexts/AuthContext';

import MainLayout from './layout/MainLayout'
import HomeLayout from "./layout/HomeLayout";
import UserLayout from './layout/UserLayout/UserLayout'
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import PackageLayout from "./layout/PackageLayout";
import AuthorSettingLayout from "./layout/AuthorSettingLayout";
import MemberLayout from "./layout/MemberLayout";
import AudioLayout from "./layout/AudioLayout";
import NovelLayout from "./layout/NovelLayout";
import PodcastLayout from "./layout/PodcastLayout";
import CreativeLayout from "./layout/CreativeLayout";
import NewestLayout from "./layout/NewestLayout";
import FreeLayout from "./layout/FreeLayout";

import WelcomPage from './pages/WelcomePage'
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassPage";
import ChangePasswordPage from "./pages/ChangePassPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ManageUserPage from "./pages/Admin/ManageUserPage";
import ManageBookPage from "./pages/Admin/ManageBookPage";
import ManageCategoryPage from "./pages/Admin/ManageCategoryPage";
import ManagePointPage from "./pages/Admin/ManagePointPage";
import ManageMembershipPage from "./pages/Admin/ManageMembershipPage";

import StatisticsPage from "./pages/Admin/StatisticsPage";
import AccountSettingPage from "./pages/AccountSettingPage";
import AccountSettingLayout from "./layout/AccountSettingLayout";
import AccountHistoryTransactionPage from "./pages/AccountHistoryTransactionPage";
import AccountLibraryPage from "./pages/AccountLibraryPage";

import MembershipPlansPage from "./pages/MembershipPlansPage";
import HoaPhuongPage from "./pages/HoaPhuongPage";
import ActivateCodePage from "./pages/ActivateCodePage";
import WhereIsCodePage from "./pages/WhereIsCodePage";
import HomePage from "./pages/HomePage";
import EbookPage from "./pages/EbookPage";
import BookCategoryPage from "./pages/BookCategoryPage";
import AudioBookPage from "./pages/AudioBookPage";
import NovelPage from "./pages/NovelPage";
import PodcastPage from "./pages/PodcastPage";
import CreativeBook from "./pages/CreativeBook";
import DetailBookPage from "./pages/DetailBookPage";
import DetailNovelPage from "./pages/DetailNovelPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import ReaderBookPage from "./pages/ReaderBookPage";
import AuthorSettingPage from "./pages/AuthorSettingPage";
import AuthorProfile from "./pages/AuthorProfilePage";
import ManageNotificationPage from "./pages/Admin/ManageNotification";
import MemberBookPage from "./pages/MemberBookPage";
import NewestBookPage from "./pages/NewestBookPage";
import FreeBookPage from "./pages/FreeBookPage";
import ManagePackage from "./pages/Admin/ManagePackage";
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes with MainLayout */}
          <Route path="/" element={<PublicRoute><MainLayout /></PublicRoute>}>
            <Route index element={<WelcomPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>

          <Route path="payment/success" element={<PaymentResultPage />} />
          <Route path="payment/failed" element={<PaymentResultPage />} />

          {/* Protected routes */}
          <Route path="/utebook" element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}>
            <Route index element={<HomePage />} />
            <Route path="sach-hoi-vien" element={<MemberLayout />} >
              <Route index element={<MemberBookPage />} />
              <Route path=":category" element={<MemberBookPage />} />
              <Route path="view/:idNovel" element={<DetailNovelPage />} />
            </Route>
            <Route path="newest" element={<NewestLayout />} >
              <Route index element={<NewestBookPage />} />
              <Route path=":category" element={<NewestBookPage />} />
              <Route path="view/:idNovel" element={<DetailNovelPage />} />
            </Route>
            <Route path="free" element={<FreeLayout />} >
              <Route index element={<FreeBookPage />} />
              <Route path=":category" element={<FreeBookPage />} />
              <Route path="view/:idNovel" element={<DetailNovelPage />} />
            </Route>
            <Route path="novel" element={<NovelLayout />}>
              <Route index element={<NovelPage />} />
              <Route path=":category" element={<BookCategoryPage pageName={'novel'} />} />
              <Route path="view/:idNovel" element={<DetailNovelPage />} />
            </Route>
            <Route path="account" element={<AccountSettingLayout />}>
              <Route path="profile" element={<AccountSettingPage />} />
              <Route path="bookcase" element={<AccountLibraryPage />} />
              <Route path="transaction-histories" element={<AccountHistoryTransactionPage />} />
            </Route>
            <Route path="author" element={<AuthorSettingLayout />}>
              <Route index element={<AuthorSettingPage />} />
              <Route path="channel" element={<AuthorSettingPage />} />
              <Route path="my-story" element={<AccountLibraryPage />} />
            </Route>
            <Route path="author-profile" element={<AuthorProfile />} />
          </Route>

          <Route path="/utebook-reader/:content" element={<ProtectedRoute><ReaderBookPage /></ProtectedRoute>} />

          <Route path="/utebook/package-plan" element={<ProtectedRoute><PackageLayout /></ProtectedRoute>}>
            <Route index element={<MembershipPlansPage />} />
            <Route path="hoa-phuong" element={<HoaPhuongPage />} />
            <Route path="activate-code" element={<ActivateCodePage />} />
            <Route path="thong-tin/nhan-ma-khuyen-mai" element={<WhereIsCodePage />} />
          </Route>

          <Route element={<UserLayout />}>
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          </Route>

          <Route path="/utebook-admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<ManageUserPage />} />
            <Route path="books" element={<ManageBookPage />} />
            <Route path="categories" element={<ManageCategoryPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="point" element={<ManagePointPage />} />
            <Route path="membership" element={<ManageMembershipPage />} />
            <Route path="notifications" element={<ManageNotificationPage/>} />
            <Route path="service-packages" element={<ManagePackage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router >
  );
}

export default App;