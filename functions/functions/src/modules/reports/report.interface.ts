export const REPORT_COLLECTION = "Reports";

export interface FirestoreReportType {
  content: string;
  id: string;
  day: number;
  uid: string;
  reply?: string;
}
