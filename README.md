# Student Responsive Attendance Management System

## Quick start

1. Install dependencies:
```bash
npm install
```
2. Start the backend:
```bash
npm start
```
3. Start the frontend in a second terminal:
```bash
npm run dev
```
4. Open the app in your browser:
- `http://localhost:5173/Student-Attendence/`

## Deploy to GitHub + Render (24/7 live app)

This project is set up to deploy the frontend to GitHub Pages and the backend to Render.

### 1) Push code to GitHub

```bash
git add .
git commit -m "deploy app"
git push origin main
```

### 2) Deploy the backend to Render

1. Go to https://render.com and connect your GitHub account.
2. Create a new **Web Service**.
3. Select your repository.
4. Choose **Docker** as the environment.
5. Add the environment variables:
   - `JWT_SECRET` = any secret phrase
   - `PORT` = `5000`
6. Deploy the service and copy the Render URL when it finishes.

### 3) Set GitHub Pages frontend backend URL

1. In your GitHub repo, go to **Settings > Secrets and variables > Actions**.
2. Add a new secret:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR_RENDER_URL/api`
3. Push another commit or rerun the workflow.

### 4) GitHub Pages URL

When the workflow finishes, your frontend will be published at:
- `https://{YOUR_GITHUB_USERNAME}.github.io/Student-Attendence/`

> If your repo name is different, update `vite.config.js` base to match.

## Notes for beginners

- GitHub Pages hosts the frontend only.
- Render hosts the backend API and keeps it running 24/7.
- `VITE_API_URL` tells the frontend where the backend is.
- Do not commit `.env` or secret values to GitHub.

## Local commands

- Install packages: `npm install`
- Start backend: `npm start`
- Start frontend: `npm run dev`
- Build frontend: `npm run build`
- Preview build: `npm run preview`

## SMS Messaging
SMS messaging is disabled in this version. The app can still show absent parents' numbers without sending texts.

## Security and privacy recommendations
- Keep `.env` out of Git.
- Use HTTPS in production.
- Keep `JWT_SECRET` secret.
- Validate input before saving data.
