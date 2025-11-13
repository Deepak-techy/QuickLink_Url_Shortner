import { useState, useEffect } from "react";
import { getAllUrls } from "../services/urlService";
import StatsCard from "../components/StatsCard";
import type { UrlData } from "../types";

const AnalyticsPage = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getAllUrls();
        setUrls(data);
      } catch (error) {
        console.error("Error fetching URLs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const totalClicks = urls.reduce((sum, url) => {
    const clicks = parseInt(String(url.clicks || 0), 10);
    return sum + clicks;
  }, 0);

  const activeLinks = urls.filter((url) => url.is_active).length;
  const customLinks = urls.filter((url) => url.is_custom).length;
  const protectedLinks = urls.filter((url) => url.password).length;
  const averageClicks =
    urls.length > 0 ? Math.round(totalClicks / urls.length) : 0;

  const topLinks = [...urls]
    .sort((a, b) => {
      const clicksA = parseInt(String(a.clicks || 0), 10);
      const clicksB = parseInt(String(b.clicks || 0), 10);
      return clicksB - clicksA;
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your link performance and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Total Links"
            value={urls.length}
            icon="🔗"
            subtitle="All time"
          />
          <StatsCard
            label="Total Clicks"
            value={totalClicks}
            icon="👆"
            subtitle="Across all links"
          />
          <StatsCard
            label="Active Links"
            value={activeLinks}
            icon="✨"
            subtitle={`${urls.length - activeLinks} inactive`}
          />
          <StatsCard
            label="Avg Clicks"
            value={averageClicks}
            icon="📊"
            subtitle="Per link"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📈 Link Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl">
                <span className="font-semibold text-gray-700">
                  Custom Links
                </span>
                <span className="text-2xl font-bold text-indigo-600">
                  {customLinks}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
                <span className="font-semibold text-gray-700">
                  Protected Links
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  {protectedLinks}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="font-semibold text-gray-700">
                  Auto-generated
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {urls.length - customLinks}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🏆 Top Performing Links
            </h2>
            {topLinks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No links created yet
              </p>
            ) : (
              <div className="space-y-3">
                {topLinks.map((url, index) => {
                  const clicks = parseInt(String(url.clicks || 0), 10);
                  return (
                    <div
                      key={url.id}
                      className="flex items-center gap-3 p-3 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl"
                    >
                      <div className="shrink-0 w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {url.short_code}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {url.original_url}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-lg font-bold text-indigo-600">
                          {clicks}
                        </p>
                        <p className="text-xs text-gray-500">clicks</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💡 Quick Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">
                {urls.length > 0
                  ? Math.round((customLinks / urls.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-gray-600 font-medium">Custom Links</p>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl mb-3">📈</div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {topLinks.length > 0
                  ? parseInt(String(topLinks[0].clicks || 0), 10)
                  : 0}
              </p>
              <p className="text-gray-600 font-medium">Most Clicks</p>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-3">⚡</div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {urls.length > 0
                  ? Math.round((activeLinks / urls.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-gray-600 font-medium">Active Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
