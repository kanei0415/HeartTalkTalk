import images from '@assets/images';
import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import CInputContainer from '@components/common/CInput/containers/CInputContainer';
import {
  FireStoreAdminType,
  FireStorePromptType,
  FireStoreServeyItemType,
  FirestoreReportType,
} from '@libs/firebase';
import React from 'react';

type Props = {
  admin: FireStoreAdminType;
  currentTab: number;
  prompts: FireStorePromptType[];
  onTabClicked: (tab: number) => void;
  onPromptChanged: (newValue: string) => void;
  onLogoutClicked: () => void;
  onUpdateBtnActivate: boolean;
  onUpdateBtnClicked: () => void;
  serveySelected: boolean;
  onSelectTabClicked: () => void;
  serveyItems: FireStoreServeyItemType[];
  onServeyItemChanged: (index: number, value: string) => void;
  onServeyItemAddBtnClicked: () => void;
  onServeyItemUpdateClicked: (index: number) => void;
  serveyItemsUpdateBtnActiveList: boolean[];
  onReportTabClicked: () => void;
  reportSelected: boolean;
  reports: FirestoreReportType[];
  onReplyChanged: (index: number, content: string) => void;
  onReplySaveBtnClicked: (index: number) => void;
};

const AdminMain = ({
  admin,
  currentTab,
  prompts,
  onTabClicked,
  onPromptChanged,
  onLogoutClicked,
  onUpdateBtnActivate,
  onUpdateBtnClicked,
  serveySelected,
  onSelectTabClicked,
  serveyItems,
  onServeyItemChanged,
  onServeyItemAddBtnClicked,
  onServeyItemUpdateClicked,
  serveyItemsUpdateBtnActiveList,
  onReportTabClicked,
  reportSelected,
  reports,
  onReplyChanged,
  onReplySaveBtnClicked,
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
        <div style={{ height: 24 }} className='flex-1 overflow-y-scroll'>
          {prompts.map((prompt, i) => (
            <button
              onClick={() => onTabClicked(i)}
              key={i}
              style={{ height: 48, marginBottom: 16, width: 360 }}
              className={`flex flex-row items-center p-4 border rounded border-blue ${
                currentTab === i && 'bg-blue bg-opacity-50'
              }`}>
              <span className='text-base font-regular text-black'>
                {prompt.id}
              </span>
              <div className='flex-1'></div>
              <img src={images.main.chattingArrow} alt='chatting btn' />
            </button>
          ))}
          <button
            onClick={onSelectTabClicked}
            style={{ height: 48, marginBottom: 16, width: 360 }}
            className={`flex flex-row items-center p-4 border rounded border-blue ${
              serveySelected && 'bg-blue bg-opacity-50'
            }`}>
            <span className='text-base font-regular text-black'>
              {'설문조사 문항'}
            </span>
            <div className='flex-1'></div>
            <img src={images.main.chattingArrow} alt='chatting btn' />
          </button>
          <button
            onClick={onReportTabClicked}
            style={{ height: 48, marginBottom: 16, width: 360 }}
            className={`flex flex-row items-center p-4 border rounded border-blue ${
              reportSelected && 'bg-blue bg-opacity-50'
            }`}>
            <span className='text-base font-regular text-black'>
              {'사용자 신고 채팅'}
            </span>
            <div className='flex-1'></div>
            <img src={images.main.chattingArrow} alt='chatting btn' />
          </button>
          <CButtonContainer
            label='로그아웃'
            onClicked={onLogoutClicked}
            activate
          />
        </div>
      </section>
      {!serveySelected && currentTab >= 0 && (
        <section className='flex-1 flex-col justify-center items-stretch p-8'>
          <h1 className='text-center'>{prompts[currentTab].id}</h1>
          <div style={{ height: 24 }}></div>
          {prompts.length > 0 && (
            <textarea
              key={currentTab}
              style={{
                resize: 'none',
              }}
              rows={20}
              className='p-4 bg-zinc border border-black text-black font-bold text-xl w-full overflow-y-scroll'
              onChange={(e) => onPromptChanged(e.target.value)}
              defaultValue={prompts[currentTab].contents}
            />
          )}
          <div style={{ height: 24 }}></div>
          <CButtonContainer
            onClicked={onUpdateBtnClicked}
            label='프롬프트 변경'
            activate={onUpdateBtnActivate}
          />
        </section>
      )}
      {serveySelected && (
        <section className='flex-1 flex-col justify-center items-stretch p-8 overflow-y-scroll'>
          <h1 className='text-center'>{'설문조사 문항'}</h1>
          <div style={{ height: 24 }}></div>
          {serveyItems.map((item, index) => {
            return (
              <div className='flex flex-row items-center'>
                <CInputContainer
                  type='text'
                  label={`${index + 1}`}
                  defaultValue={item.label}
                  onChange={(v) => {
                    onServeyItemChanged(index, v);
                  }}
                  isNeededValue
                  placeholder='문항 내용을 입력해주세요'
                  error={null}
                  success={null}
                />
                <div style={{ width: 200, marginLeft: 24 }}>
                  <CButtonContainer
                    label='문항 수정'
                    onClicked={() => onServeyItemUpdateClicked(index)}
                    activate={serveyItemsUpdateBtnActiveList[index]}
                  />
                </div>
              </div>
            );
          })}
          <CButtonContainer
            onClicked={onServeyItemAddBtnClicked}
            label='설문지 문항 추가'
            activate
          />
        </section>
      )}
      {reportSelected && (
        <section className='flex-1 flex-col justify-center items-stretch p-8 overflow-y-scroll'>
          <h1 className='text-center'>{'사용자 신고 채팅'}</h1>
          <div style={{ height: 24 }}></div>
          {reports.map((report, index) => (
            <div>
              <div className='text-base font-bold text-black'>{`UID: ${report.uid} DAY: ${report.day}`}</div>
              <div style={{ height: 4 }} />
              <div
                style={{ borderRadius: 4 }}
                className='p-4 border border-black background-zinc text-xl text-black'>
                {report.content}
              </div>
              <div style={{ height: 4 }} />
              <div className='flex flex-row items-center'>
                <CInputContainer
                  type='text'
                  label={'답변'}
                  defaultValue={report.reply}
                  onChange={(v) => {
                    onReplyChanged(index, v);
                  }}
                  isNeededValue={false}
                  placeholder='답변 내용을 입력해주세요'
                  error={null}
                  success={null}
                />
                <div style={{ width: 200, marginLeft: 20 }}>
                  <CButtonContainer
                    onClicked={() => onReplySaveBtnClicked(index)}
                    label='답변하기'
                    activate
                  />
                </div>
              </div>
              <div style={{ height: 12 }} />
            </div>
          ))}
        </section>
      )}
    </article>
  );
};

export default AdminMain;
