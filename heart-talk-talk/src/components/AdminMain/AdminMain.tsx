import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import { FireStoreAdminType } from '@libs/firebase';
import React from 'react';

type Props = {
  admin: FireStoreAdminType;
  tabs: string[];
  currentTab: string | null;
  prompt: string;
  onTabClicked: (tab: string) => void;
  onPromptChanged: (newValue: string) => void;
  onLogoutClicked: () => void;
  onUpdateBtnActivate: boolean;
  onUpdateBtnClicked: () => void;
};

const AdminMain = ({
  admin,
  tabs,
  currentTab,
  prompt,
  onTabClicked,
  onPromptChanged,
  onLogoutClicked,
  onUpdateBtnActivate,
  onUpdateBtnClicked,
}: Props) => {
  return (
    <article className='flex flex-row w-full h-full p-4'>
      <section style={{ width: 400 }} className='bg-zinc flex flex-col p-4'>
        <div className='flex flex-row'>
          <img
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              objectFit: 'cover',
            }}
            className='bg-black'
            src={admin.image}
            alt='user profile'
          />
          <div className='flex flex-col p-4'>
            <span className='text-black font-bold text-xl'>{admin.name}</span>
            <div style={{ height: 24 }}></div>
            <span className='text-black font-bold text-xl'>{'관리자님'}</span>
          </div>
        </div>
        <div style={{ height: 24 }} className='flex-1'>
          {tabs.map((tab, i) => (
            <button
              onClick={() => onTabClicked(tab)}
              key={i}
              style={{ height: 48, marginBottom: 16, width: 360 }}
              className={`flex flex-row items-center p-4 border rounded border-blue ${
                currentTab === tab && 'bg-blue bg-opacity-50'
              }`}>
              <span className='text-base font-regular text-black'>{tab}</span>
              <div className='flex-1'></div>
              <img src={images.main.chattingArrow} alt='chatting btn' />
            </button>
          ))}
        </div>
        <CButtonContainer
          label='로그아웃'
          onClicked={onLogoutClicked}
          activate
        />
      </section>
      {currentTab && (
        <section className='flex-1 flex-col justify-center items-stretch p-8'>
          <h1 className='text-center'>{currentTab}</h1>
          <div style={{ height: 24 }}></div>
          <textarea
            key={currentTab}
            style={{
              overflow: 'hidden',
              resize: 'none',
            }}
            rows={20}
            className='p-4 bg-zinc border border-black text-black font-bold text-xl w-full'
            onChange={(e) => onPromptChanged(e.target.value)}
            defaultValue={prompt}
          />
          <div style={{ height: 24 }}></div>
          <CButtonContainer
            onClicked={onUpdateBtnClicked}
            label='프롬프트 변경'
            activate={onUpdateBtnActivate}
          />
        </section>
      )}
    </article>
  );
};

export default AdminMain;
