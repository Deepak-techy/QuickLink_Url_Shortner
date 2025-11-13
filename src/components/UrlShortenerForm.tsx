import { useState } from "react";
import { createShortUrl } from "../services/urlService";

interface UrlShortenerFormProps {
  onUrlCreated: (shortCode: string) => void;
}

const UrlShortenerForm = ({ onUrlCreated }: UrlShortenerFormProps) => {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [expiryDays, setExpiryDays] = useState("");
  const [useExpiry, setUseExpiry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    let formattedUrl = url.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    if (useCustom && !customCode.trim()) {
      setError("Please enter a custom code or disable custom URL");
      return;
    }

    setIsLoading(true);

    try {
      const { shortCode } = await createShortUrl(
        formattedUrl,
        useCustom ? customCode.trim() : undefined,
        usePassword ? password : undefined,
        useExpiry ? parseInt(expiryDays) : undefined
      );
      onUrlCreated(shortCode);
      setUrl("");
      setCustomCode("");
      setPassword("");
      setExpiryDays("");
      setShowAdvanced(false);
    } catch (err: any) {
      setError(err.message || "Failed to shorten URL. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl shadow-2xl p-8 w-full max-w-3xl glow">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 float-animation">✨</div>
        <h1 className="text-5xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          QuickLink
        </h1>
        <p className="text-gray-600 text-lg">
          Transform long URLs into short, powerful links
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🌐 Enter Your Long URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url..."
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-gray-800 text-lg"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useCustom"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <label
            htmlFor="useCustom"
            className="text-gray-700 font-medium cursor-pointer"
          >
            🎯 Use Custom Short Code
          </label>
        </div>

        {useCustom && (
          <div className="pl-7">
            <input
              type="text"
              value={customCode}
              onChange={(e) =>
                setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))
              }
              placeholder="my-custom-link"
              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-gray-800"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your link will be: {window.location.origin}/
              {customCode || "your-code"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors flex items-center gap-2"
        >
          {showAdvanced ? "▼" : "▶"} Advanced Options
        </button>

        {showAdvanced && (
          <div className="space-y-4 pl-4 border-l-4 border-indigo-200">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="usePassword"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <label
                htmlFor="usePassword"
                className="text-gray-700 font-medium cursor-pointer"
              >
                🔒 Password Protection
              </label>
            </div>

            {usePassword && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                disabled={isLoading}
              />
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useExpiry"
                checked={useExpiry}
                onChange={(e) => setUseExpiry(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <label
                htmlFor="useExpiry"
                className="text-gray-700 font-medium cursor-pointer"
              >
                ⏰ Link Expiration
              </label>
            </div>

            {useExpiry && (
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                disabled={isLoading}
              >
                <option value="">Select expiration</option>
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl glow-hover transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Shortening...
            </span>
          ) : (
            "✨ Shorten URL"
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlShortenerForm;
