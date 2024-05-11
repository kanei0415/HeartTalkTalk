import * as admin from "firebase-admin";
import {FireStoreUserType, USER_COLLECTION_NAME} from "./user.interface";
import titlesService from "../chattings/titles/titles.service";
import resultsService from "../chattings/results/results.service";
import chattingItemsService from "../chattings/chatting-items/chatting.items.service";
import {FieldValue} from "firebase-admin/firestore";

class UserService {
  userCollectionRef = admin.firestore().collection(USER_COLLECTION_NAME);

  async findUserById(uid: string) {
    const docRef = this.userCollectionRef.doc(uid);

    const user = (await docRef.get()).data();

    if (user) {
      return user as FireStoreUserType;
    }

    return undefined;
  }

  getDocRefById(uid: string) {
    return this.userCollectionRef.doc(uid);
  }

  async addUser(uid: string, name: string, image: string, createdAt: number) {
    const userDocRef = this.getDocRefById(uid);

    const userData = (await userDocRef.get()).data();

    if (userData) {
      return {
        success: false,
        message: "Uset Data Already Exists",
      };
    }

    await userDocRef.set({
      name,
      uid,
      image,
      days: 0,
      config: "",
      createdAt,
      reservedDays: 5,
    } satisfies FireStoreUserType);

    const chattingItemsResult = await chattingItemsService.addNewChatting(uid, 1, createdAt);
    const resultResult = await resultsService.addNewResult(uid, 1, createdAt);
    const titleResult = await titlesService.addNewTitle(uid, 1, createdAt);

    if (!chattingItemsResult) {
      await userDocRef.delete();

      return {
        success: false,
        message: "Chatting Item Creation Failed",
      };
    }

    if (!resultResult) {
      await userDocRef.delete();

      return {
        success: false,
        message: "Result Item Creation Failed",
      };
    }

    if (!titleResult) {
      await userDocRef.delete();

      return {
        success: false,
        message: "Title Item Creation Failed",
      };
    }

    await userDocRef.set(
      {
        days: FieldValue.increment(1),
      },
      {merge: true},
    );

    return {
      success: true,
      message: "Chatting Is Successfully Created",
    };
  }
}

export default new UserService();
