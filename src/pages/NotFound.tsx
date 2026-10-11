import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="not-found-page min-h-screen flex items-center justify-center">
      <div className="text-center">
        <a href="/" className="not-found-brand" aria-label="BKR Catering home">
          <BrandLogo />
        </a>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-mute mb-4">Oops! Page not found</p>
        <a href="/" className="text-acc hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
