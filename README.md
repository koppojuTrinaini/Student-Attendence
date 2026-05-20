# Student Responsive Attendance Management System


## Deployment Guide
- See `DEPLOYMENT.md` for beginner-friendly GitHub + Render deployment steps.

## What was fixed
- Added real SMS delivery support in `backend/server.js` using Twilio.
- Added `backend/.env.example` for required secret configuration.
- Updated `backend/package.json` to include `twilio`.

## How to configure SMS
1. Create `backend/.env` from `backend/.env.example`.
2. Fill in `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE`.
3. For local testing without Twilio, set `SMS_MOCK=true` in `backend/.env`.
4. Install backend dependencies::
   ```bash
   cd backend
   npm install
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

## Testing SMS delivery
- With Twilio configured, the route sends real SMS messages.
- Without Twilio, `SMS_MOCK=true` will simulate sends and log them on the server.
- Check the browser or API response for `smsLog` details.

## GitHub upload and public hosting
- Initialize a Git repository in `Student-1` and push to GitHub.
- Use a hosted service for 24/7 availability:
  - Frontend: Vercel, Netlify, or Cloudflare Pages.
  - Backend: Render, Railway, Railway, or Fly.io.
- For a full-stack deploy, either deploy frontend and backend separately or use a service that supports Node APIs behind one domain.

## Security and privacy recommendations
- Keep `.env` out of Git: ensure `backend/.gitignore` includes `.env`.
- Use HTTPS in production for all traffic.
- Store passwords hashed with `bcrypt` (already implemented).
- Protect API routes with JWT and role checks (already implemented in `server.js`).
- Add input validation for all requests before saving data.
- Create a privacy policy page in the frontend explaining:
  - what data is collected,
  - how it is used,
  - how long it is stored,
  - how parents and students can request deletion.
