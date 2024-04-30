import React, { useCallback, useEffect } from 'react';
import AdminMain from '../AdminMain';
import useRoute from '@hooks/useRoutes';
import { FIRESTORE_COLLECTIONS, getDocDataFromFirestore } from '@libs/firebase';
import useAdmin from '@hooks/store/useAdmin';
import { STORAGE_KEYS, getStorageData } from '@libs/webStorage';

const AdminMainContainer = () => {
  const { __routeWithReset } = useRoute();
  const { admin, __flushInfo } = useAdmin();

  const checkAdmin = useCallback(async () => {
    const uid = getStorageData('LOCAL', STORAGE_KEYS.uid);

    if (uid) {
      const doc = await getDocDataFromFirestore(
        FIRESTORE_COLLECTIONS.admin,
        uid,
      );

      if (!doc) {
        __routeWithReset();
        __flushInfo();
      }

      return;
    } else {
      __routeWithReset();
      __flushInfo();
    }
  }, [__routeWithReset, __flushInfo]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  return <AdminMain />;
};

export default AdminMainContainer;
