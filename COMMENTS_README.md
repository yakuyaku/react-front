# Comments Feature Documentation

## Overview

Hierarchical comments system with support for nested replies (up to 4 levels: depth 0-3). Supports both flat and tree view modes.

## Features

### Core Functionality
- ✅ Create top-level comments on posts
- ✅ Reply to comments (nested up to depth 3)
- ✅ Edit own comments (or all comments as admin)
- ✅ Delete comments (soft delete by default)
- ✅ Tree structure with path-based ordering
- ✅ Toggle between flat and tree view modes
- ✅ Author information display
- ✅ Timestamp with edited indicator
- ✅ Visual depth indicators with color coding

### Permissions
- **Anyone**: View comments (both flat and tree)
- **Logged-in users**: Create, reply, edit own comments, delete own comments
- **Admins**: Edit and delete any comment, restore deleted comments, hard delete

## File Structure

```
app/
├── api/
│   └── comments/
│       ├── [commentId]/
│       │   ├── route.ts          # GET, PUT, PATCH, DELETE single comment
│       │   └── restore/
│       │       └── route.ts      # PATCH restore (admin)
│       └── posts/
│           └── [postId]/
│               ├── route.ts      # POST create comment
│               ├── flat/
│               │   └── route.ts  # GET flat list
│               └── tree/
│                   └── route.ts  # GET tree list
└── dashboard/
    ├── comments/
    │   └── page.tsx              # Standalone test page
    └── posts/
        └── [id]/
            └── page.tsx          # Post detail with comments

components/
└── comments/
    ├── CommentList.tsx           # Main container with view toggle
    ├── CommentItem.tsx           # Individual comment display (recursive)
    ├── CommentForm.tsx           # Form for create/edit
    └── index.ts                  # Exports

types/
└── comment.ts                    # TypeScript interfaces
```

## API Endpoints

### Create Comment
**POST** `/api/comments/posts/{postId}`
```json
{
  "content": "Comment text (1-1000 chars)",
  "parent_id": 123  // Optional, for replies
}
```

### Get Comments (Flat)
**GET** `/api/comments/posts/{postId}/flat?include_deleted=false`

Returns flat list sorted by path.

### Get Comments (Tree)
**GET** `/api/comments/posts/{postId}/tree?include_deleted=false`

Returns hierarchical tree with `children` arrays.

### Get Single Comment
**GET** `/api/comments/{commentId}`

### Update Comment
**PUT/PATCH** `/api/comments/{commentId}`
```json
{
  "content": "Updated text"
}
```

### Delete Comment
**DELETE** `/api/comments/{commentId}?hard_delete=false`

- Soft delete (default): Sets `is_deleted=true`, content = "삭제된 댓글입니다"
- Hard delete (admin): Permanently removes (CASCADE to children)

### Restore Comment (Admin)
**PATCH** `/api/comments/{commentId}/restore`

## Component Usage

### CommentList
Main container component with view mode toggle.

```tsx
import { CommentList } from '@/components/comments';

<CommentList
  postId={123}
  currentUserId={user?.id}
  isAdmin={user?.is_admin || false}
/>
```

**Props:**
- `postId`: Post ID to fetch comments for
- `currentUserId`: Current user's ID (for ownership checks)
- `isAdmin`: Whether current user is admin

**Features:**
- Fetches comments based on view mode (flat/tree)
- View mode toggle buttons
- New comment form (if logged in)
- Automatic refresh after create/edit/delete

### CommentItem
Displays individual comment with actions.

```tsx
import { CommentItem } from '@/components/comments';

<CommentItem
  comment={commentData}
  isTree={true}
  onReply={handleReply}
  onEdit={handleEdit}
  onDelete={handleDelete}
  currentUserId={userId}
  isAdmin={false}
/>
```

**Props:**
- `comment`: Comment or CommentTreeResponse object
- `isTree`: Whether to render children recursively
- `onReply`: Async handler for replying
- `onEdit`: Async handler for editing
- `onDelete`: Async handler for deleting
- `currentUserId`: Current user's ID
- `isAdmin`: Admin flag

