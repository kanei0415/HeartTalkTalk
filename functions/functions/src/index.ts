import * as admin from "firebase-admin";

admin.initializeApp();

export * from "./modules/chattings/chatting.functions";
export * from "./modules/chattings/chatting-items/chatting.items.functions";
export * from "./modules/users/users.functions";
export * from "./modules/servey-results/servey-result.functions";
