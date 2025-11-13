import { useState, useEffect } from "react";
import UrlShortenerForm from "../components/UrlShortenerForm";
import SuccessModal from "../components/SuccessModal";

const HomePage = () => {
  const [createdShortCode, setCreatedShortCode] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    document.title = "QuickLink | Create Short Links";
  }, []);


  const handleUrlCreated = (shortCode: string) => {
    setCreatedShortCode(shortCode);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCreatedShortCode(null);
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-12">
            <UrlShortenerForm onUrlCreated={handleUrlCreated} />

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mt-16">
              <div className="glass-card rounded-2xl p-8 text-center hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Create shortened links in milliseconds with our optimized
                  system
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 text-center hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Custom URLs
                </h3>
                <p className="text-gray-600">
                  Create memorable links with your own custom short codes
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 text-center hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Track Analytics
                </h3>
                <p className="text-gray-600">
                  Monitor clicks and performance of all your shortened links
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        shortCode={createdShortCode || ""}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default HomePage;
