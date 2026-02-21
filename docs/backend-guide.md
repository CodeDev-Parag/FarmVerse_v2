# FarmVerse Backend & Deployment Guide

To make the FarmVerse platform fully live and functional with persistent data, we need to transition our mock frontend state into a real Full-Stack application using the **MERN** stack (MongoDB, Express.js, React, Node.js).

This guide outlines exactly how to build and deploy the backend, and how to connect it to our existing frontend.

---

## 🏗️ Phase 1: Database Setup (MongoDB Atlas)

We will use **MongoDB Atlas**, a fully managed cloud database, so we don't have to host the database ourselves.
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Build a new cluster (the **M0 Free Tier** is perfect for this).
3. Create a **Database User** (save the username and password).
4. Allow network access from anywhere (`0.0.0.0/0`) during development.
5. Get your Connection String URI. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/FarmVerseDB?retryWrites=true&w=majority`

---

## ⚙️ Phase 2: Building the Node.js/Express Backend

We will create a separate folder called `backend` inside the project to handle the server logic.

### 1. Initialize the Backend
Run these commands in your terminal:
```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
npm install -D nodemon typescript ts-node @types/express @types/node @types/cors
```

### 2. File Structure
Set up the backend structure like this:
```
backend/
├── src/
│   ├── config/
│   │   └── db.ts           # MongoDB connection setup
│   ├── models/             # Mongoose Schemas
│   │   ├── User.ts         # User/Farmer Schema
│   │   ├── Product.ts      # Crop/Inventory Schema
│   │   └── Order.ts        # Checkout Orders
│   ├── routes/             # API Endpoints
│   │   ├── authRoutes.ts   # Login/Register APIs
│   │   ├── productRoutes.ts# Marketplace APIs
│   │   └── orderRoutes.ts  # Checkout APIs
│   ├── controllers/        # Business Logic
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   └── orderController.ts
│   └── server.ts           # Express Entry Point
├── .env                    # Environment Variables (DB URI, JWT Secret)
└── package.json
```

### 3. Core Database connection (`src/config/db.ts`)
```typescript
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
```

### 4. Setting up `.env`
In the `backend` folder, create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<your_user>:<your_password>@cluster0...
JWT_SECRET=supersecretfarmversekey
```

---

## 🔗 Phase 3: Connecting the Frontend

Once the API routes (e.g., `GET /api/products`, `POST /api/orders`) are running on `http://localhost:5000`, we need to update our React frontend.

1. Install Axios in the frontend:
   ```bash
   npm install axios
   ```
2. Update **Zustand (`useStore.ts`)** to fetch from the backend instead of using `MOCK_PRODUCTS`.
   ```typescript
   import axios from 'axios';

   // ... inside Zustand fetch action:
   const fetchProducts = async () => {
       const res = await axios.get('http://localhost:5000/api/products');
       set({ products: res.data });
   }
   ```

---

## 🚀 Phase 4: Making the Website LIVE

To make the site globally accessible, we separate the deployments:

### 1. Backend Deployment (Render or Railway)
Host the Express app on [Render](https://render.com) (free tier):
- Connect your GitHub repository.
- Select the `backend` folder as the root directory.
- Set the Build Command to `npm install && npm run build` (if using tsc) or run via `ts-node`.
- Set the Start Command to `npm start` (which points to `node dist/server.js`).
- Add your `.env` variables (MONGO_URI) in the Render dashboard.

### 2. Frontend Deployment (Vercel)
Host the React app on [Vercel](https://vercel.com) (free tier):
- Connect your GitHub repository to Vercel.
- Select the Vite/React preset.
- Add an Environment Variable in Vercel: `VITE_API_URL` pointing to your Render backend URL (e.g., `https://farmverse-api.onrender.com/api`).
- **Important**: Update your frontend Axios calls to use `import.meta.env.VITE_API_URL` instead of `localhost:5000`.
- Click Deploy!

### Final Flow Check
`Vercel (React Frontend) ➔ Sends Axios Request ➔ Render (Express Backend) ➔ Queries Data ➔ MongoDB Atlas (Database)`

---

## 🛠️ Next Development Step

If you'd like, I can immediately **scaffold the `backend` folder**, install the `express`/`mongoose` dependencies, and generate the boilerplate `server.ts` and Database models for you right here via terminal commands! Just say the word.
