import React, { createContext, useContext } from "react";
import { notification } from "antd";

// 1. Context để quản lý notification
const NotificationContext = createContext<{
  showNotification: (config: NotificationConfig) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
}>({
  showNotification: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

// 2. Định nghĩa types cho notification
type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationConfig {
  type?: NotificationType;
  message: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

// 3. Provider component
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (config: NotificationConfig) => {
    const {
      type = "info",
      message,
      description,
      duration = 4.5,
      placement = "topRight",
    } = config;

    api[type]({
      message,
      description,
      duration,
      placement,
    });
  };

  // Các helper methods cho từng loại notification
  const success = (message: string, description?: string) => {
    showNotification({ type: "success", message, description });
  };

  const error = (message: string, description?: string) => {
    showNotification({ type: "error", message, description });
  };

  const info = (message: string, description?: string) => {
    showNotification({ type: "info", message, description });
  };

  const warning = (message: string, description?: string) => {
    showNotification({ type: "warning", message, description });
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, success, error, info, warning }}
    >
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// 4. Custom hook để sử dụng notification
export const useNotification = () => {
  return useContext(NotificationContext);
};
