import * as functions from "firebase-functions";
import {FUNCTUONS_REGION} from "../../config/config";
import reportService from "./report.service";

export const AddReport = functions.region(FUNCTUONS_REGION).https.onCall(async (req) => {
  const {uid, day, content} = req as {uid: string; day: number; content: string};

  const searchRes = await reportService.getCollectionRef().where("uid", "==", uid).where("day", "==", day).where("content", "==", content).get();

  if (searchRes.docs.length > 0) {
    return {
      success: false,
      message: "이미 신고된 메세지 입니다",
    };
  }

  await reportService.addReport(uid, day, content);

  return {
    success: true,
    message: "Report Added",
  };
});
