import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import CInputContainer from '@components/common/CInput/containers/CInputContainer';
import React from 'react';

type Props = {
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onAdminLoginClicked: () => void;
  loginBtnActive: boolean;
};

const AdminLogin = ({
  onEmailChanged,
  onPasswordChanged,
  onAdminLoginClicked,
  loginBtnActive,
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
      </article>
    </section>
  );
};

export default AdminLogin;
