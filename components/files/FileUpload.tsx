'use client';

import React, { useState, useRef } from 'react';
import { FileUploadResponse } from '@/types/file';
import { getToken } from '@/lib/auth';
import Button from '@/components/ui/Button';

interface FileUploadProps {
  onUploadSuccess?: (files: FileUploadResponse[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  isPublic?: boolean;
  isTemp?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  multiple = true,
  isPublic = true,
  isTemp = true,
  accept,
  maxSizeMB = 10,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = getToken();
    if (!token) {
      onUploadError?.('로그인이 필요합니다');
      return;
    }

    setUploading(true);
    const uploadedFilesList: FileUploadResponse[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`${file.name}의 크기가 ${maxSizeMB}MB를 초과합니다`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('is_public', isPublic.toString());
        formData.append('is_temp', isTemp.toString());

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || '파일 업로드 실패');
        }

        const data: FileUploadResponse = await response.json();
        uploadedFilesList.push(data);
      }

      setUploadedFiles((prev) => [...prev, ...uploadedFilesList]);
      onUploadSuccess?.(uploadedFilesList);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '파일 업로드 중 오류 발생';
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="secondary"
        >
          {uploading ? '업로드 중...' : '파일 선택'}
        </Button>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          최대 {maxSizeMB}MB
        </span>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            업로드된 파일 ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.id}-${index}`}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {file.original_filename}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {formatFileSize(file.file_size)} • {file.mime_type}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="ml-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { FileUpload };
