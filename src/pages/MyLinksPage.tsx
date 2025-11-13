import { useState, useEffect, useCallback, useRef } from "react";
import { getAllUrls, deleteUrl, toggleUrlStatus } from "../services/urlService";
import UrlCard from "../components/UrlCard";
import Toast from "../components/Toast";
import type { UrlData } from "../types";

const MyLinksPage = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "custom"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  useEffect(() => {
    document.title = "My Links | QuickLink";
  }, []);

  // const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);


  const fetchUrls = useCallback(async () => {
    try {
      const data = await getAllUrls();
      setUrls(data);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();

    // Start polling every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchUrls();
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchUrls]);

  const showToastMessage = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUrl(id);
      setUrls(urls.filter((url) => url.id !== id));
      showToastMessage("Link deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting URL:", error);
      showToastMessage("Failed to delete link", "error");
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await toggleUrlStatus(id, isActive);
      setUrls(
        urls.map((url) =>
          url.id === id ? { ...url, is_active: isActive } : url
        )
      );
      showToastMessage(
        isActive ? "Link activated successfully!" : "Link paused successfully!",
        "info"
      );
    } catch (error) {
      console.error("Error toggling URL status:", error);
      showToastMessage("Failed to update link status", "error");
    }
  };

  const handleVisit = (shortCode: string) => {
    window.open(`${window.location.origin}/${shortCode}`, "_blank");

    // Force refresh after 2 seconds
    setTimeout(() => {
      fetchUrls();
    }, 2000);
  };

  const filteredUrls = urls.filter((url) => {
    const matchesSearch =
      url.original_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.short_code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "active") return url.is_active === true;
    if (filter === "inactive") return url.is_active === false;
    if (filter === "custom") return url.is_custom === true;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">
            Loading your links...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              My Shortened Links
            </h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search links..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
              />

              <div className="flex gap-2 flex-wrap">
                {(["all", "active", "inactive", "custom"] as const).map(
                  (filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all capitalize ${
                        filter === filterType
                          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {filterType}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredUrls.length} of {urls.length} links •
              Auto-refreshing every 3s
            </div>
          </div>

          {filteredUrls.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-xl">
                {searchQuery || filter !== "all"
                  ? "No links match your filters"
                  : "No links yet. Create your first one!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUrls.map((url) => (
                <UrlCard
                  key={url.id}
                  url={url}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onVisit={handleVisit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default MyLinksPage;
