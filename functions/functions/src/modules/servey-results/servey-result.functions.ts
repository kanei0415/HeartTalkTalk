import * as functions from "firebase-functions";
import {FUNCTUONS_REGION} from "../../config/config";
import {ServeyProblemItem} from "./servey-result.interface";
import serveyResultService from "./servey-result.service";

export const AddServeyResult = functions.region(FUNCTUONS_REGION).https.onCall(async (req) => {
  const {serveyResult, createdAt} = req as {
    serveyResult: ServeyProblemItem[];
    createdAt: number;
  };

  const id = await serveyResultService.addServeyResult(serveyResult, createdAt);

  return {
    success: true,
    message: id,
  };
});
