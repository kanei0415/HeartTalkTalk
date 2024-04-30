import * as admin from "firebase-admin";
import {FireStoreChattingItemsType, chattingCollections} from "./chatting.items.interface";
import openaiService from "../../../lib/openai.service";

class ChattingItemsService {
  getRef(uid: string) {
    return admin.firestore().collection(chattingCollections(uid));
  }

  getDocRef(uid: string, day: number) {
    const collectionRef = this.getRef(uid);

    return collectionRef.doc(day + "");
  }

  async getChattingItemsDocData(uid: string, day: number) {
    return (await this.getDocRef(uid, day).get()).data();
  }

  async addNewChatting(uid: string, day: number, createdAt: number) {
    const chattingRef = this.getRef(uid);

    const completion = await openaiService.getStartMessage(uid);

    if (!completion) {
      return;
    }

    return chattingRef.doc(`${day}`).set({
      items: [
        {
          sender: "SYSTEM",
          contents: completion.choices[0].message.content || "메세지 생성에 실패했습니다",
        },
      ],
      createdAt,
    } satisfies FireStoreChattingItemsType);
  }
}

export default new ChattingItemsService();
