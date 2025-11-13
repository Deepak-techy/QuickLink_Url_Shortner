import { useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shortCode: string;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  shortCode,
}: DeleteConfirmModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      {/* Backdrop - Fixed to cover entire viewport */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        style={{ backdropFilter: "blur(8px)" }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="glass-card rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 glow animate-scale-in my-auto">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center mb-6 animate-bounce-slow shadow-lg">
            <span className="text-4xl">🗑️</span>
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            Delete Link?
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this link?
          </p>

          {/* Short code display */}
          <div className="bg-linear-to-r from-red-50 to-pink-50 rounded-xl p-4 mb-6 border border-red-100">
            <p className="text-sm text-gray-600 mb-1">Short code:</p>
            <p className="text-lg font-bold text-red-600">{shortCode}</p>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all transform hover:scale-105 shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
