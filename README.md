# Supply Chain Track & Trace

A web application for tracking and managing supply chain events, built with **React (Vite)** for the frontend and **Node.js/Express** for the backend.

## 🚀 Features
- View Items (View last event, click on last event column to see event details, highlighted in green)
- Toggle between **Table View** and **Card View** for items
- Create, Update, and Manage Items
- Add Events to items
- Fully **Mobile Responsive** with Material-UI

## 📦 Installation

### **1. Clone the Repository**
```sh
git clone https://github.com/KavyaBabu/IOTA_TWIN_CodingChallenge.git
```

### **2. Run Locally (Development)**
```sh
cd backend && npm install
cd ../frontend && npm install
```

#### **Run Backend**
```sh
cd backend
npm run dev
```
Check API at: **http://localhost:3000/api-docs**

#### **Run Frontend**
```sh
cd frontend
npm run dev
```
Access App at: **http://localhost:8080**

## 🐳 Running with Docker

### **1. Build & Run with Docker Compose**
```sh
docker-compose up --build
```
- **Backend API:** [http://localhost:3000/api/items](http://localhost:3000/api/items)
- **API Docs:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Frontend App:** [http://localhost:8080](http://localhost:8080)

### **2. Stop Containers**
```sh
docker-compose down
```

## 🏗️ Building for Production

#### **Backend**
```sh
cd backend
npm run build
```
#### **Frontend**
```sh
cd frontend
npm run build
```
This will generate optimized files in the respective `dist/` folders.
