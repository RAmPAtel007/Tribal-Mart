# Tribal Artisan Marketplace

A modern, high-fidelity e-commerce frontend built to showcase and sell authentic handcrafted goods from indigenous communities. This project blends premium "Apple-like" aesthetics with rich, earthy tribal elements.

## Features Let's Explore
- **Animated Split-Pane Authentication:** A custom Framer Motion Left/Right sliding layout seamlessly transitions users between Login and Registration states.
- **Scroll Sequence Storytelling:** Deep scroll-trigger animations gently reveal content, images, and headlines as the user scrolls.
- **Automated Book-Flip Hero:** The Hero section features a custom 3D automated card shuffling animation displaying high-fidelity tribal photography. 
- **Continuous Product Carousel:** A horizontal scroll gallery tied to vertical scroll progress featuring our curated artisan pieces in local INR currency.
- **Responsive Architecture:** Built primarily for robust desktop experiences with mobile adaptations. 

## Technology Stack
- **React.js 19** 
- **Tailwind CSS v4** (Utility-first styling, integrated natively with Vite)
- **Framer Motion** (For advanced scroll animations, layout transitions, and spring physics)
- **React Router DOM** (For seamless navigation between the landing page and authentication flow)
- **Vite** (Next-generation lightning-fast frontend tooling)
- **Lucide React** (Clean, consistent iconography)

## Installation & Setup Guide

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have Node.js installed (version 18+ is recommended).

### 1. Clone or Download the Repository
Navigate to the root directory `anti op` in your terminal.

---

### Backend Setup

1. Open a terminal and navigate to the backend folder:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` folder and add your environment variables (e.g., `PORT=5000`, `MONGO_URI=your_connection_string`).

4. Start the backend server:
```bash
npm run dev
```

---

### Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend folder:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```

4. Your terminal will output a local address (usually `http://localhost:5173`). Open this link in your preferred web browser to explore the application.

---

## File Structure Overview
- `/src/pages/Home.jsx` - The main landing page orchestrating the Hero, Product Carousel, and Support Tiers.
- `/src/pages/Auth.jsx` - The animated split-pane Login/Register gateway. 
- `/src/components/*` - All modular components like `Header.jsx`, `Hero.jsx`, and `ProductCarousel.jsx`.
- `/src/index.css` - Global CSS handling the Tailwind `@theme` configuration and smooth scroll behavior.
