export const USER_COLLECTION_NAME = "Users";

export interface FireStoreUserType {
  name: string;
  uid: string;
  image: string;
  days: number;
  config: string;
  createdAt: number;
}
