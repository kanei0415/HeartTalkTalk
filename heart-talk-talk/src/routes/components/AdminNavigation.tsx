import AdminLoginContainer from '@components/AdminLogin/containers/AdminLoginContainer';
import AdminMainContainer from '@components/AdminMain/containers/AdminMainContainer';
import NotFoundContainer from '@components/NotFound/containers/NotFoundContainer';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

export const ADMIN_ROUTE = {
  LOGIN: '/login',
  MAIN: '/main',
  NOT_FOUND: '*',
} as const;

const AdminNavigation = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/admin/login' replace />} />
      <Route path={ADMIN_ROUTE.LOGIN} element={<AdminLoginContainer />} />
      <Route path={ADMIN_ROUTE.MAIN} element={<AdminMainContainer />} />
      <Route
        path={ADMIN_ROUTE.NOT_FOUND}
        element={<NotFoundContainer backBtnDest={ADMIN_ROUTE.LOGIN} />}
      />
    </Routes>
  );
};

export default AdminNavigation;
