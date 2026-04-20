# EquityIQ: Quantitative Stock & IPO Analyzer 📈

EquityIQ is a full-stack, premium web application that leverages machine learning to predict stock trends and visualizes market data alongside upcoming IPOs. 

## 🏗️ Architecture & Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts (Premium Glassmorphism UI)
- **Backend API**: Node.js, Express.js, MongoDB
- **Machine Learning Engine**: Python, FastAPI, Scikit-Learn (Random Forest Regressor), yfinance

## 🚀 Features
- **AI-Driven Predictions**: Runs a Random Forest model on live historical stock data to forecast a 7-day price trend, calculating standard deviations to display high/low confidence intervals.
- **Interactive Market Dashboard**: A responsive, modern UI built with Tailwind CSS that displays predictions on dynamic Recharts line graphs.
- **Portfolio Watchlist**: Allows users to save and easily switch between their favorite stock tickers.
- **IPO Calendar**: A cleanly formatted datatable tracking upcoming market debuts.

## 🛠️ Running Locally

The application consists of three microservices that need to be started individually:

### 1. Python ML Service (Runs on Port 8000)
```bash
cd ml-service
pip install -r requirements.txt
python run.py
```

### 2. Node.js Backend (Runs on Port 5000)
*Note: Ensure you have a local instance of MongoDB running on port 27017, or update the `.env` file with your MongoDB Atlas URI.*
```bash
cd backend
npm install
npm run dev
```

### 3. React Frontend (Runs on Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open your browser to `http://localhost:5173` to view the application!

---
*Developed as a full-stack microservices project.*
