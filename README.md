# 🌐 Social Media Web Application

A modern, responsive, and feature-rich social media web application built with **React 19**, **TypeScript**, and **Tailwind CSS v4**. It interacts with an external API to deliver a seamless social networking experience, complete with full authentication, post/comment management (CRUD), and an intuitive UI powered by **Shadcn UI** and **TanStack React Query**.

---

## 🚀 Live Demo & Preview
- **Live Demo:** [https://social-app-ten-sigma.vercel.app/](#)

---

## ✨ Key Features

- **🔐 Authentication & Security:**
  - Secure **Sign-up** and **Login** flows.
  - **Change Password** functionality for account security.
  - Protected routes and session handling.

- **🏠 Home Feed & Posts:**
  - **Home Page** displaying all community posts fetched dynamically from the external API.
  - **Post Details Page** showing comprehensive post information along with all associated comments.
  - **Post CRUD:** Create new posts, update existing ones, and delete posts seamlessly.

- **💬 Comment System:**
  - Full CRUD operations for comments (Create, Update, Delete) nested under posts.

- **👤 User Profile:**
  - Dedicated **Profile Page** to view user-specific activities and details.

- **⚡ Performance & UX:**
  - Efficient server-state management and caching using **TanStack React Query**.
  - Robust form validation with **React Hook Form** and **Zod**.
  - Instant toast notifications using **Sonner**.
  - Fully responsive modern UI designed with **Tailwind CSS v4** and **Shadcn UI**.

---

## 🛠️ Tech Stack & Libraries

This project leverages a modern front-end ecosystem:

| Category | Technology / Library |
| :--- | :--- |
| **Core Framework** | [React 19] |
| **Language** | [TypeScript] |
| **Styling** | [Tailwind CSS v4] |
| **Routing** | [React Router DOM v7] |
| **State & Data Fetching** | [TanStack React Query v5], [Axios] |
| **Forms & Validation** | [React Hook Form], [Zod] |
| **Icons & Utilities** | [Lucide React], [Date-fns], [Sonner] |
| **Code Quality** | ESLint, Prettier |

---


# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
