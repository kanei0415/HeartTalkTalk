import {CHATTING_CALLECTIONS} from "../chatting.interface";

export const titleCollections = (uid: string) => `${CHATTING_CALLECTIONS}/${uid}/Titles`;

export interface FireStoreTitleType {
  createdAt: number;
  label: string;
}
