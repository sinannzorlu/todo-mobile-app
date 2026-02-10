# 📱 Todo Mobile App

Mobile Todo application built with **React Native & Expo**.  
Uses **Supabase** as backend and shares the same database and authentication logic with the web version.

Repository: https://github.com/sinannzorlu/todo-mobile-app.git

## 🚀 Run Locally

### Requirements
- Node.js
- npm
- Expo CLI
- Expo Go (physical device or emulator)

### Setup
```bash
git clone https://github.com/sinannzorlu/todo-mobile-app.git

cd todo-mobile-app

npm install

npx expo start
```
Scan the QR code with Expo Go.

🧩 Tech Stack
React Native

Expo

TypeScript

Supabase (Auth, PostgreSQL, RLS)

Expo Notifications

✅ Features
Authentication (Email/Password, Google OAuth)

Task CRUD (create, update, delete, complete)

Priority, due date, tags, categories

Push notifications (manual, automation pending)

📦 Backend
Shared Supabase project with web app

Secure Row Level Security (RLS)

Cross-platform data sync (web ↔ mobile)

📱 Deployment
Built for iOS & Android using Expo / EAS.
