# The Last-Minute Life Saver

## 1. Problem Statement Selected

**Challenge Selected:** Students, professionals, and entrepreneurs frequently miss deadlines, assignments, meetings, bill payments, interviews, and important commitments. Existing productivity tools often rely on passive reminders that are easy to ignore and do little to help users actually complete their tasks.

## 2. Solution Overview

**The Last-Minute Life Saver** is a proactive, AI-powered productivity companion. Unlike traditional task managers that simply send a push notification when a deadline is approaching, this application actively intervenes to help users take meaningful action. By analyzing the user's pending tasks, the AI coach identifies the "Next Best Action," breaks down overwhelming tasks into bite-sized, manageable chunks, and recommends optimal times to work on them based on remaining time and task complexity.

Our focus is moving from *passive alerts* to *active decision-making support*, ensuring users do not just remember their deadlines, but actually meet them.

## 3. Key Features

*   **Intelligent Task Prioritization:** The system automatically sorts tasks not just by deadline, but by urgency and complexity.
*   **Proactive AI Coaching:** An integrated AI assistant analyzes upcoming deadlines and proactively suggests how to tackle them.
*   **Context-Aware Next Best Action:** A dedicated UI panel that reduces cognitive load by telling the user exactly what they should be working on *right now*.
*   **Premium & Dynamic Interface:** Built with a modern glassmorphism design system, dark mode, and micro-animations to encourage user engagement.

## 4. Technologies Used

*   **Frontend Framework:** React 18, utilizing functional components and hooks for state management.
*   **Build Tool:** Vite, for lightning-fast HMR and optimized production builds.
*   **Styling:** Vanilla CSS implemented with a custom design system focusing on glassmorphism and modern UI principles.
*   **Deployment:** Dockerized and deployed via Google Cloud Run.

## 5. Google Technologies Utilized

*   **Gemini API (Gemini 2.5 Flash):** Used as the core intelligence engine. The model analyzes the user's task list, deadlines, and priorities to generate structured JSON data that drives the proactive coaching advice and automated task breakdowns.
*   **Google Cloud Platform:** The application is deployed on Google Cloud Run to ensure high availability and scalability.

---

## Live Demo
Check out the live deployment here: [https://vibe2ship-last-minute-saver-ai-924340229814.asia-south1.run.app](https://vibe2ship-last-minute-saver-ai-924340229814.asia-south1.run.app)
