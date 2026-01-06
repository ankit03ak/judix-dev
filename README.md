# Judix - Full-Stack Task Management App

Modern web application with authentication and CRUD operations for Tasks, Notes, and Posts.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![Express](https://img.shields.io/badge/Express-4.18-green?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)

## ✨ Features

- **Authentication:** JWT-based login/signup with bcrypt password hashing
- **Dashboard:** Responsive UI with glassmorphism effects
- **CRUD Operations:** Tasks (with status/priority), Notes (with colors/tags), Posts (draft/published)
- **Search & Filter:** Real-time search and filtering across all entities
- **Security:** Protected routes, input validation, secure headers

## 🛠️ Tech Stack

**Frontend:** Next.js 15, TypeScript, TailwindCSS, React Hook Form, Zod  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## 📁 Project Structure

```
judix/
├── backend/          # Express API
│   ├── src/
│   │   ├── models/   # Mongoose schemas
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── .env.example
├── frontend/         # Next.js app
│   ├── app/
│   │   ├── (auth)/   # Login/Signup
│   │   └── dashboard/
│   └── lib/          # API client, auth utils
└── docs/
    ├── API.md
    ├── scaling.md
    └── postman/collection.json
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: Add MONGODB_URI and JWT_SECRET
npm run dev  # Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
npm run dev  # Runs on http://localhost:3000
```

## 📚 API Endpoints

**Auth:** `/auth/register`, `/auth/login`, `/auth/profile` (GET/PUT)  
**Tasks:** `/tasks` (GET/POST), `/tasks/:id` (GET/PUT/DELETE)  
**Notes:** `/notes` (GET/POST), `/notes/:id` (GET/PUT/DELETE)  
**Posts:** `/posts` (GET/POST), `/posts/:id` (GET/PUT/DELETE)

All protected endpoints require: `Authorization: Bearer <token>`

See [docs/API.md](docs/API.md) for detailed documentation.

## 📮 Postman Collection

Import `docs/postman/collection.json` for pre-configured API testing with automatic token management.

## 🔒 Security

- Password hashing with bcrypt
- JWT authentication
- Protected routes with middleware
- Helmet.js security headers
- Input validation

## 📈 Production Deployment

See [docs/scaling.md](docs/scaling.md) for:
- Database optimization & indexing
- Redis caching
- Load balancing (Nginx)
- Docker deployment
- Monitoring & logging

## 🎨 UI Features

- Glassmorphism design with dark theme
- Smooth animations (fade-in, slide-up, scale)
- Fully responsive layout
- Color-coded items for visual distinction
- Toast notifications for user feedback

## 📝 Environment Variables

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=8080
NODE_ENV=development
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🧪 Testing

```bash
# Backend health check
curl http://localhost:8080/api/health

# Frontend production build
cd frontend && npm run build && npm start
```

---

**Built for Judix Full-Stack Developer Intern Assignment** ❤️
