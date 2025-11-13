import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MyLinksPage from "./pages/MyLinksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RedirectPage from "./pages/RedirectPage";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animated-gradient min-h-screen">
      <Navbar />
      {children}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected app routes with navbar */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/my-links"
          element={
            <MainLayout>
              <MyLinksPage />
            </MainLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          }
        />

        {/* Catch-all redirect route - NO navbar */}
        <Route path="*" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
