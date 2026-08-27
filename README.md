# MeraApnaMargdarshi

Stage 1 foundation for the full-stack application.

## Overview

This repository now contains a minimal full-stack foundation for the `MeraApnaMargdarshi` application:

- A React frontend with a simple landing screen.
- An Express backend with modular structure.
- A MongoDB Atlas connection using Mongoose via environment variables.

## Requirements

- Node.js 18+
- npm
- A MongoDB Atlas cluster connection string

## Frontend installation

```bash
cd frontend
npm install
```

## Backend installation

```bash
cd backend
npm install
```

## Environment variables

The backend expects a `.env` file in the `backend` folder.

Use the example file as a template:

```bash
cd backend
copy .env.example .env
```

Then set:

- `MONGO_URI` to your MongoDB Atlas connection string
- `PORT=5000`

Do not expose the MongoDB connection string in the React app.

## MongoDB Atlas setup

1. Create a MongoDB Atlas cluster.
2. Allow access from your IP address.
3. Create a database user.
4. Copy the Atlas connection string into `backend/.env`.
5. Ensure the database name used by the application is `meraapnamargdarshi`.

## How to run frontend

```bash
cd frontend
npm run dev
```

The frontend will run on the Vite development server.

## How to run backend

```bash
cd backend
npm run dev
```

## How to test the API

Once the backend is running, call:

```bash
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "MeraApnaMargdarshi API is running"
}
```

## How to verify MongoDB connection

When the backend starts, watch the terminal logs for:

- `Server running on port 5000`
- `MongoDB connected successfully`

If the connection fails, the backend will print a clear error explaining the cause. In Stage 1, the required MongoDB URI must be provided in the backend `.env` file.
