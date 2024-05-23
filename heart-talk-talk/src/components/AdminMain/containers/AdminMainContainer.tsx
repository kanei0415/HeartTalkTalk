import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminMain from '../AdminMain';
import useRoute from '@hooks/useRoutes';
import {
  FIRESTORE_COLLECTIONS,
  FireStorePromptType,
  FireStoreServeyItemType,
  FirestoreReportType,
  getDocDataFromFirestore,
  getOnSnapShotCollectionFromFireStore,
  setDocDataToFirestore,
} from '@libs/firebase';
import useAdmin from '@hooks/store/useAdmin';
import {
  STORAGE_KEYS,
  getStorageData,
  removeStorageData,
} from '@libs/webStorage';
import useBackdrop from '@hooks/store/useBackdrop';

const AdminMainContainer = () => {
  const { __routeWithReset, __back } = useRoute();
  const { admin, __flushInfo } = useAdmin();
  const [prompt, setPrompt] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [prompts, setPrompts] = useState<FireStorePromptType[]>([]);
  const { __backdropOn, __backdropOff } = useBackdrop();
  const [serveySelected, setServeySelected] = useState(false);
  const [serveyItems, setServeyItems] = useState<FireStoreServeyItemType[]>([]);
  const [serveyItemsUpdated, setServeyItemsUpdated] = useState<
    FireStoreServeyItemType[]
  >([]);
  const [reportSelected, setReportSelected] = useState(false);
  const [reports, setReports] = useState<FirestoreReportType[]>([]);
  const [replys, setReplys] = useState<string[]>([]);

  const serveyItemsUpdateBtnActiveList = useMemo(() => {
    return serveyItems.map((v, i) => v.label !== serveyItemsUpdated[i].label);
  }, [serveyItems, serveyItemsUpdated]);

  const onUpdateBtnActivate = useMemo(() => {
    return prompt !== '' && prompt !== prompts[currentTab].contents;
  }, [prompts, prompt, currentTab]);

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

  const onTabClicked = useCallback(
    (tab: number) => {
      setServeySelected(false);
      setReportSelected(false);
      setCurrentTab(tab);
      setPrompt(prompts[tab].contents);
    },
    [prompts],
  );

  const onPromptChanged = useCallback((newValue: string) => {
    setPrompt(newValue);
  }, []);

  const onServeyItemChanged = useCallback((index: number, value: string) => {
    setServeyItemsUpdated((prev) => {
      prev[index] = { label: value };
      return [...prev];
    });
  }, []);

  const onUpdateBtnClicked = useCallback(async () => {
    __backdropOn();

    if (currentTab === -1) {
      alert('선택된 프롬프트가 없습니다');
      __backdropOff();
      return;
    }

    await setDocDataToFirestore(
      FIRESTORE_COLLECTIONS.prompts,
      prompts[currentTab].id,
      {
        contents: prompt,
      },
    );

    alert('변경되었습니다');

    __backdropOff();
  }, [currentTab, prompt, prompts, __backdropOn, __backdropOff]);

  const onReportTabClicked = useCallback(() => {
    setReportSelected(true);
    setServeySelected(false);
    setCurrentTab(-1);
  }, []);

  const onSelectTabClicked = useCallback(() => {
    setServeySelected(true);
    setReportSelected(false);
    setCurrentTab(-1);
  }, []);

  const onServeyItemAddBtnClicked = useCallback(async () => {
    __backdropOn();

    await setDocDataToFirestore(
      FIRESTORE_COLLECTIONS.serveyTestProblem,
      serveyItems.length + 1 + '',
      {
        label: '설문지 문항 내용을 입력해주세요',
      } satisfies FireStoreServeyItemType,
    );

    __backdropOff();
  }, [serveyItems, __backdropOn, __backdropOff]);

  const onServeyItemUpdateClicked = useCallback(
    async (index: number) => {
      __backdropOn();

      await setDocDataToFirestore(
        FIRESTORE_COLLECTIONS.serveyTestProblem,
        index + 1 + '',
        {
          label: serveyItemsUpdated[index].label,
        } satisfies FireStoreServeyItemType,
      );

      alert('변경되었습니다');

      __backdropOff();
    },
    [serveyItemsUpdated, __backdropOn, __backdropOff],
  );

  const onReplyChanged = useCallback((index: number, content: string) => {
    setReplys((prev) => {
      prev[index] = content;
      return [...prev];
    });
  }, []);

  const onReplySaveBtnClicked = useCallback(
    async (index: number) => {
      __backdropOn();

      await setDocDataToFirestore(
        FIRESTORE_COLLECTIONS.reports,
        reports[index].id,
        {
          reply: replys[index],
        } satisfies Partial<FirestoreReportType>,
      );

      alert('답변이 저장되었습니다');

      __backdropOff();
    },
    [reports, replys, __backdropOn, __backdropOff],
  );

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  useEffect(() => {
    const unscriber = getOnSnapShotCollectionFromFireStore(
      FIRESTORE_COLLECTIONS.prompts,
      (qs) => {
        setPrompts(qs.docs.map((d) => d.data()) as FireStorePromptType[]);
      },
    );

    return () => {
      unscriber.then((us) => us());
    };
  }, []);

  useEffect(() => {
    const unscriber = getOnSnapShotCollectionFromFireStore(
      FIRESTORE_COLLECTIONS.serveyTestProblem,
      (qs) => {
        setServeyItems(
          qs.docs.map((d) => d.data()) as FireStoreServeyItemType[],
        );
        setServeyItemsUpdated(
          qs.docs.map((d) => d.data()) as FireStoreServeyItemType[],
        );
      },
    );

    return () => {
      unscriber.then((us) => us());
    };
  }, []);

  useEffect(() => {
    const pUnscriber = getOnSnapShotCollectionFromFireStore(
      FIRESTORE_COLLECTIONS.reports,
      (qs) => {
        const reports = qs.docs.map((d) => d.data()) as FirestoreReportType[];
        setReports(reports);
        setReplys(reports.map((r) => r.reply ?? ''));
      },
    );

    return () => {
      pUnscriber.then((us) => us());
    };
  }, []);

  return prompts.length > 0 ? (
    <AdminMain
      admin={admin}
      currentTab={currentTab}
      prompts={prompts}
      onTabClicked={onTabClicked}
      onPromptChanged={onPromptChanged}
      onLogoutClicked={onLogoutClicked}
      onUpdateBtnActivate={onUpdateBtnActivate}
      onUpdateBtnClicked={onUpdateBtnClicked}
      serveySelected={serveySelected}
      onSelectTabClicked={onSelectTabClicked}
      serveyItems={serveyItems}
      onServeyItemChanged={onServeyItemChanged}
      onServeyItemAddBtnClicked={onServeyItemAddBtnClicked}
      onServeyItemUpdateClicked={onServeyItemUpdateClicked}
      serveyItemsUpdateBtnActiveList={serveyItemsUpdateBtnActiveList}
      onReportTabClicked={onReportTabClicked}
      reportSelected={reportSelected}
      reports={reports}
      onReplyChanged={onReplyChanged}
      onReplySaveBtnClicked={onReplySaveBtnClicked}
    />
  ) : null;
};

export default AdminMainContainer;
