import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Servey from '../Servey';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreServeyItemType,
  getOnSnapShotCollectionFromFireStore,
} from '@libs/firebase';

const ServeyContainer = () => {
  const [problems, setProblems] = useState<FireStoreServeyItemType[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

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

  const onServerSubmitBtnClicked = useCallback(() => {}, []);

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
    />
  );
};

export default ServeyContainer;
