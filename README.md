# React Front - 사용자 및 게시글 관리 시스템

Next.js 16 + TypeScript 기반의 FastAPI 백엔드 연동 프론트엔드 애플리케이션입니다.

## 주요 기능

### 🔐 인증 시스템
- JWT 기반 로그인/로그아웃
- 데모 관리자 계정 원클릭 로그인
- 보호된 라우트 (인증 필요)
- AuthContext를 통한 전역 인증 상태 관리

### 👥 사용자 관리
- 사용자 목록 조회 (페이지네이션)
- 사용자 상세 정보
- 관리자 권한 관리
- 활성/비활성 상태 관리

### 📝 게시글 관리
- 게시글 CRUD (생성, 조회, 수정, 삭제)
- 페이지네이션 및 정렬
- 조회수 및 좋아요 수 표시
- 게시글 고정 (관리자)
- 게시글 잠금 (관리자)
- Soft Delete 지원

### 🎨 UI/UX
- 다크 모드 지원
- 반응형 디자인
- Tailwind CSS v4
- 직관적인 네비게이션

## 시작하기

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 데모 계정

로그인 페이지에서 "Demo Admin Login" 버튼을 클릭하거나 아래 계정 정보를 입력하세요:

- **이메일**: `admin@example.com`
- **비밀번호**: `admin12312`

## 기술 스택

- **프레임워크**: Next.js 16.0.4 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS v4
- **HTTP 클라이언트**: Axios 1.13.2
- **백엔드**: FastAPI (별도 서비스)
- **런타임**: Node.js 20+

## 프로젝트 구조

```
react-front/
├── app/                      # Next.js App Router
│   ├── api/                  # API 프록시 라우트
│   │   ├── auth/            # 인증 API
│   │   ├── users/           # 사용자 API
│   │   └── posts/           # 게시글 API
│   ├── dashboard/           # 대시보드 페이지
│   │   ├── users/           # 사용자 관리
│   │   └── posts/           # 게시글 관리
│   └── login/               # 로그인 페이지
├── components/              # React 컴포넌트
│   ├── auth/               # 인증 관련
│   ├── users/              # 사용자 관련
│   ├── posts/              # 게시글 관련
│   └── ui/                 # 공통 UI 컴포넌트
├── contexts/               # React Context
│   └── AuthContext.tsx     # 인증 상태 관리
├── lib/                    # 유틸리티 함수
├── types/                  # TypeScript 타입 정의
└── public/                 # 정적 파일
```

## 개발 가이드

### API 프록시 패턴

모든 API 호출은 Next.js API 라우트를 통해 FastAPI 백엔드로 프록시됩니다:

1. 클라이언트 → `/api/auth/login` (Next.js API 라우트)
2. Next.js → `http://localhost:8000/api/auth/login` (FastAPI)
3. 응답 (JWT 포함) → 클라이언트
4. JWT를 localStorage에 저장
5. 이후 요청에 `Bearer {token}` 포함

### 환경 변수

프로젝트는 두 개의 환경 파일을 포함합니다:

- `.env.local` - 로컬 개발용 (`http://localhost:8000`)
- `.env.production` - 프로덕션 배포용 (`https://fastapi-basic-production.up.railway.app`)

### 빌드 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

## 더 알아보기

Next.js에 대해 더 알아보려면 다음 리소스를 참고하세요:

- [Next.js 문서](https://nextjs.org/docs)
- [Next.js 학습하기](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

## Docker 지원

이 프로젝트는 컨테이너화된 배포를 위한 Docker를 지원합니다.

### Docker 이미지 빌드

```bash
docker build -t react-front .
```

### Docker 컨테이너 실행

```bash
docker run -p 3000:3000 react-front
```

애플리케이션은 [http://localhost:3000](http://localhost:3000)에서 접근 가능합니다.

### 환경 변수 오버라이드

Docker 로컬 실행 시 백엔드 URL을 오버라이드하려면:

```bash
docker run -p 3000:3000 -e FASTAPI_BACKEND_URL=http://your-backend:8000 react-front
```

## Railway 배포

이 프로젝트는 [Railway](https://railway.app) 배포용으로 구성되어 있습니다.

### 배포 단계

1. Git 저장소에 코드를 푸시 (GitHub, GitLab, 또는 Bitbucket)
2. [Railway](https://railway.app)에 로그인
3. "New Project" → "Deploy from GitHub repo" 클릭
4. 저장소 선택
5. Railway가 자동으로 Dockerfile을 감지하고 애플리케이션을 빌드합니다
6. 애플리케이션은 다음 백엔드에 미리 연결되어 있습니다:
   - **백엔드 API**: `https://fastapi-basic-production.up.railway.app`
7. Railway가 제공하는 URL로 애플리케이션에 접근할 수 있습니다

**참고**: 프로덕션 백엔드 URL은 Dockerfile에 이미 구성되어 있습니다. 변경이 필요한 경우 Railway 대시보드에서 `FASTAPI_BACKEND_URL` 환경 변수를 수정하거나 Dockerfile을 수정하세요.

### Railway 구성

프로젝트는 다음을 구성하는 `railway.toml` 파일을 포함합니다:
- Dockerfile 기반 빌드
- 실패 시 자동 재시작
- 포트 3000 노출

### Railway 배포 시 주의사항

- FastAPI 백엔드가 이미 배포되어 있음: `https://fastapi-basic-production.up.railway.app`
- 프론트엔드가 이 백엔드에 자동으로 연결되도록 미리 구성됨
- Railway가 자동으로 HTTPS를 처리하고 프론트엔드용 공개 URL을 제공
- Railway 대시보드에서 배포 로그를 모니터링하세요
- 전체 기능을 위해 프론트엔드와 백엔드 모두 실행 중이어야 함

## Vercel 배포

또는 Next.js 개발사의 [Vercel 플랫폼](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)에 배포할 수도 있습니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 라이선스

이 프로젝트는 학습 및 데모 목적으로 제작되었습니다.
