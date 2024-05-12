import {FireStoreChattingItemType} from "../chattings/chatting-items/chatting.items.interface";

export const SERVEY_RESULTS_COLLECTION = "ServeyResults";

export interface ServeyProblemItem {
  question: string;
  answer: string;
}

export interface ServeyResult {
  id: string;
  chattingItems: FireStoreChattingItemType[];
  serveyResult: ServeyProblemItem[];
  createdAt: number;
}
