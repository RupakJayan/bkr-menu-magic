import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";

const HOME_SECTIONS = ["instagram", "our-approach", "experience", "how-it-works", "contact"];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const clean = location.pathname.replace(/^\//, "").split("/")[0].toLowerCase();
    if (HOME_SECTIONS.includes(clean)) {
      navigate(`/${clean}`, { replace: true });
      return;
    }

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname, navigate]);

  return (
    <div className="not-found-page min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Link to="/" className="not-found-brand" aria-label="BKR Catering home">
          <BrandLogo />
        </Link>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-mute mb-4">Oops! Page not found</p>
        <Link to="/" className="text-acc hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
