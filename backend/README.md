# Supply Chain Track & Trace System

## Overview
A **TypeScript-based** Supply Chain Tracking System with a **REST API** and **Docker support**.
It allows tracking of items, logging events, and monitoring the last known location and status.

## Features
- **Create & update** supply chain items.
- **Log events** (location, custodian, status changes).
- **Query all events** of an item.
- **Get last known location** and status.
- **Swagger API Documentation** at `/api-docs`.
- **Docker & Docker Compose** support for easy deployment.

## **Project Structure**
```
supply-chain-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── schemas/
│   ├── app.ts
├── data/
│   ├── items.json
├── __tests__/
├── package.json
├── package-lock.json
├── tsconfig.json
├── jest.config.js
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── openapi.yaml
└── README.md
```

---

## **Installation & Setup**
### **1. Clone the Repository**
```sh
git clone https://github.com/KavyaBabu/IOTA_TWIN_CodingChallenge.git
cd backend
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Run Locally (Development)**
```sh
npm run dev
```
Then open:  
**http://localhost:3000/api-docs** (Swagger UI)  

## **Run with Docker**
### **1. Build & Run with Docker**
```sh
docker build -t iota-supply-chain-backend .
docker run -p 3000:3000 iota-supply-chain-backend
```

### **2. Run with Docker Compose**
```sh
docker-compose up --build
```
Then check:  
**http://localhost:3000/api/items**  
**http://localhost:3000/api-docs**  

To stop:
```sh
docker-compose down
```

## **Running Tests**
```sh
npm test
```

## **API Endpoints**
| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| **POST** | `/api/items`            | Create a new item               |
| **GET**  | `/api/items`            | Get all items                   |
| **GET**  | `/api/items/:id`        | Get item by ID                  |
| **PUT**  | `/api/items/:id`        | Update an item                  |
| **POST** | `/api/items/:id/events` | Add an event to an item         |
| **GET**  | `/api/items/:id/events` | Get all events for an item      |
| **GET**  | `/api/items/:id/events/last` | Get last event of an item |

## **Swagger API Documentation**
Once running, access **Swagger UI**:  
**http://localhost:3000/api-docs**

## **Deployment**
### **Deploy with Docker**
1. **Build the image**
   ```sh
   docker build -t iota-supply-chain-backend .
   ```
2. **Run the container**
   ```sh
   docker run -p 3000:3000 iota-supply-chain-backend
   ```