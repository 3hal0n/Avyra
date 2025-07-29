# Avyra Game Download Platform
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green?logo=springboot)
![Tailwind CSS](https://img.shields.io/badge/Style-TailwindCSS-38bdf8?logo=tailwindcss)
![PayPal](https://img.shields.io/badge/Payments-PayPal-00457C?logo=paypal)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)

![GitHub last commit](https://img.shields.io/github/last-commit/3hal0n/Avyra)
![GitHub repo size](https://img.shields.io/github/repo-size/3hal0n/Avyra)
![GitHub issues](https://img.shields.io/github/issues/3hal0n/Avyra)
![GitHub pull requests](https://img.shields.io/github/issues-pr/3hal0n/Avyra)
![GitHub license](https://img.shields.io/github/license/3hal0n/Avyra)

![Build](https://img.shields.io/github/actions/workflow/status/3hal0n/Avyra/main.yml?label=build)

Avyra is a Steam-inspired fullstack web application built with a **React** frontend and a **Java Spring Boot** backend. It provides a modern, interactive platform for users to browse, purchase, review, and download games, with features such as authentication, wishlist, cart, chatbot assistant, and more.

---

## Table of Contents

- [Features](#features)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- **User Authentication**: Register, login, and secure session management with JWT.
- **Game Catalog**: Browse, search, and filter games with detailed pages.
- **Wishlist & Cart**: Add games to wishlist or cart, manage quantities, and purchase.
- **PayPal Payment Integration**: Secure checkout and payment processing using PayPal.
- **Download System**: Access purchased games and download files securely.
- **Chatbot Assistant**: AI-powered chatbot for recommendations and support.
- **Reviews**: Submit, view, and delete reviews for games.
- **Profile Management**: View account info, change password, and see order/download history.
- **Responsive UI**: Modern, glassmorphic design with Tailwind CSS and custom animations.

---

## Frontend Overview

**Location:** [`frontend/`](frontend/)

- **Framework:** React (with Vite for fast development)
- **Styling:** Tailwind CSS, custom CSS for neon/glassmorphic effects
- **Routing:** React Router
- **State Management:** React Context (for Auth and Wishlist)
- **API Calls:** Axios
- **3D Models:** `@react-three/fiber` and `@react-three/drei` for animated login/register characters
- **Components:**
  - `Navbar`, `Footer`: Consistent navigation and branding
  - `ChatbotInterface`: AI assistant for game queries and recommendations
  - `GameList`, `GameDetails`: Game browsing and detail views
  - `Wishlist`, `Cart`, `Downloads`: Manage user collections and purchases
  - `Profile`: Tabbed user dashboard for overview, security, and library
  - `Reviews`: Add/delete reviews for games

**Notable Files:**
- [`src/pages/Profile.jsx`](frontend/src/pages/Profile.jsx): User dashboard with tabs for overview, security (password change), and library (wishlist/cart summary).
- [`src/pages/Chatbot.jsx`](frontend/src/pages/Chatbot.jsx): ChatGPT-style AI assistant interface.
- [`src/context/AuthContext.jsx`](frontend/src/context/AuthContext.jsx): Handles authentication state and API token management.
- [`src/context/WishlistContext.jsx`](frontend/src/context/WishlistContext.jsx): Manages wishlist state and API sync.
- [`src/utils/downloadFile.js`](frontend/src/utils/downloadFile.js): Secure file download utility.

---

## Backend Overview

**Location:** [`backend/`](backend/)

- **Framework:** Java Spring Boot
- **Database:** JPA/Hibernate (with entities for User, Game, Review, Wishlist, etc.)
- **Security:** JWT-based authentication, Spring Security
- **REST API:** Controllers for authentication, games, reviews, wishlist, cart, downloads, and chatbot
- **AI Integration:** Chatbot endpoint using Gemini API for AI-powered responses
- **File Handling:** Secure download endpoints for purchased games

**Notable Files:**
- [`src/main/java/backend/controller/ReviewController.java`](backend/src/main/java/backend/controller/ReviewController.java): Handles review CRUD operations.
- [`src/main/java/backend/controller/DownloadController.java`](backend/src/main/java/backend/controller/DownloadController.java): Secure file download for authenticated users.
- [`src/main/java/backend/service/ChatbotService.java`](backend/src/main/java/backend/service/ChatbotService.java): Integrates with Gemini API for chatbot responses.
- [`src/main/java/backend/model/Game.java`](backend/src/main/java/backend/model/Game.java): Game entity with fields for requirements, platforms, genres, etc.
- [`src/main/java/backend/model/User.java`](backend/src/main/java/backend/model/User.java): User entity with registration and authentication logic.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router, @react-three/fiber
- **Backend:** Java 17+, Spring Boot, Spring Security, JPA/Hibernate, JWT, Gemini API (for chatbot)
- **Database:** H2 (dev) or any SQL DB (prod)
- **Other:** ESLint, Prettier, custom CSS for neon/glassmorphic UI

---

### PayPal Payment Integration

The platform uses PayPal for secure payment processing. Users can checkout their cart and complete purchases using their PayPal account. The backend verifies payment status and grants access to purchased games upon successful transactions.

---

##License
MIT License. See LICENSE for details.

---

## How to Run

###Frontend

cd frontend
npm install
npm run dev
---
### Backend

```sh
cd backend
./mvnw spring-boot:run

Runs on http://localhost:8080



