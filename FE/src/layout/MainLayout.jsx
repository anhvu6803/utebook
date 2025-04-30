import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Toast from "../components/Toast";
import { ToastProvider, useToast } from "../contexts/ToastContext.jsx";
import "./styles/MainLayout.scss";

const MainLayoutContent = () => {
  const { toast, hideToast } = useToast();

  return (
    <div className="layout">
      <Header className="header"/>
      <main className="content">
        <div className="toast-container">
        {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
        </div>
        <Outlet />
      </main>
      <Footer className="footer"/>
     
    </div>
  );
};

const MainLayout = () => {
  return (
    <ToastProvider>
      <MainLayoutContent />
    </ToastProvider>
  );
};

export default MainLayout;
