import {CHATTING_CALLECTIONS} from "../chatting.interface";

export const resultsCollections = (uid: string) => `${CHATTING_CALLECTIONS}/${uid}/Results`;

export interface FireStoreResultsTypes {
  items: string[];
  createdAt: number;
}