**Features:**
- Color-coded depth indicators (blue → green → purple → orange)
- Inline reply form (depth limit: 3)
- Inline edit form
- Author and timestamp display
- "edited" indicator if updated
- Reply/Edit/Delete buttons based on permissions
- Recursive rendering of children (tree mode)

### CommentForm
Reusable form for creating/editing comments.

```tsx
import { CommentForm } from '@/components/comments';

<CommentForm
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  initialValue="Pre-filled text"
  placeholder="Write a comment..."
  submitLabel="Post Comment"
  showCancel={true}
/>
```

**Props:**
- `onSubmit`: Async handler receiving content string
- `onCancel`: Optional cancel handler
- `initialValue`: Pre-fill content (for editing)
- `placeholder`: Input placeholder text
- `submitLabel`: Submit button label
- `showCancel`: Show cancel button (default: true)

**Features:**
- Character counter (0/1000)
- Validation (required, max 1000 chars)
- Error display
- Loading state
- Auto-clear on success

## Hierarchical Structure

### Depth Levels
- **Depth 0**: Top-level comments (no parent)
- **Depth 1**: Direct replies to top-level
- **Depth 2**: Replies to depth 1
- **Depth 3**: Maximum depth (replies to depth 2)

### Path System
Comments use a materialized path for ordering:
- Format: `001.002.003` (padded integers)
- Sorted lexicographically for correct tree order
- Maintains position when fetching flat or tree structure

## Styling

### Color Scheme
- **Depth 0**: Blue left border (`border-l-blue-500`)
- **Depth 1**: Green left border (`border-l-green-500`)
- **Depth 2**: Purple left border (`border-l-purple-500`)
- **Depth 3**: Orange left border (`border-l-orange-500`)

### Spacing
- Top-level: No left margin
- Each depth level: +2rem left margin (`ml-8`)
- Reply forms: Additional left padding with border

### Dark Mode
Full dark mode support using Tailwind's `dark:` variants.

## Testing

### Standalone Test Page
Navigate to `/dashboard/comments` for isolated testing.

**Features:**
- Post ID selector input
- Current user info display
- Full CommentList with all functionality
- Login status warning

### Integrated Testing
Comments are displayed on each post detail page at `/dashboard/posts/{id}`.

## Common Patterns

### Create Top-Level Comment
```tsx
const handleCreate = async (content: string) => {
  const token = getAuthToken();
  const response = await fetch(`/api/comments/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  // Handle response
};
```

### Create Reply
```tsx
const handleReply = async (parentId: number, content: string) => {
  const token = getAuthToken();
  const response = await fetch(`/api/comments/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content, parent_id: parentId }),
  });
  // Handle response
};
```

### Edit Comment
```tsx
const handleEdit = async (commentId: number, content: string) => {
  const token = getAuthToken();
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  // Handle response
};
```

### Delete Comment
```tsx
const handleDelete = async (commentId: number) => {
  const token = getAuthToken();
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // Handle response
};
```

## Backend Integration

### FastAPI Backend URL
Default: `http://localhost:8000`

Set via environment variable:
```env
FASTAPI_BACKEND_URL=http://localhost:8000
```

### API Versioning
Backend uses `/api/v1/comments/*` prefix.
Frontend proxies remove version prefix: `/api/comments/*`.

## Limitations

- Maximum depth: 3 (0, 1, 2, 3)
- Content length: 1-1000 characters
- No pagination (loads all comments)
- No real-time updates (manual refresh required)
- No like/vote system
- No comment search/filter in UI

## Future Enhancements

- [ ] Pagination for large comment threads
- [ ] Real-time updates (WebSocket/SSE)
- [ ] Comment reactions (like/dislike)
- [ ] Rich text editing
- [ ] Comment search and filtering
- [ ] Sorting options (newest/oldest/most liked)
- [ ] Notification system
- [ ] Mention system (@username)
- [ ] Comment threading UI improvements
- [ ] Keyboard navigation
- [ ] Accessibility improvements (ARIA labels)
