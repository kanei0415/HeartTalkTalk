import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import CInputContainer from '@components/common/CInput/containers/CInputContainer';
import React from 'react';

type Props = {
  onServeyBtnClicked: () => void;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onLoginClicked: () => void;
  onGoogleLoginClicked: () => void;
  onSignupClicked: () => void;
  loginBtnActive: boolean;
};

const Landing = ({
  onServeyBtnClicked,
  onEmailChanged,
  onPasswordChanged,
  onLoginClicked,
  onGoogleLoginClicked,
  onSignupClicked,
  loginBtnActive,
}: Props) => {
  return (
    <section className='flex flex-row h-full'>
      <article className='flex-1 flex flex-col p-4'>
        <div className='flex flex-row p-4'>
          <img src={images.landing.logo} alt='landing page logo' />
          <img
            className='rotate-180'
            src={images.landing.logo}
            alt='landing page logo'
          />
        </div>
        <div style={{ height: 40 }}></div>
        <div className='flex-1 flex flex-col items-end'>
          <span className='text-xl text-black text-bold'>
            {'오늘 하루도 힘들었을 당신에게 건내는'}
          </span>
          <div style={{ height: 8 }}></div>
          <span className='text-xl text-black text-bold'>
            {'세상에서 가장 따뜻한 '}
            <span className='text-2xl text-pink text-bold'>{' 위로'}</span>
          </span>
          <div style={{ height: 8 }}></div>
          <img src={images.landing.typo} alt='landing type' />
          <div className='flex-1'></div>
          <div className='w-full p-4'>
            <span className='text-base font-regular text-black'>
              {'Presented By Kanei'}
            </span>
          </div>
        </div>
      </article>
      <article className='flex-1 flex flex-col'>
        <div className='flex-1 flex flex-col items-center justify-center'>
          <span className='text-xl font-bold text-black'>
            {'지금 당장 고민이 있다면?'}
          </span>
          <span className='text-xl font-bold text-black'>
            {'로그인 없이 상담을 시작해봐요!'}
          </span>
          <div style={{ height: 24 }}></div>
          <div className='flex flex-row items-center'>
            <img
              style={{ height: 60, marginRight: 24 }}
              src={images.landing.typo}
              alt='landing typo'
            />
            <CButtonContainer
              onClicked={onServeyBtnClicked}
              label='설문지 작성하고 상담하기 '
              imgSrc={images.landing.rightArrow}
              activate
            />
          </div>
        </div>
        <div className='flex-1 flex flex-col justify-center items-center p-12'>
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
            onClicked={onLoginClicked}
            activate={loginBtnActive}
          />
          <div style={{ height: 24 }} />
          <button
            style={{ height: 48, borderRadius: 24 }}
            onClick={onGoogleLoginClicked}
            className='w-full flex flex-row items-center p-4 bg-stone text-base font-regular text-white justify-center'>
            <img
              style={{ marginRight: 8 }}
              src={images.landing.google}
              alt='google login'
            />
            {'구글 계정으로 로그인 하기'}
          </button>
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
          <span
            onClick={onSignupClicked}
            className='text-base font-bold text-black cursor-pointer'>
            {'아직 계정을 만들지 않으셨나요? '}
            <span style={{ textDecoration: 'underline' }} className='text-pink'>
              {' 회원가입'}
            </span>
          </span>
          {/* <span
            style={{ marginTop: 24 }}
            className='text-base font-bold text-black cursor-pointer'>
            {'비밀번호가 기억나지 않으신가요? '}
            <span style={{ textDecoration: 'underline' }} className='text-pink'>
              {' 비밀번호 찾기'}
            </span>
          </span> */}
        </div>
      </article>
    </section>
  );
};

export default Landing;
