import { useState } from "react";
import type { UrlData } from "../types";

interface UrlListProps {
  urls: UrlData[];
  onDelete: (id: number) => void;
  onRedirect: (shortCode: string) => void;
}

const UrlList = ({ urls, onDelete, onRedirect }: UrlListProps) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    });
  };

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">
          No URLs shortened yet. Create your first one above! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Your Shortened URLs
      </h2>

      <div className="space-y-4">
        {urls.map((url) => {
          // Parse clicks as number for display
          const clickCount = parseInt(String(url.clicks || 0), 10);

          return (
            <div
              key={url.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {url.short_code}
                    </span>
                    <span className="text-xs text-gray-500">
                      {clickCount} {clickCount === 1 ? "click" : "clicks"}
                    </span>
                  </div>
                  <p className="text-gray-700 truncate text-sm mb-1">
                    {url.original_url}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(url.created_at)}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(url.short_code, url.id!)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    {copiedId === url.id ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button
                    onClick={() => onRedirect(url.short_code)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    🔗 Visit
                  </button>
                  <button
                    onClick={() => onDelete(url.id!)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default UrlList;
