import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  getDocs,
  query,
  collection,
  QuerySnapshot,
} from 'firebase/firestore';
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSEGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MESUREMENT_ID,
};

export const FUNCTUONS_REGION = 'asia-northeast3';

const app = initializeApp(firebaseConfig);

getAnalytics(app);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, FUNCTUONS_REGION);

if (process.env.NODE_ENV === 'development')
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

export const FUNCTION_LIST = {
  newChattingCreate: 'NewChattingCreate',
  chattingResponseAdd: 'ChattingResponseAdd',
  initializeCreatedUser: 'InitializeCreatedUser',
  deleteUserData: 'DeleteUserData',
} as const;

export const PROMPTS = {
  counselStartMessagePrompt: 'COUNSEL_START_MESSAGE_PROMPT',
  resultMessagePrompt: 'RESULT_MESSAGE_PROMPT',
  titleMessagePrompt: 'TITLE_MESSAGE_PROMPT',
  responseMessagePrompt: 'RESPONSE_MESSAGE_PROMPT',
} as const;

export const newChattingCreateFunction = httpsCallable<
  { uid: string; createdAt: number },
  { success: boolean; message: string }
>(functions, FUNCTION_LIST.newChattingCreate);

export const chattingResponseAdd = httpsCallable<
  { uid: string; day: number },
  { success: boolean; message: string }
>(functions, FUNCTION_LIST.chattingResponseAdd);

export const initializeCreatedUser = httpsCallable<
  { uid: string; name: string; image: string | null; createdAt: number },
  { success: boolean; message: string }
>(functions, FUNCTION_LIST.initializeCreatedUser);

export const deleteUserData = httpsCallable<{ uid: string }, null>(
  functions,
  FUNCTION_LIST.deleteUserData,
);

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signup(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function googleLogin() {
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  return [result, credential] as const;
}

export const FIRESTORE_COLLECTIONS = {
  admin: 'Admins',
  serveyTestProblem: 'ServeyTestProblems',
  user: 'Users',
  prompts: 'Prompts',
  chatting: 'Chattings',
  chattings: {
    chattingItem: 'ChattingItems',
    results: 'Results',
    title: 'Titles',
  },
} as const;

export type FireStoreAdminType = {
  name: string;
  uid: string;
  image: string;
};

export type FireStoreUserType = {
  name: string;
  uid: string;
  image: string | null;
  days: number;
  createdAt: number;
};

export type FireStorePromptType = {
  contents: string;
};

export type FireStoreChattingItemsType = {
  items: FireStoreChattingItemType[];
  createdAt: number;
};

export type FireStoreResultsType = {
  items: string[];
  createdAt: number;
};

export type FireStoreTitlesType = {
  label: string;
  createdAt: number;
};

export type FireStoreChattingItemType = {
  contents: string;
  sender: 'SYSTEM' | 'USER';
};

export async function getDocDataFromFirestore(
  collection: string,
  path: string,
) {
  const docRef = doc(firestore, collection, path);

  const docSnapshot = await getDoc(docRef);

  return { ...docSnapshot.data() };
}

export function getDocRefFromFirestore(collection: string, path: string) {
  return doc(firestore, collection, path);
}

export async function getAllDocDataFromFireStore(path: string) {
  const qs = await getDocs(query(collection(firestore, path)));

  return qs.docs.map((d) => d.data());
}

export async function getOnSnapshotFromFirestore(
  collection: string,
  path: string,
  onSnapshotHandler: (
    snapshot: DocumentSnapshot<
      DocumentData,
      {
        [x: string]: any;
      }
    >,
  ) => void,
) {
  return onSnapshot(doc(firestore, collection, path), onSnapshotHandler);
}

export async function getOnSnapShotCollectionFromFireStore(
  collectionPath: string,
  handler: (qs: QuerySnapshot) => void,
) {
  return onSnapshot(query(collection(firestore, collectionPath)), handler);
}

export async function setDocDataToFirestore(
  collection: string,
  path: string,
  data: Object,
) {
  const docRef = doc(firestore, collection, path);

  return setDoc(docRef, data);
}

export async function addChattingItem(
  uid: string,
  k: number,
  data: FireStoreChattingItemType[],
) {
  const docRef = doc(
    firestore,
    `${FIRESTORE_COLLECTIONS.chatting}/${uid}/${FIRESTORE_COLLECTIONS.chattings.chattingItem}`,
    k + '',
  );

  return setDoc(
    docRef,
    {
      items: data,
    },
    { merge: true },
  );
}

export async function uploadFileToStorage(name: string, image: File | null) {
  if (!image) return null;

  const storageRef = ref(storage, `images/${name}`);

  const result = await uploadBytes(storageRef, image);

  return getDownloadURL(result.ref);
}
