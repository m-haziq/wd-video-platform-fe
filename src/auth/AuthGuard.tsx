import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();

  const authenticated: boolean = isAuthenticated;
  return (
    <>
      {authenticated ? (
        children
      ) : (
        <Navigate
          replace
          to="/signin"
          state={{ from: pathname }}
        />
      )}
    </>
  );
};

export default AuthGuard;
