import * as admin from "firebase-admin";
import {FireStoreResultsTypes, resultsCollections} from "./results.interface";
import {FieldValue} from "firebase-admin/firestore";

class ResultsService {
  getResultCollectionRef(uid: string) {
    return admin.firestore().collection(resultsCollections(uid));
  }

  getResultDocRef(uid: string, day: number) {
    return this.getResultCollectionRef(uid).doc(day + "");
  }

  async getResultDocData(uid: string, day: number) {
    return (await this.getResultDocRef(uid, day).get()).data();
  }

  async appendResultItem(uid: string, day: number, item: string) {
    const docRef = this.getResultDocRef(uid, day);

    docRef.set({
      items: FieldValue.arrayUnion(item),
    });
  }

  async addNewResult(uid: string, day: number, createdAt: number) {
    const newDocRef = this.getResultDocRef(uid, day);

    return newDocRef.set({
      createdAt,
      items: [],
    } satisfies FireStoreResultsTypes);
  }
}

export default new ResultsService();
