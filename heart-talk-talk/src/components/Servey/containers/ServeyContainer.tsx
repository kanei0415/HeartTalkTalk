import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Servey from '../Servey';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreServeyItemType,
  addServeyResult,
  getOnSnapShotCollectionFromFireStore,
} from '@libs/firebase';
import { STORAGE_KEYS, getStorageData, setStorageData } from '@libs/webStorage';
import useRoute from '@hooks/useRoutes';
import { ROOT_ROUTES } from '@routes/RootNavigation';
import useBackdrop from '@hooks/store/useBackdrop';
import useServey from '@hooks/store/useServey';
import { getCurrentDayData } from '@libs/date';

const ServeyContainer = () => {
  const { __routeWithRootNavigation } = useRoute();
  const { __backdropOn, __backdropOff } = useBackdrop();
  const { __addServeyResult } = useServey();

  const [problems, setProblems] = useState<FireStoreServeyItemType[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  const answerLabels = useMemo(
    () => [
      '응답 안함',
      '전혀 그렇지 않다',
      '약간 그렇지 않다',
      '보통이다',
      '약간 그렇다',
      '매우 그렇다',
    ],
    [],
  );

  const submitBtnActive = useMemo(
    () => answers.findIndex((v) => v === 0) === -1,
    [answers],
  );

  const onAnswerSelected = useCallback((index: number, answer: number) => {
    setAnswers((prev) => {
      prev[index] = answer;
      return [...prev];
    });
  }, []);

  const onServerSubmitBtnClicked = useCallback(async () => {
    __backdropOn();

    const prev = getStorageData('LOCAL', STORAGE_KEYS.serveyId);

    if (prev) {
      alert('이미 제출 이력이 있습니다');
      __addServeyResult(prev);
      __routeWithRootNavigation(ROOT_ROUTES.SERVEY_CHATTING);
      __backdropOff();
      return;
    }

    const {
      data: { success, message },
    } = await addServeyResult({
      serveyResult: answers.map((a, i) => ({
        question: problems[i].label,
        answer: answerLabels[a],
      })),
      createdAt: getCurrentDayData(),
    });

    if (success) {
      setStorageData('LOCAL', STORAGE_KEYS.serveyId, message);
      __addServeyResult(message);
      __routeWithRootNavigation(ROOT_ROUTES.SERVEY_CHATTING);
    } else {
      alert('설문지 제출에 실패했습니다!');
    }

    __backdropOff();
  }, [
    answerLabels,
    answers,
    problems,
    __routeWithRootNavigation,
    __backdropOn,
    __backdropOff,
    __addServeyResult,
  ]);

  useEffect(() => {
    const unscriber = getOnSnapShotCollectionFromFireStore(
      FIRESTORE_COLLECTIONS.serveyTestProblem,
      (qs) => {
        setProblems(qs.docs.map((d) => d.data()) as FireStoreServeyItemType[]);
      },
    );

    return () => {
      unscriber.then((us) => us());
    };
  }, []);

  useEffect(() => {
    setAnswers([...Array(problems.length).keys()].map((_) => 0));
  }, [problems]);

  return (
    <Servey
      problems={problems}
      answers={answers}
      onAnswerSelected={onAnswerSelected}
      submitBtnActive={submitBtnActive}
      onServerSubmitBtnClicked={onServerSubmitBtnClicked}
      answerLabels={answerLabels}
    />
  );
};

export default ServeyContainer;
