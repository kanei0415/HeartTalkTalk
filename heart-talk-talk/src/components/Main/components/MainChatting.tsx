import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import { FireStoreChattingItemsType, FireStoreUserType } from '@libs/firebase';
import React, { RefObject } from 'react';

type Props = {
  chattingItems: FireStoreChattingItemsType;
  user: FireStoreUserType;
  onInputChanged: (v: string) => void;
  onSendClicked: () => void;
  inputRef: RefObject<HTMLInputElement>;
  chattable: boolean;
  isResponsable: boolean;
  onResponseMessageAddBtnClicked: () => void;
};

const MainChatting = ({
  chattingItems,
  user,
  onInputChanged,
  onSendClicked,
  inputRef,
  chattable,
  isResponsable,
  onResponseMessageAddBtnClicked,
}: Props) => {
  return (
    <>
      <div
        style={{ paddingBottom: 120 }}
        className='chatting-container w-full h-full flex flex-col p-4 overflow-y-auto'>
        {chattingItems.items.map((item, index) =>
          item.sender === 'SYSTEM' ? (
            <div key={index} className='w-full flex flex-row justify-start p-4'>
              <img
                style={{ width: 40, height: 40, borderRadius: 20 }}
                src={images.main.systemSender}
                alt='system sender'
              />
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderTopLeftRadius: 2,
                  marginTop: 20,
                  marginLeft: 8,
                }}
                className='bg-zinc border-blue border text-base text-black font-regular'>
                {item.contents}
              </div>
            </div>
          ) : (
            <div key={index} className='w-full flex flex-row justify-end p-4'>
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderTopRightRadius: 2,
                  marginTop: 20,
                  marginRight: 8,
                }}
                className='bg-zinc border-blue border text-black font-regular'>
                {item.contents}
              </div>
              {user.image ? (
                <img
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    objectFit: 'cover',
                  }}
                  src={user.image}
                  alt='user sender'
                />
              ) : (
                <div
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  className='bg-black'></div>
              )}
            </div>
          ),
        )}
        <CButtonContainer
          label='답변 받기'
          onClicked={onResponseMessageAddBtnClicked}
          activate={chattable && isResponsable}
        />
      </div>
      {chattable && (
        <div
          style={{ height: 96 }}
          className='bg-white w-full flex flex-row sticky bottom-0 p-4'>
          <input
            ref={inputRef}
            onChange={(e) => onInputChanged(e.target.value)}
            placeholder='대답을 입력해주세요'
            style={{ height: 48, borderRadius: 24, paddingLeft: 24 }}
            className='flex-1 flex items-center bg-pink text-base text-black font-regular opacity-50'
            type='text'
          />
          <button
            onClick={onSendClicked}
            style={{ width: 48, height: 48, borderRadius: 24, marginLeft: 24 }}
            className='bg-pink flex items-center justify-center opacity-50'>
            <img src={images.main.send} alt='send btn' />
          </button>
        </div>
      )}
    </>
  );
};

export default MainChatting;
