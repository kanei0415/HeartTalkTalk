import * as functions from "firebase-functions";
import {FUNCTUONS_REGION} from "../../config/config";
import {ServeyProblemItem} from "./servey-result.interface";
import serveyResultService from "./servey-result.service";
import openaiService from "../../lib/openai.service";

export const AddServeyResult = functions.region(FUNCTUONS_REGION).https.onCall(async (req) => {
  const {serveyResult, createdAt} = req as {
    serveyResult: ServeyProblemItem[];
    createdAt: number;
  };

  const indexes = await openaiService.getServeyResultIndexes(serveyResult);

  const id = await serveyResultService.addServeyResult(serveyResult, createdAt, indexes);

  return {
    success: true,
    message: id,
  };
});
