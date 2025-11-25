This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker Support

This project includes Docker support for containerized deployments.

### Building the Docker Image

```bash
docker build -t react-front .
```

### Running the Docker Container

```bash
docker run -p 3000:3000 react-front
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

The project includes two environment files:

- `.env.local` - For local development (uses `http://localhost:8000`)
- `.env.production` - For production deployment (uses `https://fastapi-basic-production.up.railway.app`)

To override the backend URL when running Docker locally:

```bash
docker run -p 3000:3000 -e FASTAPI_BACKEND_URL=http://your-backend:8000 react-front
```

## Deploy on Railway

This project is configured for deployment on [Railway](https://railway.app).

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect the Dockerfile and build your application
6. The application is pre-configured to connect to:
   - **Backend API**: `https://fastapi-basic-production.up.railway.app`
7. Your application will be deployed and accessible via a Railway-provided URL

**Note**: The production backend URL is already configured in the Dockerfile. If you need to change it, update the `FASTAPI_BACKEND_URL` environment variable in Railway dashboard or modify the Dockerfile.

### Railway Configuration

The project includes a `railway.toml` file that configures:
- Dockerfile-based build
- Automatic restart on failure
- Port 3000 exposure

### Important Notes for Railway Deployment

- The FastAPI backend is already deployed at: `https://fastapi-basic-production.up.railway.app`
- The frontend is pre-configured to connect to this backend automatically
- Railway automatically handles HTTPS and provides a public URL for your frontend
- Monitor logs in Railway dashboard for any deployment issues
- Both frontend and backend must be running for full functionality

## Deploy on Vercel

Alternatively, you can deploy on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
