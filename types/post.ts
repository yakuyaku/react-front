export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at?: string | null;
  is_deleted: boolean;
  is_pinned: boolean;
  is_locked: boolean;
  author_username?: string | null;
  author_email?: string | null;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  is_pinned?: boolean;
}

export interface PostUpdateRequest {
  title?: string | null;
  content?: string | null;
  is_pinned?: boolean | null;
  is_locked?: boolean | null;
}

export interface PostCreateResponse {
  id: number;
  title: string;
  content: string;
  author_id: number;
  view_count: number;
  like_count: number;
  created_at: string;
  is_pinned: boolean;
  message: string;
}

export interface PostUpdateResponse {
  id: number;
  title: string;
  content: string;
  author_id: number;
  view_count: number;
  like_count: number;
  updated_at: string;
  is_pinned: boolean;
  is_locked: boolean;
  message: string;
}

export interface PostDeleteResponse {
  id: number;
  title: string;
  message: string;
}
