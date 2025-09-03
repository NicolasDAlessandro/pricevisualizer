import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200",
    error: "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200",
    info: "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200",
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 animate-fade-in"
      role="alert"
    >
      <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800">
        <div
          className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${typeStyles[type]}`}
        >
          {type === "success" && (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          )}
          {type === "error" && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {type === "info" && (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9h2V7H9v2zm0 4h2v-4H9v4z" />
            </svg>
          )}
        </div>
        <div className="ms-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <span className="sr-only">Cerrar</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 14 14"
          >
            <path d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
