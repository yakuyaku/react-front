// Comment types based on FastAPI backend

export interface Comment {
  id: number;
  post_id: number;
  parent_id?: number | null;
  author_id: number;
  content: string;
  depth: number;
  path?: string | null;
  order_num: number;
  created_at: string;
  updated_at?: string | null;
  is_deleted: boolean;
  author_username?: string | null;
  author_email?: string | null;
  children?: Comment[] | null;
}

export interface CommentTreeResponse {
  id: number;
  post_id: number;
  parent_id?: number | null;
  author_id: number;
  content: string;
  depth: number;
  created_at: string;
  updated_at?: string | null;
  is_deleted: boolean;
  author_username?: string | null;
  children: CommentTreeResponse[];
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  post_id: number;
}

export interface CommentTreeListResponse {
  comments: CommentTreeResponse[];
  total: number;
  post_id: number;
}

export interface CommentCreateRequest {
  content: string;
  parent_id?: number | null;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface CommentCreateResponse {
  id: number;
  post_id: number;
  parent_id?: number | null;
  content: string;
  depth: number;
  path?: string | null;
  author_id: number;
  created_at: string;
  message: string;
}

export interface CommentUpdateResponse {
  id: number;
  content: string;
  updated_at: string;
  message: string;
}

export interface CommentDeleteResponse {
  id: number;
  message: string;
}
