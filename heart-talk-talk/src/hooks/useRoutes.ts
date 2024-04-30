import { ROOT_ROUTES } from '@routes/RootNavigation';
import { ADMIN_ROUTE } from '@routes/components/AdminNavigation';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useRoute() {
  const navigate = useNavigate();

  const __routeWithRootNavigation = useCallback(
    (path: (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES]) => {
      navigate(path);
    },
    [navigate],
  );

  const __routeWithAdminNavigation = useCallback(
    (path: (typeof ADMIN_ROUTE)[keyof typeof ADMIN_ROUTE]) => {
      navigate('/admin' + path);
    },
    [navigate],
  );

  const __routeWithReset = useCallback(() => {
    navigate('/admin' + ADMIN_ROUTE.LOGIN, {
      replace: true,
    });
  }, [navigate]);

  const __back = useCallback(() => navigate(-1), [navigate]);

  return {
    __routeWithAdminNavigation,
    __routeWithRootNavigation,
    __routeWithReset,
    __back,
  };
}
