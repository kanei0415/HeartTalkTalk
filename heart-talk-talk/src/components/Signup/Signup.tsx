import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import CInputContainer from '@components/common/CInput/containers/CInputContainer';
import React from 'react';

type Props = {
  onImageSelected: (file: File) => void;
  imageSrc: string | null;
  signupBtnActive: boolean;
  passwordConfirmError: {
    onError: boolean;
    errorMsg: string;
  } | null;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onPasswordConfirmChanged: (passwordConfirm: string) => void;
  onNameChanged: (name: string) => void;
  onSignupBtnClicked: () => void;
  onGoogleLoginClicked: () => void;
};

const Signup = ({
  imageSrc,
  onImageSelected,
  signupBtnActive,
  passwordConfirmError,
  onEmailChanged,
  onPasswordChanged,
  onPasswordConfirmChanged,
  onNameChanged,
  onSignupBtnClicked,
  onGoogleLoginClicked,
}: Props) => {
  return (
    <>
      <article className='h-full flex flex-col items-center justify-evenly p-8'>
        <h1 className='text-black font-bold text-xl whitespace-pre-line text-center'>
          {'회원가입하고\n매일매일 심리상담 받아보세요!'}
        </h1>
        <section
          style={{ width: 400 }}
          className='flex-1 flex flex-col justify-center'>
          <CInputContainer
            label='이메일'
            type='email'
            onChange={onEmailChanged}
            placeholder='이메일을 입력해주세요'
            error={null}
            success={null}
            isNeededValue
          />
          <div style={{ height: 16 }}></div>
          <CInputContainer
            label='비밀번호'
            type='password'
            onChange={onPasswordChanged}
            placeholder='비밀번호를 입력해주세요'
            error={null}
            success={null}
            isNeededValue
          />
          <div style={{ height: 16 }}></div>
          <CInputContainer
            label='비밀번호 확인'
            type='password'
            onChange={onPasswordConfirmChanged}
            placeholder='비밀번호를 한번 더 입력해주세요'
            error={passwordConfirmError}
            success={null}
            isNeededValue
          />
          <div
            style={{ marginTop: 24, marginBottom: 24 }}
            className='flex justify-center items-center'>
            <div
              style={{ width: 100, height: 100, borderRadius: 50 }}
              className='relative bg-black cursor-pointer'>
              {imageSrc === null && (
                <img
                  style={{ left: 38, top: 38 }}
                  className='absolute'
                  src={images.signup.camera}
                  alt='camera icon'
                />
              )}
              <input
                style={{ width: 100, height: 100, borderRadius: 50 }}
                className='bg-black opacity-0'
                type='file'
                onChange={(e) => {
                  if (e.target.files?.length ?? 0 >= 1) {
                    onImageSelected(e.target.files?.item(0)!);
                  }
                }}
              />
              {imageSrc && (
                <img
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    top: 0,
                    objectFit: 'cover',
                  }}
                  className='absolute'
                  src={imageSrc}
                  alt='profile uploaded'
                />
              )}
            </div>
          </div>
          <CInputContainer
            label='이름'
            type='name'
            onChange={onNameChanged}
            placeholder='이름을 입력해주세요'
            error={null}
            success={null}
            isNeededValue
          />
          <div style={{ height: 16 }}></div>
          <CButtonContainer
            label='회원가입'
            onClicked={onSignupBtnClicked}
            activate={signupBtnActive}
          />
          <div style={{ height: 48 }} />
          <button
            style={{ height: 48, borderRadius: 24 }}
            onClick={onGoogleLoginClicked}
            className='w-full flex flex-row items-center p-4 bg-stone text-base font-regular text-white justify-center'>
            <img
              style={{ marginRight: 8 }}
              src={images.landing.google}
              alt='google login'
            />
            {'구글 계정으로 회원가입 하기'}
          </button>
        </section>
      </article>
    </>
  );
};

export default Signup;
