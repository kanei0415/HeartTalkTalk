import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
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
  userPurchased: 'UserPurchased',
  addServeyResult: 'AddServeyResult',
  addReport: 'AddReport',
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
  {
    uid: string;
    name: string;
    image: string | null;
    createdAt: number;
    id?: string;
  },
  { success: boolean; message: string }
>(functions, FUNCTION_LIST.initializeCreatedUser);

export const userPurchased = httpsCallable<{ uid: string }, null>(
  functions,
  FUNCTION_LIST.userPurchased,
);

export const addServeyResult = httpsCallable<
  { serveyResult: ServeyProblemItem[]; createdAt: number },
  { success: boolean; message: string }
>(functions, FUNCTION_LIST.addServeyResult);

export const addReport = httpsCallable<
  { uid: string; day: number; content: string },
  { success: boolean; message: string }
>(functions, FUNCTION_LIST.addReport);

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signup(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function deleteCurrentUser() {
  return auth.currentUser ? deleteUser(auth.currentUser) : null;
}

export async function googleLogin() {
  const uc = await signInWithPopup(auth, provider);
  GoogleAuthProvider.credentialFromResult(uc);
  return uc;
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
  serveyResults: 'ServeyResults',
  reports: 'Reports',
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
  reservedDays: number;
  createdAt: number;
};

export type FireStorePromptType = {
  contents: string;
  id: string;
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

export type FireStoreServeyItemType = {
  label: string;
};

export type FireStoreChattingItemType = {
  contents: string;
  sender: 'SYSTEM' | 'USER';
};

export type ServeyProblemItem = {
  question: string;
  answer: string;
};

export type ServeyResult = {
  id: string;
  chattingItems: FireStoreChattingItemType[];
  serveyResult: ServeyProblemItem[];
  createdAt: number;
};

export interface FirestoreReportType {
  content: string;
  id: string;
  day: number;
  uid: string;
  reply?: string;
}

export async function getDocDataFromFirestore(
  collection: string,
  path: string,
) {
  const docRef = doc(firestore, collection, path);

  const docSnapshot = await getDoc(docRef);

  return docSnapshot.data();
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

  return setDoc(docRef, data, { merge: true });
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

  const storageRef = ref(storage, `images/${name}jpeg`);

  const result = await uploadBytes(storageRef, image, {
    contentType: 'image/jpeg',
  });

  return getDownloadURL(result.ref);
}
