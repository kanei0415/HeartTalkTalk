import React, { useCallback, useEffect, useState } from 'react';
import AdminMain from '../AdminMain';
import useRoute from '@hooks/useRoutes';
import {
  FIRESTORE_COLLECTIONS,
  FireStorePromptType,
  PROMPTS,
  getDocDataFromFirestore,
} from '@libs/firebase';
import useAdmin from '@hooks/store/useAdmin';
import {
  STORAGE_KEYS,
  getStorageData,
  removeStorageData,
} from '@libs/webStorage';

const AdminMainContainer = () => {
  const { __routeWithReset, __back } = useRoute();
  const { admin, __flushInfo } = useAdmin();
  const [prompt, setPrompt] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [tabs, setTabs] = useState<string[]>(Object.values(PROMPTS));
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const loadPrompt = useCallback(async (tab: string) => {
    const data = (await getDocDataFromFirestore(
      FIRESTORE_COLLECTIONS.prompts,
      tab,
    )) as FireStorePromptType;

    if (data) {
      setPrompt(data.contents);
    }
  }, []);

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

  const onLogoutClicked = useCallback(() => {
    removeStorageData('LOCAL', STORAGE_KEYS.adminUid);

    __flushInfo();
    __back();
  }, [__flushInfo, __back]);

  const onTabClicked = useCallback((tab: string) => {
    setCurrentTab(tab);
  }, []);

  const onPromptChanged = useCallback((newValue: string) => {
    setNewPrompt(newValue);
  }, []);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  useEffect(() => {
    if (currentTab) {
      loadPrompt(currentTab);
    }
  }, [loadPrompt, currentTab]);

  return (
    <AdminMain
      admin={admin}
      tabs={tabs}
      currentTab={currentTab}
      prompt={prompt}
      onTabClicked={onTabClicked}
      onPromptChanged={onPromptChanged}
      onLogoutClicked={onLogoutClicked}
    />
  );
};

export default AdminMainContainer;
