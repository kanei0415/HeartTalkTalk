import * as admin from "firebase-admin";
import {FireStoreTitleType, titleCollections} from "./titles.interface";

class TitlesService {
  getTitleCollectionRef(uid: string) {
    return admin.firestore().collection(titleCollections(uid));
  }

  getTitleDocRef(uid: string, day: number) {
    return this.getTitleCollectionRef(uid).doc(day + "");
  }

  async getTitleDocData(uid: string, day: number) {
    return (await this.getTitleDocRef(uid, day).get()).data();
  }

  async addNewTitle(uid: string, day: number, createdAt: number) {
    const newDocRef = this.getTitleDocRef(uid, day);

    return newDocRef.set({
      createdAt,
      label: `${day}일째 상담`,
    } satisfies FireStoreTitleType);
  }
}

export default new TitlesService();
