import React, { useCallback } from 'react';
import NotFound from '../NotFound';
import { useNavigate, To } from 'react-router-dom';

type Props = {
  backBtnDest: To;
};

const NotFoundContainer = ({ backBtnDest }: Props) => {
  const navigate = useNavigate();

  const onBackBtnClicked = useCallback(
    () => navigate(backBtnDest),
    [navigate, backBtnDest],
  );

  return <NotFound onBackBtnClicked={onBackBtnClicked} />;
};

export default NotFoundContainer;
