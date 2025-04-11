import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './layout/MainLayout'
import HomeLayout from "./layout/HomeLayout";
import UserLayout from './layout/UserLayout/UserLayout'
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import PackageLayout from "./layout/PackageLayout";
import AuthorSettingLayout from "./layout/AuthorSettingLayout";
import EbookLayout from "./layout/EbookLayout";
import AudioLayout from "./layout/AudioLayout";
import NovelLayout from "./layout/NovelLayout";
import PodcastLayout from "./layout/PodcastLayout";
import CreativeLayout from "./layout/CreativeLayout";

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
import ManagePointPage from "./pages/Admin/ManagePointPage";
import ManageMembershipPage from "./pages/Admin/ManageMembershipPage";
import ManageEventPage from "./pages/Admin/ManageEventPage";
import ManageWritingPage from "./pages/Admin/ManageWritingPage";
import StatisticsPage from "./pages/Admin/StatisticsPage";
import AccountSettingPage from "./pages/AccountSettingPage";
import AccountSettingLayout from "./layout/AccountSettingLayout";
import AccountHistoryTransactionPage from "./pages/AccountHistoryTransactionPage";
import AccountLibraryPage from "./pages/AccountLibraryPage";
// import AccountOderPage from "./pages/AccountOderPage";
// import AccountDetailOrderPage from "./pages/AccountDetailOrderPage";
import AccountAchievement from "./pages/AccountAchievement";
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
import PaymentResultPage from "./pages/PaymentResultPage";

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
          <Route path="/payment/success" element={<PaymentResultPage />} />
          <Route path="/payment/failed" element={<PaymentResultPage />} />
        </Route>
        <Route path="/utebook" element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="ebook" element={<EbookLayout />}>
            <Route index element={<EbookPage />} />
            <Route path=":category" element={<BookCategoryPage pageName={'ebook'} />} />
            <Route path="detailBook" element={<DetailBookPage />} />
          </Route>
          <Route path="audio" element={<AudioLayout />}>
            <Route index element={<AudioBookPage />} />
            <Route path=":category" element={<BookCategoryPage pageName={'audio'} />} />
          </Route>
          <Route path="novel" element={<NovelLayout />}>
            <Route index element={<NovelPage />} />
            <Route path=":category" element={<BookCategoryPage pageName={'novel'} />} />
          </Route>
          <Route path="podcast" element={<PodcastLayout />}>
            <Route index element={<PodcastPage />} />
            <Route path=":category" element={<BookCategoryPage pageName={'podcast'} />} />
          </Route>
          <Route path="creative" element={<CreativeLayout pageName={'creative'} />}>
            <Route index element={<CreativeBook />} />
            <Route path=":category" element={<BookCategoryPage />} />
          </Route>
          <Route path="account" element={<AccountSettingLayout />}>
            <Route path="profile" element={<AccountSettingPage />} />
            <Route path="bookcase" element={<AccountLibraryPage />} />
            <Route path="achievements" element={<AccountAchievement />} />
            <Route path="transaction-histories" element={<AccountHistoryTransactionPage />} />
          </Route>

          <Route path="/utebook/author" element={<AuthorSettingLayout />}>
          </Route>
        </Route>

        <Route path="/utebook/package-plan" element={
          <ProtectedRoute>
            <PackageLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MembershipPlansPage />} />
          <Route path="hoa-phuong" element={<HoaPhuongPage />} />
          <Route path="activate-code" element={<ActivateCodePage />} />
          <Route path="thong-tin/nhan-ma-khuyen-mai" element={<WhereIsCodePage />} />
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="/utebook-admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ManageUserPage />} />
          <Route path="books" element={<ManageBookPage />} />
          <Route path="audio-books" element={<ManageAudioBookPage />} />
          <Route path="categories" element={<ManageCategoryPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="point" element={<ManagePointPage />} />
          <Route path="membership" element={<ManageMembershipPage />} />
          <Route path="events" element={<ManageEventPage />} />
          <Route path="writing" element={<ManageWritingPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;