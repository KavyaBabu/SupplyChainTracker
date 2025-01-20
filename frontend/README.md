# Supply Chain Track & Trace System

A web application for tracking and managing supply chain events, built with **React (Vite)** and **Material-UI**.

## 🚀 Features
  - **View Items**: View items along with their last event. Clicking on the last event column pops up detailed event history with the last event highlighted in green. Toggle between **Table View** or **Card View** based on preference.

  - **Create, Update, and Manage Items**

  - **Add Events to Items**: Easily log events related to an item.

  - **Mobile Responsive**: Fully optimized for all devices using Material-UI.

## 📦 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/KavyaBabu/IOTA_TWIN_CodingChallenge.git
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
   - The app will be available at **http://localhost:5173**

## 🐳 Running with Docker
1. **Build Docker Image:**
   ```sh
   docker build -t supply-chain-app .
   ```
2. **Run Container:**
   ```sh
   docker run -p 8080:80 supply-chain-app
   ```
   - The app will be available at **http://localhost:8080**

### **2. Run with Docker Compose**
```sh
docker-compose up --build
```
Then check:  
**http://localhost:8080/**  

To stop:
```sh
docker-compose down
```
## Building for Production
```sh
npm run build
```
This will generate optimized files in the `dist/` folder.

