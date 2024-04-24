// ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user?.islogin && !isLoading) {
      router.push('/user');
    }
  }, [user, router, isLoading]);

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
