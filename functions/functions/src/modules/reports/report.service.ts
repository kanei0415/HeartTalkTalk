import * as admin from "firebase-admin";
import {REPORT_COLLECTION} from "./report.interface";
import usersService from "../users/users.service";
import {FieldValue} from "firebase-admin/firestore";

class ReportService {
  getCollectionRef() {
    return admin.firestore().collection(REPORT_COLLECTION);
  }

  getDocRef(id: string) {
    return this.getCollectionRef().doc(id);
  }

  async addReport(uid: string, day: number, content: string) {
    const docRef = this.getCollectionRef().doc();

    const user = usersService.getDocRefById(uid);

    await user.set(
      {
        reports: FieldValue.arrayUnion(docRef.id),
      },
      {merge: true},
    );

    return docRef.set({
      uid,
      day,
      content,
      id: docRef.id,
    });
  }
}

export default new ReportService();
