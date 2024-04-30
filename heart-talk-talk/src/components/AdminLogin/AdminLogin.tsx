import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import CInputContainer from '@components/common/CInput/containers/CInputContainer';
import React from 'react';

type Props = {
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onAdminLoginClicked: () => void;
  loginBtnActive: boolean;
  onGoogleLoginClicked: () => void;
};

const AdminLogin = ({
  onEmailChanged,
  onPasswordChanged,
  onAdminLoginClicked,
  loginBtnActive,
  onGoogleLoginClicked,
}: Props) => {
  return (
    <section className='flex justify-center items-center h-full'>
      <article style={{ width: 400 }} className='flex flex-col'>
        <h1 className='flex justify-center text-black text-2xl'>{'로그인'}</h1>
        <div style={{ height: 40 }} />
        <CInputContainer
          type='email'
          label='이메일'
          placeholder='이메일을 입력해주세요'
          onChange={onEmailChanged}
          error={null}
          success={null}
          isNeededValue
        />
        <div style={{ height: 8 }} />
        <CInputContainer
          type='password'
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          onChange={onPasswordChanged}
          error={null}
          success={null}
          isNeededValue
        />
        <div style={{ height: 24 }} />
        <CButtonContainer
          label='로그인'
          onClicked={onAdminLoginClicked}
          activate={loginBtnActive}
        />
        <button
          style={{ height: 48, borderRadius: 24, marginTop: 24 }}
          onClick={onGoogleLoginClicked}
          className='w-full flex flex-row items-center p-4 bg-stone text-base font-regular text-white justify-center'>
          <img
            style={{ marginRight: 8 }}
            src={images.landing.google}
            alt='google login'
          />
          {'구글 계정으로 로그인 하기'}
        </button>
      </article>
    </section>
  );
};

export default AdminLogin;
