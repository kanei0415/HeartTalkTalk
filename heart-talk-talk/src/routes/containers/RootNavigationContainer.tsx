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
import useBackdrop from '@hooks/store/useBackdrop';

const RootNavigationContainer = () => {
  const { user, __updateUserInfo } = useUser();
  const { backdrop } = useBackdrop();

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

  return (
    <>
      {backdrop && (
        <div
          style={{
            backgroundColor: '#00000055',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999,
          }}
          onClick={(e) => {
            e.preventDefault();
          }}
          className='w-full h-full'
        />
      )}
      <RootNavigation />
    </>
  );
};

export default RootNavigationContainer;
