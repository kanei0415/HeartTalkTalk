import * as functions from "firebase-functions";
import {FUNCTUONS_REGION} from "../../config/config";
import usersService from "./users.service";
import chattingService from "../chattings/chatting.service";
import {FieldValue} from "firebase-admin/firestore";
import {UserRecord} from "firebase-admin/auth";
import * as admin from "firebase-admin";

export const InitializeCreatedUser = functions.region(FUNCTUONS_REGION).https.onCall(async (data) => {
  const {uid, name, image, createdAt, id} = data as {uid: string; name: string; image: string; createdAt: number; id?: string};

  return usersService.addUser(uid, name, image, createdAt, id);
});

export const DeleteUserData = functions
  .region(FUNCTUONS_REGION)
  .auth.user()
  .onDelete(async (user: UserRecord) => {
    const {uid} = user;

    admin.storage().bucket().file(`image/${uid}.jpeg`).delete();

    await usersService.getDocRefById(uid).delete();

    await chattingService.getDocRef(uid).delete();
  });

export const UserPurchased = functions.region(FUNCTUONS_REGION).https.onCall(async (data) => {
  const {uid} = data as {uid: string};

  return usersService.getDocRefById(uid).set({reservedDays: FieldValue.increment(30)}, {merge: true});
});
