import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getUrlByShortCode, incrementClicks } from "../services/urlService";

const RedirectPage = () => {
  const { "*": shortCode } = useParams<{ "*": string }>();
  const location = useLocation();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [urlData, setUrlData] = useState<any>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      // Get the short code from the path
      const pathCode = location.pathname.slice(1); // Remove leading "/"

      if (!pathCode || pathCode === "") {
        window.location.href = "/";
        return;
      }

      try {
        const data = await getUrlByShortCode(pathCode);

        if (data && data.original_url) {
          // Check if link is active
          if (data.is_active === false) {
            setNotFound(true);
            setLoading(false);
            return;
          }

          // Check if expired
          if (data.expires_at && new Date(data.expires_at) < new Date()) {
            setNotFound(true);
            setLoading(false);
            return;
          }

          // Check if password protected
          if (data.password) {
            setUrlData(data);
            setNeedsPassword(true);
            setLoading(false);
            return;
          }

          // Redirect directly if no password
          await incrementClicks(data.id!);
          setRedirectUrl(data.original_url);
          window.location.replace(data.original_url);
        } else {
          setNotFound(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Redirect error:", error);
        setNotFound(true);
        setLoading(false);
      }
    };

    handleRedirect();
  }, [location.pathname]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (password === urlData.password) {
      await incrementClicks(urlData.id!);
      setRedirectUrl(urlData.original_url);
      window.location.replace(urlData.original_url);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <div className="glass-card rounded-3xl shadow-2xl p-12 text-center max-w-md glow">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-gray-800">Redirecting...</p>
          <p className="text-gray-600 mt-2">
            Code: {location.pathname.slice(1)}
          </p>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient px-4">
        <div className="glass-card rounded-3xl shadow-2xl p-12 text-center max-w-md w-full glow">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Password Protected
          </h2>
          <p className="text-gray-600 mb-6">
            This link requires a password to access
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-center text-lg"
              autoFocus
            />

            {passwordError && (
              <p className="text-red-600 font-medium">{passwordError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              🔓 Unlock & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient px-4">
        <div className="glass-card rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Link Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This link doesn't exist, has been deleted, expired, or is currently
            inactive.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Short code: {location.pathname.slice(1)}
          </p>
          <a
            href="/"
            className="inline-block bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg"
          >
            🏠 Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient px-4">
      <div className="glass-card rounded-3xl shadow-2xl p-12 text-center max-w-md w-full glow">
        <div className="text-6xl mb-6 float-animation">🚀</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Redirecting...
        </h2>
        <p className="text-gray-600 mb-4">Taking you to:</p>
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
          <p className="text-sm text-indigo-600 break-all font-mono">
            {redirectUrl}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;
