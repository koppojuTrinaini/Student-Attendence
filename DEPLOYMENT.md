# Deployment Guide: GitHub + Render (SQLite backend)

This guide deploys your attendance system with **GitHub Pages** for the frontend and **Render** as a minimal backend host. The backend uses SQLite, so you do not need any database service besides Render.

## What you need
- A GitHub account
- A Render account (free tier)
- Your project pushed to a GitHub repository

## Step 1: Confirm the repo has deployment files

Make sure your repository includes:
- `.github/workflows/deploy-frontend.yml`
- `frontend/vite.config.js`
- `backend/Dockerfile`
- `render.yaml`

If these files are present, you are ready to deploy.

## Step 2: Deploy the backend to Render

1. Go to **render.com** and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Choose your GitHub repository.
4. Configure the service:
   - **Name:** `attendance-backend`
   - **Environment:** `Docker`
   - **Plan:** `Free`
   - **Region:** closest to you
5. Add these environment variables:
   ```text
   JWT_SECRET=your-secret-key-here
   SMS_MOCK=true
   PORT=5000
   ```
   - Do not set `DATABASE_URL`. The backend uses `file:./dev.db` automatically.
6. Click **Deploy Web Service**.
7. When build finishes, copy the service URL. Example:
   `https://attendance-backend.onrender.com`

## Step 3: Connect the frontend to the backend

1. In GitHub, go to **Settings > Secrets and variables > Actions**.
2. Add a new secret:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://attendance-backend.onrender.com/api`
3. Push any change to `main` or trigger the GitHub Actions workflow.

## Step 4: Wait for frontend deployment

GitHub Actions will:
- install `frontend` dependencies
- build the app
- publish `frontend/dist` to GitHub Pages

Your frontend URL will be:
```
https://{YOUR_GITHUB_USERNAME}.github.io/Student-Attendence/
```

> If your repo name is different, update `frontend/vite.config.js` base path accordingly.

## Step 5: Test the online app

1. Open your GitHub Pages URL.
2. Register as admin or teacher.
3. If registration fails, check the browser network console for API errors.
4. Use Render logs to inspect backend issues.

## Local development setup

To run locally:

```bash
cd backend
npm install
cd ../frontend
npm install
```

Start each app:

```bash
cd backend
npm start
```

```bash
cd ../frontend
npm run dev
```

Then open `http://localhost:5173`.

## Project structure

Your repository should look like this:

- `frontend/`
  - `src/`
  - `vite.config.js`
  - `package.json`
- `backend/`
  - `server.js`
  - `package.json`
  - `prisma/schema.prisma`
  - `Dockerfile`
- `.github/workflows/deploy-frontend.yml`
- `render.yaml`
- `DEPLOYMENT.md`

## Notes for beginners
- GitHub Pages works only for static frontend files.
- Render is used to host the backend API.
- The backend uses SQLite in the Render container, so you do not need an external SQL database.
- `SMS_MOCK=true` means SMS is simulated and no Twilio account is required.

## Troubleshooting

### Backend deployment fails on Render
- Confirm `backend/package.json` includes `@prisma/client`, `prisma`, and `twilio`.
- Confirm `backend/Dockerfile` is present.
- Check the Render build logs for errors.

### Frontend blank or 404 on GitHub Pages
- Ensure the Pages secret `VITE_API_URL` is set.
- Ensure `frontend/vite.config.js` has the correct `base` path.
- Wait a few minutes for GitHub Pages to publish.

### API requests fail
- Verify `VITE_API_URL` ends with `/api`.
- Check Render logs for server errors.
- If you see `401`, the token or login flow may be wrong.

