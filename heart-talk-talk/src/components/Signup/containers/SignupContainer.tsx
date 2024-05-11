import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Signup from '../Signup';
import {
  EMAIL_INPUT_REGEX,
  NAME_INPUT_REGEX,
  PASSWORD_INUPT_REGEX,
} from '@libs/regex';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreUserType,
  getDocDataFromFirestore,
  initializeCreatedUser,
  login,
  signup,
  uploadFileToStorage,
} from '@libs/firebase';
import { getCurrentDayData } from '@libs/date';
import useUser from '@hooks/store/useUser';
import { STORAGE_KEYS, setStorageData } from '@libs/webStorage';
import useRoute from '@hooks/useRoutes';
import { ROOT_ROUTES } from '@routes/RootNavigation';
import useBackdrop from '@hooks/store/useBackdrop';

const fr = new FileReader();

const SignupContainer = () => {
  const { __routeWithRootNavigation } = useRoute();
  const { __updateUserInfo } = useUser();
  const [image, setImage] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const { __backdropOff, __backdropOn } = useBackdrop();

  const emailVaild = useMemo(() => EMAIL_INPUT_REGEX.test(email), [email]);

  const passwordValid = useMemo(
    () => PASSWORD_INUPT_REGEX.test(password),
    [password],
  );

  const passwordConfirmValid = useMemo(
    () =>
      PASSWORD_INUPT_REGEX.test(passwordConfirm) &&
      password === passwordConfirm,
    [password, passwordConfirm],
  );

  const nameValid = useMemo(() => NAME_INPUT_REGEX.test(name), [name]);

  const signupBtnActive = useMemo(
    () => emailVaild && passwordValid && passwordConfirmValid && nameValid,
    [emailVaild, passwordValid, passwordConfirmValid, nameValid],
  );

  const passwordConfirmError = useMemo(() => {
    if (passwordConfirm !== '' && passwordConfirm !== password) {
      return {
        onError: true,
        errorMsg: '비밀번호와 일치하지 않습니다',
      };
    }

    return null;
  }, [password, passwordConfirm]);

  const onImageSelected = useCallback((file: File) => {
    setImage(file);
  }, []);

  const onEmailChanged = useCallback((email: string) => {
    setEmail(email);
  }, []);

  const onPasswordChanged = useCallback((password: string) => {
    setPassword(password);
  }, []);

  const onPasswordConfirmChanged = useCallback((passwordConfirm: string) => {
    setPasswordConfirm(passwordConfirm);
  }, []);

  const onNameChanged = useCallback((name: string) => setName(name), []);

  const onSignupBtnClicked = useCallback(async () => {
    __backdropOn();

    if (!signupBtnActive) {
      return;
    }

    const uc = await signup(email, password).catch((_) => null);

    if (!uc) {
      alert('이미 가입된 이메일 입니다');
      return;
    }

    await login(email, password);

    const downloadUrl = await uploadFileToStorage(name, image);

    const result = await initializeCreatedUser({
      uid: uc.user.uid,
      name,
      image: downloadUrl || '',
      createdAt: getCurrentDayData(),
    });

    if (result.data.success) {
      const userData = (await getDocDataFromFirestore(
        FIRESTORE_COLLECTIONS.user,
        uc.user.uid,
      )) as FireStoreUserType;

      if (userData) {
        alert(`환영합니다 ${name} 님`);
        setStorageData('LOCAL', STORAGE_KEYS.uid, uc.user.uid);
        __updateUserInfo(userData);
        __routeWithRootNavigation(ROOT_ROUTES.MAIN);
      }
    }

    __backdropOff();
  }, [
    signupBtnActive,
    email,
    password,
    image,
    name,
    __updateUserInfo,
    __routeWithRootNavigation,
    __backdropOn,
    __backdropOff,
  ]);

  useEffect(() => {
    if (FileReader && image != null) {
      fr.readAsDataURL(image);
    }
  }, [image]);

  useEffect(() => {
    fr.onload = () => {
      setImageSrc(fr.result as string | null);
    };

    return () => {
      fr.onload = null;
    };
  }, []);

  return (
    <Signup
      onImageSelected={onImageSelected}
      imageSrc={imageSrc}
      signupBtnActive={signupBtnActive}
      passwordConfirmError={passwordConfirmError}
      onEmailChanged={onEmailChanged}
      onPasswordChanged={onPasswordChanged}
      onPasswordConfirmChanged={onPasswordConfirmChanged}
      onNameChanged={onNameChanged}
      onSignupBtnClicked={onSignupBtnClicked}
    />
  );
};

export default SignupContainer;
