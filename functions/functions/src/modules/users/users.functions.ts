import * as functionsV2 from "firebase-functions/v2";
import {CORS_POLICY, FUNCTUONS_REGION} from "../../config/config";
import usersService from "./users.service";

export const InitializeCreatedUser = functionsV2.https.onCall(
  {
    cors: CORS_POLICY,
    region: FUNCTUONS_REGION,
    timeoutSeconds: 120,
  },
  async (req) => {
    const {uid, name, image, createdAt} = req.data as {uid: string; name: string; image: string; createdAt: number};

    return usersService.addUser(uid, name, image, createdAt);
  },
);
