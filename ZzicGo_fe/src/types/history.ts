export interface CreateHistoryRequest {
  imageUrls: string[];
  content: string;
  visibility: "PUBLIC" | "PRIVATE";
}