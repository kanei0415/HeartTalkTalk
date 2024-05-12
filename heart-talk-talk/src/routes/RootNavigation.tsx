import LandingContainer from '@components/Landing/containers/LandingContainer';
import React from 'react';
import { Routes, Route, To } from 'react-router-dom';
import AdminNavigaionContainer from './containers/AdminNavigationContainer';
import NotFoundContainer from '@components/NotFound/containers/NotFoundContainer';
import MainContainer from '@components/Main/containers/MainContainer';
import SignupContainer from '@components/Signup/containers/SignupContainer';
import ServeyContainer from '@components/Servey/containers/ServeyContainer';
import ServeyChattingContainer from '@components/ServeyChatting/containers/ServeyChattingContainer';

export const ROOT_ROUTES = {
  LANDING: '/',
  MAIN: '/main',
  SIGNUP: '/signup',
  SERVEY: '/servey',
  SERVEY_CHATTING: '/servey-chatting',
  ADMIN: '/admin/*',
  NOT_FOUND: '*',
} as const;

const RootNavigation = () => {
  return (
    <Routes>
      <Route path={ROOT_ROUTES.LANDING} element={<LandingContainer />} />
      <Route path={ROOT_ROUTES.MAIN} element={<MainContainer />} />
      <Route path={ROOT_ROUTES.SIGNUP} element={<SignupContainer />} />
      <Route path={ROOT_ROUTES.SERVEY} element={<ServeyContainer />} />
      <Route
        path={ROOT_ROUTES.SERVEY_CHATTING}
        element={<ServeyChattingContainer />}
      />
      <Route path={ROOT_ROUTES.ADMIN} element={<AdminNavigaionContainer />} />
      <Route
        path={ROOT_ROUTES.NOT_FOUND}
        element={<NotFoundContainer backBtnDest={-1 as To} />}
      />
    </Routes>
  );
};

export default RootNavigation;
