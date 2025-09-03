// src/types/Api.ts
export interface BulkUploadResponse {
  successCount: number;
  errorCount: number;
  errors: string[];
}
