import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLogin from '../AdminLogin';
import { EMAIL_INPUT_REGEX, PASSWORD_INUPT_REGEX } from '@libs/regex';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreAdminType,
  getDocDataFromFirestore,
  login,
} from '@libs/firebase';
import useRoute from '@hooks/useRoutes';
import { ADMIN_ROUTE } from '@routes/components/AdminNavigation';
import { STORAGE_KEYS, getStorageData, setStorageData } from '@libs/webStorage';
import useAdmin from '@hooks/store/useAdmin';

const AdminLoginContainer = () => {
  const { __routeWithAdminNavigation } = useRoute();
  const { __updateAdminInfo } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginBtnActive = useMemo(
    () => EMAIL_INPUT_REGEX.test(email) && PASSWORD_INUPT_REGEX.test(password),
    [email, password],
  );

  const checkLoginInfo = useCallback(async () => {
    const uid = getStorageData('LOCAL', STORAGE_KEYS.uid);

    if (uid) {
      const adminDocData = (await getDocDataFromFirestore(
        FIRESTORE_COLLECTIONS.admin,
        uid,
      )) as FireStoreAdminType;

      if (adminDocData) {
        __updateAdminInfo({
          name: adminDocData.name,
          uid: adminDocData.uid,
          image: adminDocData.image ?? '',
        });

        __routeWithAdminNavigation(ADMIN_ROUTE.MAIN);
      }
    }
  }, [__updateAdminInfo, __routeWithAdminNavigation]);

  const onEmailChanged = useCallback((email: string) => {
    setEmail(email);
  }, []);

  const onPasswordChanged = useCallback((password: string) => {
    setPassword(password);
  }, []);

  const onAdminLoginClicked = useCallback(async () => {
    if (!loginBtnActive) {
      alert('계정 정보가 올바르게 입력되지 않았습니다');
      return;
    }

    try {
      const uc = await login(email, password);

      const user = uc.user;

      const adminDocData = (await getDocDataFromFirestore(
        FIRESTORE_COLLECTIONS.admin,
        user.uid,
      )) as FireStoreAdminType;

      if (adminDocData) {
        setStorageData('LOCAL', STORAGE_KEYS.uid, user.uid);

        __updateAdminInfo({
          name: adminDocData.name,
          uid: adminDocData.uid,
          image: adminDocData.image ?? '',
        });

        __routeWithAdminNavigation(ADMIN_ROUTE.MAIN);
      } else {
        alert('현재 페이지는 관리자 전용 페이지 입니다!');
      }
    } catch (e) {
      alert('계정이 존재하지 않습니다!');
    }
  }, [
    email,
    password,
    loginBtnActive,
    __routeWithAdminNavigation,
    __updateAdminInfo,
  ]);

  useEffect(() => {
    checkLoginInfo();
  }, [checkLoginInfo]);

  return (
    <AdminLogin
      onEmailChanged={onEmailChanged}
      onPasswordChanged={onPasswordChanged}
      onAdminLoginClicked={onAdminLoginClicked}
      loginBtnActive={loginBtnActive}
    />
  );
};

export default AdminLoginContainer;
