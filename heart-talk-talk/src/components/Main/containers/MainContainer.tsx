import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Main from '../Main';
import useUser from '@hooks/store/useUser';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreResultsType,
  FireStoreTitlesType,
  getAllDocDataFromFireStore,
  getDocDataFromFirestore,
  getOnSnapShotCollectionFromFireStore,
  getOnSnapshotFromFirestore,
  newChattingCreateFunction,
} from '@libs/firebase';
import { STORAGE_KEYS, getStorageData, setStorageData } from '@libs/webStorage';
import useRoute from '@hooks/useRoutes';
import { ROOT_ROUTES } from '@routes/RootNavigation';
import { getCurrentDayData } from '@libs/date';

const MainContainer = () => {
  const { user, __flushInfo } = useUser();
  const { __routeWithRootNavigation } = useRoute();

  const [currentChat, setCurrentChat] = useState(1);

  const [titles, setTitles] = useState<FireStoreTitlesType[]>([]);
  const [result, setResult] = useState<FireStoreResultsType | null>(null);

  const loadResult = useCallback(async () => {
    if (!user.uid) {
      return;
    }

    const resultDocData = (await getDocDataFromFirestore(
      `${FIRESTORE_COLLECTIONS.chatting}/${user.uid}/${FIRESTORE_COLLECTIONS.chattings.results}`,
      currentChat + '',
    )) as FireStoreResultsType;

    if (!resultDocData) {
      return;
    }

    setResult(resultDocData);
  }, [user, currentChat]);

  const isNewChatCreatable = useMemo(() => {
    if (titles.length === 0) {
      return true;
    }

    const last = titles[titles.length - 1];

    return last.createdAt !== getCurrentDayData();
  }, [titles]);

  const newChatStartClicked = useCallback(async () => {
    if (!user.uid) {
      return;
    }

    const result = await newChattingCreateFunction({
      uid: user.uid,
      createdAt: getCurrentDayData(),
    });

    if (!result.data.success) {
      console.error(result.data.message);
    }
  }, [user]);

  const onLogoutClicked = useCallback(() => {
    __flushInfo();
    setStorageData('LOCAL', STORAGE_KEYS.uid, '');
    __routeWithRootNavigation(ROOT_ROUTES.LANDING);
  }, [__flushInfo, __routeWithRootNavigation]);

  const loadTitles = useCallback(async () => {
    const uid = getStorageData('LOCAL', STORAGE_KEYS.uid);

    const docData = await getAllDocDataFromFireStore(
      `${FIRESTORE_COLLECTIONS.chatting}/${uid}/${FIRESTORE_COLLECTIONS.chattings.title}`,
    );

    setTitles(docData as FireStoreTitlesType[]);
  }, []);

  const onChattingItemClicked = useCallback((k: number) => {
    setCurrentChat(k);
  }, []);

  useEffect(() => {
    loadTitles();
  }, [loadTitles]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }

    const promiseUnscribe = getOnSnapShotCollectionFromFireStore(
      `${FIRESTORE_COLLECTIONS.chatting}/${user.uid}/${FIRESTORE_COLLECTIONS.chattings.title}`,
      (qs) => {
        const tmp = [] as FireStoreTitlesType[];
        qs.forEach((doc) => tmp.push(doc.data() as FireStoreTitlesType));
        setTitles(tmp);
      },
    );

    return () => {
      promiseUnscribe.then((unscriber) => unscriber());
    };
  }, [user]);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }

    const promiseUnscribe = getOnSnapshotFromFirestore(
      `${FIRESTORE_COLLECTIONS.chatting}/${user.uid}/${FIRESTORE_COLLECTIONS.chattings.results}`,
      currentChat + '',
      (snapshot) => {
        setResult(snapshot.data() as FireStoreResultsType);
      },
    );

    return () => {
      promiseUnscribe.then((unscriber) => unscriber());
    };
  }, [user, currentChat]);

  return (
    <Main
      user={user}
      titles={titles}
      onLogoutClicked={onLogoutClicked}
      onChattingItemClicked={onChattingItemClicked}
      currentChat={currentChat}
      isNewChatCreatable={isNewChatCreatable}
      newChatStartClicked={newChatStartClicked}
      result={result}
    />
  );
};

export default MainContainer;