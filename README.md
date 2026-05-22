# Student Responsive Attendance Management System

## Deployment Guide
- See `DEPLOYMENT.md` for beginner-friendly GitHub + Render deployment steps.

## What was fixed
- Added real SMS delivery support in `server.js` using Twilio.
- Added `.env.example` for required secret configuration.
- Updated `package.json` to include `twilio` and backend dependencies.

## SMS Messaging
SMS messaging to parents has been disabled in this repository. The API still exposes an endpoint to list absent parents' numbers, but no messages will be sent.

## GitHub upload and public hosting
- Initialize a Git repository in `Student-1` and push to GitHub.
- Use a hosted service for 24/7 availability:
  - Frontend: GitHub Pages or any static host.
  - Backend: Render, Railway, Fly.io, or any Docker-capable host.
- For a full-stack deploy, either deploy frontend and backend separately or use a service that supports Node APIs behind one domain.

## Security and privacy recommendations
- Keep `.env` out of Git.
- Use HTTPS in production for all traffic.
- Store passwords hashed with `bcrypt` (already implemented).
- Protect API routes with JWT and role checks (already implemented in `server.js`).
- Add input validation for all requests before saving data.
- Create a privacy policy page explaining:
  - what data is collected,
  - how it is used,
  - how long it is stored,
  - how parents and students can request deletion.
