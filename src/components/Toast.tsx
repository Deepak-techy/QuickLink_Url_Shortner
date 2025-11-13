import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: "from-green-500 to-emerald-500",
    error: "from-red-500 to-pink-500",
    info: "from-blue-500 to-cyan-500",
  };

  const icons = {
    success: "✓",
    error: "✗",
    info: "ℹ",
  };

  return (
    <div className="fixed bottom-6 right-6 z-10000 animate-slide-in-right">
      <div
        className={`bg-linear-to-r ${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] glow`}
      >
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
          {icons[type]}
        </div>
        <p className="font-semibold text-lg flex-1">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 w-6 h-6 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
