import { User } from './auth';

export interface UserResponse extends User {
  author_username?: string | null;
  author_email?: string | null;
}

export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
