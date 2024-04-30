import * as admin from "firebase-admin";
import {PROMPT_COLLECTIONS, PromptType} from "./prompts.interface";

class PromptsService {
  getCollectionRef() {
    return admin.firestore().collection(PROMPT_COLLECTIONS);
  }

  getDocRef(promptType: PromptType) {
    return this.getCollectionRef().doc(promptType);
  }

  async getDocData(promptType: PromptType) {
    return (await this.getDocRef(promptType).get()).data();
  }
}

export default new PromptsService();
