import * as admin from "firebase-admin";
import {PsychologicalIndexes, SERVEY_RESULTS_COLLECTION, ServeyProblemItem, ServeyResult} from "./servey-result.interface";
import openaiService from "../../lib/openai.service";

class ServeyResultService {
  getCollectionRef() {
    return admin.firestore().collection(SERVEY_RESULTS_COLLECTION);
  }

  getDocumentRef(id: string) {
    return this.getCollectionRef().doc(id);
  }

  async addServeyResult(serveyResult: ServeyProblemItem[], createdAt: number, psychologicalIndexes: PsychologicalIndexes) {
    const docRef = this.getCollectionRef().doc();

    const message = (await openaiService.getServeyResultMessage(serveyResult)).choices[0].message.content;

    await docRef.set({
      id: docRef.id,
      chattingItems: [
        {
          contents: message || "메세지 생성에 실패했습니다",
          sender: "SYSTEM",
        },
      ],
      serveyResult,
      createdAt,
      psychologicalIndexes,
    } satisfies ServeyResult);

    return docRef.id;
  }
}

export default new ServeyResultService();
