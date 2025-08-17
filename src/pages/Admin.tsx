import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = searchParams.get('lang') || 'en';

  // Redirect to the proper admin route
  useEffect(() => {
    if (language === 'ta') {
      navigate('/admin/ta', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  }, [language, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Redirecting to Admin Dashboard...
        </p>
      </div>
    </div>
  );
};

export default Admin;
