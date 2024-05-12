import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ServeyChatting from '../ServeyChatting';
import useServey from '@hooks/store/useServey';
import {
  FIRESTORE_COLLECTIONS,
  ServeyResult,
  getOnSnapshotFromFirestore,
  setDocDataToFirestore,
} from '@libs/firebase';
import {
  STORAGE_KEYS,
  getStorageData,
  removeStorageData,
} from '@libs/webStorage';
import useBackdrop from '@hooks/store/useBackdrop';
import { getCurrentDayData } from '@libs/date';
import useRoute from '@hooks/useRoutes';
import { ROOT_ROUTES } from '@routes/RootNavigation';

const ServeyChattingContainer = () => {
  const { servey, __addServeyResult } = useServey();
  const { __backdropOn, __backdropOff } = useBackdrop();
  const { __routeWithRootNavigation } = useRoute();

  const [serveyData, setServeyData] = useState<ServeyResult | null>(null);
  const [input, setInput] = useState('');

  const chattable = useMemo(() => {
    if (!serveyData) {
      return false;
    }

    return serveyData.createdAt === getCurrentDayData();
  }, [serveyData]);

  const isResponsable = useMemo(() => {
    return (
      chattable &&
      serveyData!.chattingItems[serveyData!.chattingItems.length - 1].sender ===
        'USER'
    );
  }, [chattable, serveyData]);

  const inputRef = useRef<HTMLInputElement>(null);

  const onResponseMessageAddBtnClicked = useCallback(() => {
    __backdropOn();
    alert('회원가입 후 이어서 심리상담 서비스를 받아보세요!');
    __routeWithRootNavigation(ROOT_ROUTES.SIGNUP);
    __backdropOff();
  }, [__routeWithRootNavigation, __backdropOn, __backdropOff]);

  const onInputChanged = useCallback((s: string) => {
    setInput(s);
  }, []);

  const onSendClicked = useCallback(async () => {
    if (!serveyData) {
      return;
    }

    __backdropOn();

    await setDocDataToFirestore(
      FIRESTORE_COLLECTIONS.serveyResults,
      serveyData.id,
      {
        chattingItems: [
          ...serveyData.chattingItems,
          { contents: input, sender: 'USER' },
        ],
      },
    );

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    __backdropOff();
  }, [serveyData, input, inputRef, __backdropOn, __backdropOff]);

  useEffect(() => {
    if (!servey.id) {
      const prev = getStorageData('LOCAL', STORAGE_KEYS.serveyId);

      if (prev) {
        __addServeyResult(prev);
      }
      return;
    }

    const promiseUnscriber = getOnSnapshotFromFirestore(
      FIRESTORE_COLLECTIONS.serveyResults,
      servey.id,
      (d) => {
        const data = d.data();

        if (data) {
          setServeyData(data as ServeyResult);
        } else {
          alert('만료된 설문 결과 입니다!');
          removeStorageData('LOCAL', STORAGE_KEYS.serveyId);
        }
      },
    );

    return () => {
      promiseUnscriber.then((us) => us());
    };
  }, [servey, __addServeyResult]);

  return serveyData ? (
    <ServeyChatting
      serveyData={serveyData}
      chattable={chattable}
      isResponsable={isResponsable}
      onResponseMessageAddBtnClicked={onResponseMessageAddBtnClicked}
      onInputChanged={onInputChanged}
      onSendClicked={onSendClicked}
      inputRef={inputRef}
    />
  ) : null;
};

export default ServeyChattingContainer;
