import * as admin from "firebase-admin";
import {CHATTING_CALLECTIONS} from "./chatting.interface";

class ChattingService {
  chattingCollectionRef = admin.firestore().collection(CHATTING_CALLECTIONS);

  getDocRef(uid: string) {
    return this.chattingCollectionRef.doc(uid);
  }
}

export default new ChattingService();
