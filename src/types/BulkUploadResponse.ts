export interface BulkUploadResponse {
  success: boolean;
  data: {
    message: string;
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    errors: Array<{
      index?: number;      
      product?: string;    
      error: string;
    }>;
  };
}
