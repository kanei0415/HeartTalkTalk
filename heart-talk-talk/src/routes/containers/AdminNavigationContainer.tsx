import useAdmin from '@hooks/store/useAdmin';
import useRoute from '@hooks/useRoutes';
import {
  FIRESTORE_COLLECTIONS,
  FireStoreAdminType,
  getDocDataFromFirestore,
} from '@libs/firebase';
import { STORAGE_KEYS, getStorageData } from '@libs/webStorage';
import AdminNavigation, {
  ADMIN_ROUTE,
} from '@routes/components/AdminNavigation';
import React, { useCallback, useEffect } from 'react';

const AdminNavigaionContainer = () => {
  const { __updateAdminInfo } = useAdmin();
  const { __routeWithAdminNavigation } = useRoute();

  const loadAdminData = useCallback(async () => {
    const uid = getStorageData('LOCAL', STORAGE_KEYS.adminUid);

    if (!uid) {
      return;
    }

    const data = (await getDocDataFromFirestore(
      FIRESTORE_COLLECTIONS.admin,
      uid,
    )) as FireStoreAdminType;

    if (!data) {
      return;
    }

    __updateAdminInfo(data);
    __routeWithAdminNavigation(ADMIN_ROUTE.MAIN);
  }, [__updateAdminInfo, __routeWithAdminNavigation]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);
  return <AdminNavigation />;
};

export default AdminNavigaionContainer;
