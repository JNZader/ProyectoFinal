import { useEffect,useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '@/supabase/config';

const ProtectedRoute = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn && user?.id) {
        try {
          // Get Supabase JWT token from Clerk
          const token = await getToken({ template: 'supabase' });
          if (token) {
            const { data, error } = await supabase
              .from('usuarios')
              .select('rol')
              .eq('clerk_user_id', user.id)
              .single();
            if (error) {
              console.error('Error fetching user role:', error);
              setUserRole(null);
            } else {
              setUserRole(data?.rol || null);
            }
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          setUserRole(null);
        }
      }
      setIsLoading(false);
    };
    checkUserRole();
  }, [isSignedIn, user, getToken]);

  if (!isSignedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  // Check if user has ADMIN role for admin routes
  if (location.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    // Redirect to home if not authorized
    return <Navigate to="/" replace />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;