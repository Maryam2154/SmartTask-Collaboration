# SmartTask — Professional Phase 2 Frontend

A polished Phase 2 internship frontend for the Smart Task & Collaboration Dashboard.

## Included
- Professional responsive SaaS-style dashboard UI
- Overview, Projects, Tasks Kanban, Team, Team Chat, Files, Calendar, Analytics, Activity, Profile, Settings
- Sample 5-person team for demonstrations
- Sample projects, tasks, files, chat messages, deadlines and analytics
- Search, notifications, filters, modals and responsive mobile navigation
- No Supabase, Firebase, SQL, backend server or API keys required
- Free to run locally and deploy on Vercel

## Run in VS Code
```bash
npm install
npm run dev
```
Open http://localhost:3000

## GitHub + Vercel
1. Create a new GitHub repository.
2. In the VS Code terminal inside this folder run:
```bash
git init
git add .
git commit -m "Professional Phase 2 frontend"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
3. Import the repository into Vercel and deploy with the default Next.js settings.

## Important demo note
This version is intentionally browser-only to keep Phase 2 simple and free. Team chat, files and data are demo/local features; they are not synchronized between different users/devices and selected files are represented as demo metadata rather than uploaded to cloud storage.
