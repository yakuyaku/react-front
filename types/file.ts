export interface FileUploadResponse {
  id: number;
  original_filename: string;
  stored_filename: string;
  file_size: number;
  mime_type: string;
  file_extension: string | null;
  created_at: string;
  is_temp: boolean;
  message: string;
}

export interface FileResponse {
  id: number;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_extension: string | null;
  uploader_id: number;
  upload_ip: string | null;
  download_count: number;
  created_at: string;
  is_deleted: boolean;
  is_public: boolean;
  uploader_username: string | null;
  uploader_email: string | null;
}

export interface PostAttachmentResponse {
  id: number;
  post_id: number;
  file_id: number;
  display_order: number;
  is_thumbnail: boolean;
  created_at: string;
  file: FileResponse | null;
}

export interface AttachFilesRequest {
  file_ids: number[];
}

export interface AttachFilesResponse {
  post_id: number;
  attached_count: number;
  attachments: PostAttachmentResponse[];
  message: string;
}
