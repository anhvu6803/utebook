import React, { createContext, useContext, useState, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const messageShown = useRef(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast, messageShown }}>
      {children}
    </ToastContext.Provider>
  );
}; 