// import { useState } from "react";
// import type { UrlData } from "../types";

// interface UrlCardProps {
//   url: UrlData;
//   onDelete: (id: number) => void;
//   onToggleStatus: (id: number, isActive: boolean) => void;
// }

// const UrlCard = ({ url, onDelete, onToggleStatus }: UrlCardProps) => {
//   const [copiedId, setCopiedId] = useState<number | null>(null);
//   const [showQR, setShowQR] = useState(false);

//   const getShortUrl = (shortCode: string): string => {
//     return `${window.location.origin}/${shortCode}`;
//   };

//   const copyToClipboard = async (shortCode: string, id: number) => {
//     try {
//       await navigator.clipboard.writeText(getShortUrl(shortCode));
//       setCopiedId(id);
//       setTimeout(() => setCopiedId(null), 2000);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const formatDate = (dateString: string | undefined): string => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const isExpired = (): boolean => {
//     if (!url.expires_at) return false;
//     return new Date(url.expires_at) < new Date();
//   };

//   const clickCount = parseInt(String(url.clicks || 0), 10);
//   const expired = isExpired();

//   return (
//     <div
//       className={`glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
//         !url.is_active || expired ? "opacity-60" : ""
//       }`}
//     >
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-3 mb-3 flex-wrap">
//             <span
//               className={`text-sm font-bold px-4 py-2 rounded-full ${
//                 url.is_custom
//                   ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
//                   : "bg-linear-to-r from-blue-500 to-cyan-500 text-white"
//               }`}
//             >
//               {url.short_code}
//             </span>

//             <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
//               👆 {clickCount} {clickCount === 1 ? "click" : "clicks"}
//             </span>

//             {url.is_custom && (
//               <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
//                 ✨ Custom
//               </span>
//             )}

//             {url.password && (
//               <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
//                 🔒 Protected
//               </span>
//             )}

//             {url.expires_at && (
//               <span
//                 className={`text-xs px-3 py-1 rounded-full font-semibold ${
//                   expired
//                     ? "bg-red-100 text-red-700"
//                     : "bg-green-100 text-green-700"
//                 }`}
//               >
//                 {expired ? "❌ Expired" : "⏰ Expires"}
//               </span>
//             )}

//             {!url.is_active && (
//               <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
//                 ⏸️ Inactive
//               </span>
//             )}
//           </div>

//           <p className="text-gray-700 truncate text-sm mb-2 font-medium">
//             🔗 {url.original_url}
//           </p>

//           <div className="flex items-center gap-4 text-xs text-gray-500">
//             <span>📅 Created: {formatDate(url.created_at)}</span>
//             {url.expires_at && !expired && (
//               <span>⏰ Expires: {formatDate(url.expires_at)}</span>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-2 flex-wrap lg:flex-nowrap">
//           <button
//             onClick={() => copyToClipboard(url.short_code, url.id!)}
//             className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2"
//           >
//             {copiedId === url.id ? (
//               <>
//                 <span>✓</span> Copied!
//               </>
//             ) : (
//               <>
//                 <span>📋</span> Copy
//               </>
//             )}
//           </button>

//           <button
//             onClick={() => window.open(getShortUrl(url.short_code), "_blank")}
//             className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2"
//           >
//             <span>🚀</span> Visit
//           </button>

//           <button
//             onClick={() => onToggleStatus(url.id!, !url.is_active)}
//             className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2 ${
//               url.is_active
//                 ? "bg-linear-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
//                 : "bg-linear-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
//             }`}
//           >
//             <span>{url.is_active ? "⏸️" : "▶️"}</span>
//             {url.is_active ? "Pause" : "Resume"}
//           </button>

//           <button
//             onClick={() => {
//               if (confirm("Are you sure you want to delete this link?")) {
//                 onDelete(url.id!);
//               }
//             }}
//             className="px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2"
//           >
//             <span>🗑️</span> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UrlCard;











import { useState } from "react";
import type { UrlData } from "../types";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface UrlCardProps {
  url: UrlData;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
}

const UrlCard = ({ url, onDelete, onToggleStatus }: UrlCardProps) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getShortUrl = (shortCode: string): string => {
    return `${window.location.origin}/${shortCode}`;
  };

  const copyToClipboard = async (shortCode: string, id: number) => {
    try {
      await navigator.clipboard.writeText(getShortUrl(shortCode));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (): boolean => {
    if (!url.expires_at) return false;
    return new Date(url.expires_at) < new Date();
  };

  const expired = isExpired();

  return (
    <>
      <div
        className={`glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
          url.is_active === false || expired ? "opacity-60" : ""
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`text-sm font-bold px-4 py-2 rounded-full ${
                  url.is_custom === true
                    ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-linear-to-r from-blue-500 to-cyan-500 text-white"
                }`}
              >
                {url.short_code}
              </span>

              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                👆 {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
              </span>

              {url.is_custom === true && (
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  ✨ Custom
                </span>
              )}

              {url.password && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                  🔒 Protected
                </span>
              )}

              {url.expires_at && (
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    expired
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {expired ? "❌ Expired" : "⏰ Expires"}
                </span>
              )}

              {url.is_active === false && (
                <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
                  ⏸️ Inactive
                </span>
              )}
            </div>

            <p className="text-gray-700 truncate text-sm mb-2 font-medium">
              🔗 {url.original_url}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>📅 Created: {formatDate(url.created_at)}</span>
              {url.expires_at && !expired && (
                <span>⏰ Expires: {formatDate(url.expires_at)}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap lg:flex-nowrap">
            <button
              onClick={() => copyToClipboard(url.short_code, url.id!)}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              {copiedId === url.id ? (
                <>
                  <span>✓</span> Copied!
                </>
              ) : (
                <>
                  <span>📋</span> Copy
                </>
              )}
            </button>

            <button
              onClick={() => window.open(getShortUrl(url.short_code), "_blank")}
              className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <span>🚀</span> Visit
            </button>

            <button
              onClick={() => onToggleStatus(url.id!, url.is_active === false)}
              className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2 ${
                url.is_active === true
                  ? "bg-linear-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                  : "bg-linear-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
              }`}
            >
              <span>{url.is_active === true ? "⏸️" : "▶️"}</span>
              {url.is_active === true ? "Pause" : "Resume"}
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all text-sm font-semibold shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <span>🗑️</span> Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(url.id!)}
        shortCode={url.short_code}
      />
    </>
  );
};

export default UrlCard;
