import { useState } from "react";

export interface AlertState {
  show: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    severity: "success",
  });

  const showAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
    autoHide: boolean = true,
    duration: number = 3000
  ) => {
    setAlert({ show: true, message, severity });

    if (autoHide) {
      setTimeout(() => {
        hideAlert();
      }, duration);
    }
  };

  const showSuccess = (message: string, autoHide = true) => {
    showAlert(message, "success", autoHide, 3000);
  };

  const showError = (message: string, autoHide = true) => {
    showAlert(message, "error", autoHide, 5000);
  };

  const showWarning = (message: string, autoHide = true) => {
    showAlert(message, "warning", autoHide, 4000);
  };

  const showInfo = (message: string, autoHide = true) => {
    showAlert(message, "info", autoHide, 3000);
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert,
  };
};
