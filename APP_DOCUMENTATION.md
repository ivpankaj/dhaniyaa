# Dhaniyaa - Project Management Platform

Dhaniyaa (meaning "Coriander" in Hindi) is a modern, high-performance, AI-powered project management platform designed for agile engineering teams. It offers a streamlined experience for managing organizations, projects, sprints, and tasks with real-time updates and AI-driven insights.

Dhaniyaa is a product by **CookMyTech**. Visit us at [cookmytech.site](https://cookmytech.site).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: A running instance or MongoDB Atlas URI
- **Cloudinary Account**: For image/attachment storage
- **Google Gemini API Key**: For the AI assistant (Adrak)
- **Firebase Account**: For Google Authentication

### 🛠️ Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd dhaniyaa-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of `dhaniyaa-backend/` based on `.env.example`:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_specific_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GEMINI_API_KEY=your_google_gemini_key
   
   # Firebase Config (Shared with Frontend)
   FIREBASE_API_KEY=...
   FIREBASE_AUTH_DOMAIN=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_STORAGE_BUCKET=...
   FIREBASE_MESSAGING_SENDER_ID=...
   FIREBASE_APP_ID=...
   FIREBASE_MEASUREMENT_ID=...
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:4000`.

---

### 🎨 Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd dhaniyaa
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of `dhaniyaa/` based on `.env.example`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Components**: Radix UI (Unstyled components)
- **Real-time**: Socket.io-client
- **State Management**: Context API (Auth) & React State
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Toasts**: Sonner

### Backend
- **Framework**: Express.js (v5)
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **AI**: Google Gemini AI (Adrak Assistant)
- **Validation**: Zod
- **Mailing**: Nodemailer
- **Authentication**: JWT & Firebase Admin SDK

---

## 📱 Modules & Features

### 1. Authentication
- **Multi-method Login**: Standard Email/Password login and Google OAuth integration.
- **Onboarding**: New users are automatically set up with a default workspace and a sample organization to get started quickly.
- **Password Management**: Secure password reset flow and initial password setup for OAuth users.

### 2. Dashboard (Workspace Overview)
- **Organization Management**: Create, switch between, and delete organizations.
- **Project Grid**: Efficient listing of all projects within an organization.
- **Search & Pagination**: Robust server-side search and pagination for handling large numbers of projects.
- **Invitations**: View and manage pending invitations to join other projects or organizations.

### 3. Project Board (Kanban)
- **Kanban View**: Visual workflow with "To Do", "In Progress", "In Review", and "Done" columns.
- **Drag & Drop**: Seamlessly move tickets between statuses; updates are persisted instantly and synced via WebSockets.
- **Ticket Details**: Rich ticket view including description, attachments, priority, and assignee.
- **Commenting**: Real-time comment threads on every ticket with image attachment support.

### 4. Backlog & Sprints (Planner)
- **Sprint Management**: Create, start, and complete sprints (Cycles).
- **Prioritization**: Drag and drop tickets to reorder them in the backlog or move them into specific sprints.
- **Sprint Insights**: Track progress of active sprints and move remaining tasks to the backlog upon completion.

### 5. Adrak AI Assistant
- **Contextual Help**: An embedded AI chatbot that understands the Dhaniyaa platform and helps users find features.
- **Spicy Personality**: Name "Adrak" (Ginger) reflects its zesty and helpful nature.
- **Real-time interaction**: Modern chat interface with markdown support.

### 6. Notifications
- **Real-time Alerts**: Get notified instantly when you are invited to a project or when tasks are updated.
- **Notification Center**: A dropdown menu to manage all your recent activity alerts.

---

## 🛠️ Key Architectural Decisions
- **Optimized Performance**: Use of Mongoose `.lean()` for read-intensive queries to minimize memory footprint.
- **Compound Indexing**: Database indices optimized for common filtering patterns (e.g., tickets by project and status).
- **Socket-Driven Sync**: Real-time state synchronization across all connected clients for a collaborative experience.
- **Dynamic Imports**: React components are lazy-loaded to ensure fast initial page loads.

---

## 📁 Project Structure

### Frontend (`/dhaniyaa`)
- `/src/app`: Next.js pages and layouts.
- `/src/components`: Reusable UI components (Modals, Kanban, Logo, etc.).
- `/src/context`: Authentication context and provider.
- `/src/hooks`: Custom hooks (e.g., `useSocket`).
- `/src/lib`: API client and utility functions.

### Backend (`/dhaniyaa-backend`)
- `/src/modules`: Domain-driven modules (Auth, Ticket, Project, etc.).
- `/src/utils`: Global utilities (Email service, Pagination, AI logic).
- `/src/middlewares`: Security and validation middlewares.
- `server.ts`: Initializing Express and Socket.io.
