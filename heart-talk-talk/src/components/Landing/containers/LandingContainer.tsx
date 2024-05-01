import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Landing from '../Landing';
import useRoute from '@hooks/useRoutes';
import { ROOT_ROUTES } from '@routes/RootNavigation';
import { EMAIL_INPUT_REGEX, PASSWORD_INUPT_REGEX } from '@libs/regex';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreUserType,
  getDocDataFromFirestore,
  googleLogin,
  initializeCreatedUser,
  login,
  setDocDataToFirestore,
} from '@libs/firebase';
import { STORAGE_KEYS, getStorageData, setStorageData } from '@libs/webStorage';
import useUser from '@hooks/store/useUser';
import { getCurrentDayData } from '@libs/date';

const LandingContainer = () => {
  const { __routeWithRootNavigation } = useRoute();
  const { __updateUserInfo } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginBtnActive = useMemo(
    () => EMAIL_INPUT_REGEX.test(email) && PASSWORD_INUPT_REGEX.test(password),
    [email, password],
  );

  const checkLoginInfo = useCallback(async () => {
    const uid = getStorageData('LOCAL', STORAGE_KEYS.uid);

    if (uid) {
      const docData = await getDocDataFromFirestore(
        FIRESTORE_COLLECTIONS.user,
        uid,
      );

      if (docData) {
        __updateUserInfo(docData as FireStoreUserType);

        __routeWithRootNavigation(ROOT_ROUTES.MAIN);
      }
    }
  }, [__updateUserInfo, __routeWithRootNavigation]);

  const onEmailChanged = useCallback((email: string) => setEmail(email), []);

  const onPasswordChanged = useCallback(
    (password: string) => setPassword(password),
    [],
  );

  const onLoginClicked = useCallback(async () => {
    if (!loginBtnActive) {
      alert('계정 정보가 올바르게 입력되지 않았습니다');
      return;
    }

    try {
      const uc = await login(email, password);

      const user = uc.user;

      const userDocData = await getDocDataFromFirestore(
        FIRESTORE_COLLECTIONS.user,
        user.uid,
      );

      if (userDocData) {
        setStorageData('LOCAL', STORAGE_KEYS.uid, user.uid);

        __updateUserInfo(userDocData as FireStoreUserType);

        __routeWithRootNavigation(ROOT_ROUTES.MAIN);
      } else {
        alert('계정이 존재하지 않습니다');
        __routeWithRootNavigation(ROOT_ROUTES.SIGNUP);
      }
    } catch (e) {
      console.error(e);
    }
  }, [
    loginBtnActive,
    email,
    password,
    __updateUserInfo,
    __routeWithRootNavigation,
  ]);

  const onGoogleLoginClicked = useCallback(async () => {
    const [uc] = await googleLogin();

    const docData = await getDocDataFromFirestore(
      FIRESTORE_COLLECTIONS.user,
      uc.user.uid,
    );

    if (docData) {
      setStorageData('LOCAL', STORAGE_KEYS.uid, uc.user.uid);

      __updateUserInfo(docData as FireStoreUserType);

      __routeWithRootNavigation(ROOT_ROUTES.MAIN);
    } else {
      const userData = {
        name: uc.user.displayName ?? '새로운 이용자',
        uid: uc.user.uid,
        image: uc.user.photoURL,
        days: 1,
        createdAt: getCurrentDayData(),
      } satisfies FireStoreUserType;

      setDocDataToFirestore(FIRESTORE_COLLECTIONS.user, uc.user.uid, userData);

      setStorageData('LOCAL', STORAGE_KEYS.uid, uc.user.uid);

      const result = await initializeCreatedUser({
        uid: uc.user.uid,
        name: uc.user.displayName ?? '새로운 이용자',
        image: uc.user.photoURL,
        createdAt: getCurrentDayData(),
      });

      if (result.data.success) {
        const userData = (await getDocDataFromFirestore(
          FIRESTORE_COLLECTIONS.user,
          uc.user.uid,
        )) as FireStoreUserType;

        alert(`환영합니다 ${uc.user.displayName ?? '새로운 이용자'} 님`);
        setStorageData('LOCAL', STORAGE_KEYS.uid, uc.user.uid);
        __updateUserInfo(userData);
        __routeWithRootNavigation(ROOT_ROUTES.MAIN);
        return;
      }

      alert('구글 계정 생성에 실패했습니다');
    }
  }, [__updateUserInfo, __routeWithRootNavigation]);

  const onServeyBtnClicked = useCallback(() => {
    __routeWithRootNavigation(ROOT_ROUTES.SERVEY);
  }, [__routeWithRootNavigation]);

  const onSignupClicked = useCallback(() => {
    __routeWithRootNavigation(ROOT_ROUTES.SIGNUP);
  }, [__routeWithRootNavigation]);

  useEffect(() => {
    checkLoginInfo();
  }, [checkLoginInfo]);

  return (
    <Landing
      onServeyBtnClicked={onServeyBtnClicked}
      onEmailChanged={onEmailChanged}
      onPasswordChanged={onPasswordChanged}
      onLoginClicked={onLoginClicked}
      onGoogleLoginClicked={onGoogleLoginClicked}
      onSignupClicked={onSignupClicked}
      loginBtnActive={loginBtnActive}
    />
  );
};

export default LandingContainer;
