import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MainChatting from '../components/MainChatting';
import useUser from '@hooks/store/useUser';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreChattingItemsType,
  addChattingItem,
  chattingResponseAdd,
  getDocDataFromFirestore,
  getOnSnapshotFromFirestore,
} from '@libs/firebase';
import { getCurrentDayData } from '@libs/date';

type Props = {
  k: number;
};

const MainChattingContainer = ({ k }: Props) => {
  const { user } = useUser();

  const [chattingItems, setChattingItems] =
    useState<FireStoreChattingItemsType>({
      items: [],
      createdAt: 0,
    });
  const [input, setInput] = useState('');

  const isResponsable = useMemo(() => {
    return (
      chattingItems.items.length > 1 &&
      chattingItems.items[chattingItems.items.length - 1].sender !== 'SYSTEM'
    );
  }, [chattingItems]);

  const chattable = useMemo(() => {
    if (chattingItems.createdAt === 0) {
      return false;
    }

    return getCurrentDayData() === chattingItems.createdAt;
  }, [chattingItems]);

  const inputRef = useRef<HTMLInputElement>(null);

  const onResponseMessageAddBtnClicked = useCallback(() => {
    if (!user) {
      return;
    }

    chattingResponseAdd({ uid: user.uid, day: k });
  }, [user, k]);

  const loadChatting = useCallback(async () => {
    if (!user.uid) {
      return;
    }

    const docData = await getDocDataFromFirestore(
      `${FIRESTORE_COLLECTIONS.chatting}/${user.uid}/${FIRESTORE_COLLECTIONS.chattings.chattingItem}`,
      k + '',
    );

    if (docData) {
      setChattingItems(docData as FireStoreChattingItemsType);
    }
  }, [user, k]);

  const onInputChanged = useCallback((v: string) => {
    setInput(v);
  }, []);

  const onSendClicked = useCallback(async () => {
    await addChattingItem(user.uid, k, [
      ...chattingItems.items,
      {
        contents: input,
        sender: 'USER',
      },
    ]);

    setInput('');
    if (inputRef?.current) {
      inputRef.current.value = '';
    }
  }, [input, chattingItems, inputRef, user, k]);

  useEffect(() => {
    loadChatting();
  }, [loadChatting]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }

    const promiseUnscribe = getOnSnapshotFromFirestore(
      `${FIRESTORE_COLLECTIONS.chatting}/${user.uid}/${FIRESTORE_COLLECTIONS.chattings.chattingItem}`,
      k + '',
      (snapshot) => {
        setChattingItems({ ...snapshot.data() } as FireStoreChattingItemsType);
      },
    );

    return () => {
      promiseUnscribe.then((unscriber) => unscriber());
    };
  }, [user, k]);

  return (
    <MainChatting
      chattingItems={chattingItems}
      user={user}
      onInputChanged={onInputChanged}
      onSendClicked={onSendClicked}
      inputRef={inputRef}
      chattable={chattable}
      isResponsable={isResponsable}
      onResponseMessageAddBtnClicked={onResponseMessageAddBtnClicked}
    />
  );
};

export default MainChattingContainer;
