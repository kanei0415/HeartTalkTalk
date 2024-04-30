import {CHATTING_CALLECTIONS} from "../chatting.interface";

export const CHATTING_ITEM_COLLECTIONS = "ChattingItems";

export const chattingCollections = (uid: string) => `${CHATTING_CALLECTIONS}/${uid}/${CHATTING_ITEM_COLLECTIONS}`;

export interface FireStoreChattingItemType {
  contents: string;
  sender: "SYSTEM" | "USER";
}

export interface FireStoreChattingItemsType {
  items: FireStoreChattingItemType[];
  createdAt: number;
}

export const CHATTING_ITEMS_MAKE_RESULT_UNIT = 3;
