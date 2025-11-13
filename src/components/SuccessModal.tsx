import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  shortCode: string;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, shortCode, onClose }: SuccessModalProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shortUrl = `${window.location.origin}/${shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleViewLinks = () => {
    onClose();
    navigate("/my-links");
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        style={{ backdropFilter: "blur(8px)" }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="glass-card rounded-3xl shadow-2xl p-8 max-w-lg w-full relative z-10 glow animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-all flex items-center justify-center font-bold text-gray-600 hover:scale-110 transform"
        >
          ✕
        </button>

        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 animate-bounce-slow shadow-lg">
            <span className="text-5xl">🎉</span>
          </div>

          {/* Title */}
          <h3 className="text-4xl font-bold text-gray-800 mb-3">
            Link Created Successfully!
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Your shortened link is ready to share
          </p>

          {/* Link Display */}
          <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Your shortened link:
            </p>
            <p className="text-lg font-bold text-indigo-600 break-all mb-4">
              {shortUrl}
            </p>

            <button
              onClick={handleCopy}
              className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 ${
                copied
                  ? "bg-linear-to-r from-green-500 to-emerald-500 text-white"
                  : "bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              }`}
            >
              {copied ? (
                <>
                  <span className="text-xl">✓</span> Copied to Clipboard!
                </>
              ) : (
                <>
                  <span className="text-xl">📋</span> Copy Link
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all transform hover:scale-105 shadow-md"
            >
              Create Another
            </button>
            <button
              onClick={handleViewLinks}
              className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
            >
              View My Links →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
