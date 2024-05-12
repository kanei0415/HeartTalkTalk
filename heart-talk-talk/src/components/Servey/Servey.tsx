import CButtonContainer from '@components/common/CButton/containers/CButtonContainer';
import CCheckContainer from '@components/common/CCheck/containers/CCheckContainer';
import { FireStoreServeyItemType } from '@libs/firebase';
import React from 'react';

type Props = {
  problems: FireStoreServeyItemType[];
  answers: number[];
  onAnswerSelected: (index: number, answer: number) => void;
  submitBtnActive: boolean;
  onServerSubmitBtnClicked: () => void;
  answerLabels: string[];
};

const Servey = ({
  problems,
  onAnswerSelected,
  answers,
  submitBtnActive,
  onServerSubmitBtnClicked,
  answerLabels,
}: Props) => {
  return (
    <section className='w-full h-full bg-zinc flex flex-col overflow-y-scroll p-8'>
      <div className='text-2xl text-blue font-bold'>{'설문지 작성'}</div>
      <div style={{ height: 36 }} />
      {problems.map((item, index) => {
        return (
          <div className='flex flex-col'>
            <span className='text-xl text-black'>{`${index + 1}. ${
              item.label
            }`}</span>
            <div style={{ height: 16 }} />
            <div className='flex flex-row justify-evenly items-center'>
              <CCheckContainer
                label={answerLabels[1]}
                origin={answers[index] === 1}
                onCheckClickedOrigin={() => {
                  onAnswerSelected(index, 1);
                }}
              />
              <CCheckContainer
                label={answerLabels[2]}
                origin={answers[index] === 2}
                onCheckClickedOrigin={() => {
                  onAnswerSelected(index, 2);
                }}
              />
              <CCheckContainer
                label={answerLabels[3]}
                origin={answers[index] === 3}
                onCheckClickedOrigin={() => {
                  onAnswerSelected(index, 3);
                }}
              />
              <CCheckContainer
                label={answerLabels[4]}
                origin={answers[index] === 4}
                onCheckClickedOrigin={() => {
                  onAnswerSelected(index, 4);
                }}
              />
              <CCheckContainer
                label={answerLabels[5]}
                origin={answers[index] === 5}
                onCheckClickedOrigin={() => {
                  onAnswerSelected(index, 5);
                }}
              />
            </div>
            <div style={{ height: 24 }} />
          </div>
        );
      })}
      <div style={{ height: 24 }} />
      <CButtonContainer
        label='제출하기'
        onClicked={onServerSubmitBtnClicked}
        activate={submitBtnActive}
      />
    </section>
  );
};

export default Servey;
