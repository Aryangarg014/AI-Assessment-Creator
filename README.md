# VedaAI — AI Assessment & Question Paper Creator

VedaAI is a modern, high-performance web application designed for educators to easily generate, manage, and export high-quality, AI-driven question papers and assessments. Powered by Gemini AI, the platform handles long-running generation tasks in the background with real-time status updates streamed via WebSockets.

**Live Demo URL**: [https://ai-assessment-creator-beige.vercel.app](https://ai-assessment-creator-beige.vercel.app)

---

## 🏛️ Project Architecture Overview

VedaAI is built as a monorepo consisting of three primary layers:
1. **Frontend (`/frontend`)**: A Next.js (App Router) web application utilizing Tailwind CSS for beautiful styling, Lucide React for modern icons, and Socket.io-client for real-time progress updates.
2. **Backend (`/backend`)**: A robust Node.js & Express API written in TypeScript. It integrates with **Socket.IO** for WebSocket communication, **Mongoose** to interact with MongoDB, and **BullMQ** to orchestrate asynchronous task execution.
3. **Shared Resources (`/shared`)**: Houses shared utilities, validation schemas, or constants shared between the client and server.

### Complete Technology Stack

* **Frontend Framework**: Next.js 15+ (App Router, React 19)
* **Styling**: Tailwind CSS v4, Vanilla CSS variables for smooth glassy overlays
* **Backend Runtime**: Node.js & Express with TypeScript
* **Database**: MongoDB (via Mongoose)
* **Message Queue / Task Worker**: BullMQ
* **In-Memory Store**: Upstash Redis (Serverless)
* **AI Model**: Google Gemini Pro API (`@google/generative-ai`)
* **Real-time Streaming**: Socket.IO (WebSockets)
* **PDF Export Engine**: `html-to-image` & `jsPDF`

---

## 🛠️ Technical Approach

### 1. Real-Time Background Generation & Progress Tracking
Rather than forcing users to wait on standard HTTP requests (which would time out during complex AI generations), VedaAI utilizes a decoupled background-worker architecture:
* **Decoupled Job Queue**: When a user submits the "Create Assignment" form, the backend writes a 'pending' assignment to MongoDB and queues a job in **BullMQ** (powered by **Upstash Redis**).
* **Asynchronous Background Processing**: A dedicated background worker (`assessmentWorker.ts`) picks up the job from Redis, handles the heavy Gemini AI text generation, structures the resulting questions, and saves the final result to MongoDB.
* **WebSocket Streams**: During the worker's processing lifecycle, it streams precise progress updates (e.g. `Initializing...`, `Generating MCQs...`, `Formatting...`, `Saving...`) through **Socket.IO**.
* **Pristine UX & Asymptotic Progress Bar**: The frontend hooks into the Socket.IO room for that specific assignment. It features a nested `GeneratingTabContent` component with an "asymptotic" progress bar that glides smoothly up to 95%, only completing to 100% when the worker fires a finish event. This guarantees a continuous, smooth animation regardless of network or API response delays.

### 2. A4-Perfect PDF Export (The "Master Inner Container" Approach)
Converting complex web layouts to PDFs usually suffers from missing CSS styles, cut-off text, or Tailwind CSS v4 parsing crashes (due to modern `oklch` or `lab` color functions that standard libraries like `html2canvas` cannot read). VedaAI bypasses this perfectly:
* **The Master Inner Container**: The entire generated question paper is rendered inside a targeted, highly structured `div` referenced via React's `useRef`.
* **High-Fidelity Rasterization**: Using `html-to-image` (`toPng`), the container is compiled into a high-density, lossless PNG data URL. This entirely avoids modern CSS parsing limitations by converting visual styles directly to pixels.
* **Proportional A4 Scaling**: A jsPDF instance is initialized in `a4` portrait mode. The script dynamically calculates the page aspect ratio (A4 width is 210mm, height is 297mm) and scales the rendered image coordinates proportionally. This guarantees that the printed document perfectly fits A4 dimensions without clipping content or overflowing pages.

---

## ⚠️ Current Limitations & Caveats

> [!WARNING]
> **Authentication (Login/Signup) has been temporarily omitted from this release due to time constraints and will be implemented in future iterations.**
> Currently, all generated assignments are shared in a global space for testing and evaluation purposes.

---

## 💻 Local Setup Instructions

Follow these instructions to run the entire project on your local machine.

### Prerequisites
* **Node.js** (v18.x or v20.x recommended)
* **npm** (v9.x or higher)
* **MongoDB**: A local instance or a free MongoDB Atlas connection string.
* **Redis**: An Upstash Redis connection string (recommended) or a local Redis instance.
* **Gemini API Key**: A valid key from Google AI Studio.

---

### 1. Setup the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `/backend` folder:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vedaai?retryWrites=true&w=majority
   UPSTASH_REDIS_URL=rediss://default:YOUR_PASSWORD@your-db-name.upstash.io:6379
   GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   ```

4. Compile and start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000`.*

---

### 2. Setup the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root of the `/frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   BACKEND_URL=http://localhost:5000
   ```

4. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your web browser to interact with the application!*
