import LandingContainer from '@components/Landing/containers/LandingContainer';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

export const ROOT_ROUTES = {
  LANDING: '/',
};

const RootNavigation = () => {
  return (
    <Routes>
      <Route path={ROOT_ROUTES.LANDING} element={<LandingContainer />} />
    </Routes>
  );
};

export default RootNavigation;
