// types/context.ts
export interface PDFFile {
  id: string;
  filename: string;
  upload_date: string;
  size: number;
  processed: boolean;
}

export interface VectorstoreInfo {
  exists: boolean;
  document_count: number;
  size: number;
}

export interface UploadResponse {
  message: string;
  pdf_id: string;
  filename: string;
}
