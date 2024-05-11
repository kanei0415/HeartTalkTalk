import * as functions from "firebase-functions";
import usersService from "../users/users.service";
import {FieldValue} from "firebase-admin/firestore";
import chattingItemsService from "./chatting-items/chatting.items.service";
import {FireStoreUserType} from "../users/user.interface";
import resultsService from "./results/results.service";
import titlesService from "./titles/titles.service";
import {FUNCTUONS_REGION} from "../../config/config";

export const NewChattingCreate = functions.region(FUNCTUONS_REGION).https.onCall(async (req) => {
  const {uid, createdAt} = req as {uid: string; createdAt: number};

  const userDocRef = usersService.getDocRefById(uid);

  const user = (await userDocRef.get()).data() as FireStoreUserType;

  if (!user) {
    return {
      success: false,
      message: "No Such User uid: " + uid,
    };
  }

  if (user.days === user.reservedDays) {
    return {
      success: false,
      message: "User Do Not Have Left Days: " + uid,
    };
  }

  if (!createdAt) {
    return {
      success: false,
      message: "No CreatedAt Exist",
    };
  }

  const chattingItemsResult = await chattingItemsService.addNewChatting(user.uid, user.days + 1, createdAt);
  const resultResult = await resultsService.addNewResult(user.uid, user.days + 1, createdAt);
  const titleResult = await titlesService.addNewTitle(user.uid, user.days + 1, createdAt);

  if (!chattingItemsResult) {
    return {
      success: false,
      message: "Chatting Item Creation Failed",
    };
  }

  if (!resultResult) {
    return {
      success: false,
      message: "Result Item Creation Failed",
    };
  }

  if (!titleResult) {
    return {
      success: false,
      message: "Title Item Creation Failed",
    };
  }

  userDocRef.set(
    {
      days: FieldValue.increment(1),
    },
    {merge: true},
  );

  return {
    success: true,
    message: "Chatting Is Successfully Created",
  };
});
