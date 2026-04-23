# Anti Op: Tribal Artisan E-Marketplace

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) platform designed to showcase and sell authentic handcrafted goods from indigenous communities. This project blends a premium, high-fidelity frontend aesthetic with an enterprise-grade backend infrastructure.

## 🌟 Key Features

### Role-Based Access Control & Dashboards
The platform routes users into specialized dashboards depending on their verified role:
- **Customer**: Browse products, place orders, and track shipments securely.
- **Seller**: Manage inventory via soft-deletes, upload product images to Cloudinary, track active Escrow vs. Released earnings, and process orders.
- **Agent**: Act as decentralized logistical support, picking up packages from sellers and assisting with the last-mile deliveries.
- **Admin**: Approve new seller/agent applicants, verify product listings, and oversee global marketplace analytics.

### Real-time Notifications Engine
Powered by **Socket.io**, the platform features a real-time notification system. Sellers are instantly notified when new orders arrive, and watch as their Escrow funds automatically slide to "Released" via web-socket triggers the moment an order state is upgraded to `delivered`.

### Advanced Financial Aggregations
Earnings are calculated live via **MongoDB Aggregation Pipelines**. Sellers see a strict separation of their pending Escrow funds vs their fully released payouts without heavy client-side calculations.

### Enterprise Backend Infrastructure
- **Strict Validation**: All incoming requests are strictly validated using `Joi` schemas.
- **DDoS/Brute Force Protection**: Global rate limiting acts as a shield against traffic spikes.
- **Order State Machine**: Enforced back-end rules prevent orders from jumping backwards or skipping mandatory fulfillment steps locally enforcing logical supply chains. 
- **Soft Deletions**: Rather than wiping data, deleted products flip an `isDeleted` flag, ensuring historical orders remain perfectly intact in the database.
- **Global Error Handling**: Errors never leak stack traces and cleanly format responses globally via a custom Express middleware.

### Aesthetic Frontend
- **Framer Motion Animations**: Includes animated split-pane authentication screens, layout transitions, and scroll sequence storytelling.
- **Responsive Architecture**: Built natively with Tailwind V4 for highly adaptive desktop and mobile experiences.

---

## 🚀 Tech Stack

**Frontend Framework**
- React 19 / Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Socket.io-client

**Backend Framework**
- Node.js / Express
- MongoDB (Mongoose)
- Socket.io
- JSON Web Tokens (JWT) & bcryptjs
- Multer & Cloudinary (For media storage)
- Joi (Payload validation)

---

## 🛠 Installation & Setup Guide

### 1. Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Cluster (Atlas or Local)
- A free [Cloudinary](https://cloudinary.com/) account for image hosting.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and structure it as follows:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_strong_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Start the backend Node server:
   ```bash
   npm run dev
   ```
*(Optional: Run `node seed_admin.js` to create the default superadmin user!)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`. 

---

## 📁 File Structure Overview
- `/backend/models/*` - Defines our core Mongoose Schemas (`User`, `Product`, `Order`, `Notification`, `AssistanceRequest`).
- `/backend/routes/*` - Segregated feature routers protected with JWT `auth` middleware.
- `/backend/middleware/` - Custom global `errorHandler` and `auth` guards.
- `/backend/config/` - Cloudinary SDK initialization.
- `/frontend/src/pages/*` - Dedicated dashboard routes for Auth, Sellers, Customers, Agents, and Admins.
- `/frontend/src/components/*` - Modular pieces making up the aesthetic landing page.
