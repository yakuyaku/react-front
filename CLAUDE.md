# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 + TypeScript frontend application that integrates with a FastAPI backend for user authentication and management.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios 1.13.2
- **Backend**: FastAPI (separate service)

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `app/api/` - Next.js API routes (proxy to FastAPI)
  - `app/login/` - Login page
  - `app/dashboard/` - Protected dashboard pages
- `components/` - React components organized by domain
- `contexts/` - React Context providers (e.g., AuthContext)
- `lib/` - Utility functions and API client
- `types/` - TypeScript type definitions

### API Integration Pattern

**Next.js as Proxy**:
All API calls go through Next.js API routes (`app/api/*/route.ts`) which proxy to FastAPI backend at `http://localhost:8000`. This avoids CORS issues and keeps backend URL hidden from client.

Example flow:
1. Client calls `/api/auth/login` (Next.js API route)
2. Next.js route forwards to `http://localhost:8000/api/auth/login`
3. Response (with JWT) returned to client
4. Client stores JWT in localStorage
5. Subsequent requests include JWT in Authorization header

**Authentication**:
- JWT tokens stored in localStorage
- AuthContext provides global auth state (user, token, login, logout)
- Protected routes check auth state and redirect to /login if unauthenticated
- Token sent as `Bearer {token}` in Authorization header

### TypeScript Configuration
- Path alias `@/*` maps to root directory
- Strict mode enabled
- ES2017 target
- JSX mode: react-jsx (React 19)

### Important Files
- `lib/auth.ts` - Token management utilities
- `contexts/AuthContext.tsx` - Global authentication state
- `app/api/auth/login/route.ts` - Login proxy endpoint
- `app/api/users/route.ts` - Users list proxy endpoint (admin only)

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Not used directly (proxied through Next.js API routes)
- `FASTAPI_BACKEND_URL` - Server-side only, defaults to http://localhost:8000

### Backend API Endpoints (FastAPI)
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user
- `GET /api/users/` - Get users list (admin only, paginated)
- See `api.txt` for full API documentation

### Styling Guidelines
- Use Tailwind CSS utility classes exclusively
- Dark mode support via `dark:` prefix
- Responsive design with mobile-first approach
- Use existing color palette: zinc/gray for neutrals
