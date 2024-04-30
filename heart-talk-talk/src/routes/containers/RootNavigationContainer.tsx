import React, { useCallback, useEffect } from 'react';
import RootNavigation from '../RootNavigation';
import useUser from '@hooks/store/useUser';
import { STORAGE_KEYS, getStorageData } from '@libs/webStorage';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreUserType,
  getDocDataFromFirestore,
  getOnSnapshotFromFirestore,
} from '@libs/firebase';

const RootNavigationContainer = () => {
  const { user, __updateUserInfo } = useUser();

  const loadUserData = useCallback(async () => {
    if (!user.uid) {
      const uid = getStorageData('LOCAL', STORAGE_KEYS.uid);

      if (uid) {
        const docData = await getDocDataFromFirestore(
          FIRESTORE_COLLECTIONS.user,
          uid,
        );

        __updateUserInfo(docData as FireStoreUserType);
      }
    }
  }, [user, __updateUserInfo]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }

    const promiseUnscribe = getOnSnapshotFromFirestore(
      FIRESTORE_COLLECTIONS.user,
      user.uid,
      (snapshot) => {
        __updateUserInfo({ ...snapshot.data() } as FireStoreUserType);
      },
    );

    return () => {
      promiseUnscribe.then((unscriber) => unscriber());
    };
  }, [user, __updateUserInfo]);

  return <RootNavigation />;
};

export default RootNavigationContainer;
