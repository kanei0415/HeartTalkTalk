import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import {
  FireStoreResultsType,
  FireStoreTitlesType,
  FireStoreUserType,
} from '@libs/firebase';
import React from 'react';
import MainChattingContainer from './containers/MainChattingContainer';

type Props = {
  user: FireStoreUserType;
  titles: FireStoreTitlesType[];
  onLogoutClicked: () => void;
  onChattingItemClicked: (k: number) => void;
  currentChat: number;
  isNewChatCreatable: boolean;
  newChatStartClicked: () => void;
  result: FireStoreResultsType | null;
  onDeleteUserClicked: () => void;
};

const Main = ({
  user,
  titles,
  onLogoutClicked,
  currentChat,
  isNewChatCreatable,
  newChatStartClicked,
  onChattingItemClicked,
  result,
  onDeleteUserClicked,
}: Props) => {
  return (
    <article className='flex flex-row w-full h-full'>
      <section
        style={{
          width: 300,
        }}
        className='bg-zinc flex flex-col p-4'>
        <div className='flex flex-row'>
          {user.image ? (
            <img
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                objectFit: 'cover',
              }}
              className='bg-black'
              src={user.image}
              alt='user profile'
            />
          ) : (
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
              className='bg-black'></div>
          )}
          <div className='flex flex-col p-4'>
            <span className='text-black font-bold text-xl'>{`${user.name}`}</span>
            <div className='flex-1'></div>
            <span className='text-black font-bold text-base'>
              <span className='text-2xl text-pink'>{user.days} </span>
              {'일째 상담중'}
            </span>
          </div>
        </div>
        <div className='flex-1 flex flex-col'>
          <div style={{ marginTop: 24 }} className='flex-1 flex flex-col'>
            {titles.map((t, i) => (
              <button
                onClick={() => onChattingItemClicked(i + 1)}
                key={i}
                style={{ height: 48, marginBottom: 16 }}
                className={`flex flex-row items-center p-4 border rounded border-blue ${
                  currentChat === i + 1 && 'bg-blue bg-opacity-50'
                }`}>
                <span className='text-base font-regular text-black'>{`${
                  i + 1
                }일차 - ${t.label}`}</span>
                <div className='flex-1'></div>
                <img src={images.main.chattingArrow} alt='chatting btn' />
              </button>
            ))}
            {isNewChatCreatable && (
              <CButtonContainer
                label='오늘의 상담 시작하기'
                onClicked={newChatStartClicked}
                activate
              />
            )}
          </div>
          <CButtonContainer
            label='회원탈퇴'
            onClicked={onDeleteUserClicked}
            activate
          />
          <div style={{ height: 24 }} />
          <CButtonContainer
            label='로그아웃'
            onClicked={onLogoutClicked}
            activate
          />
        </div>
      </section>
      <section className='flex-1'>
        <MainChattingContainer k={currentChat} />
      </section>
      <section
        style={{ padding: 24 }}
        className='flex-1 bg-zinc flex flex-col items-center'>
        <h1 className='text-xl font-bold text-black'>{'상담 결과 기록'}</h1>
        {result?.items.map((res, i) => (
          <span
            key={i}
            style={{ marginTop: 16 }}
            className='text-xl font-bold text-black'>{`${i + 1}. ${res}`}</span>
        ))}
      </section>
    </article>
  );
};

export default Main;
