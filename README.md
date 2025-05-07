# Delivery Optimization System

A comprehensive delivery management and optimization system with predictive capabilities, route optimization, and AI-powered chat assistant.

## Project Overview

This project is a full-stack application designed to help logistics companies optimize delivery times, predict delivery durations, and manage delivery operations efficiently. It uses machine learning algorithms, real-time data analytics, and an intuitive user interface to improve delivery operations.

## Features

- **Dashboard**: Visualize delivery performance and pending orders
- **Add Delivery**: Log new deliveries into the system
- **Optimize Route**: AI-powered route optimization for efficient delivery planning
- **Delivery Prediction**: Machine learning algorithms to predict delivery times
- **Chat Assistant**: AI-powered chat assistant for delivery-related queries

## Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Router**: React Router v7
- **State Management**: React Query
- **UI Components**: Radix UI with shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Clerk
- **Charts**: Recharts
- **Map Visualization**: Leaflet
- **Build Tool**: Vite

### Backend

- **Framework**: Flask
- **Machine Learning**: scikit-learn, XGBoost
- **Data Processing**: Pandas, NumPy
- **AI Assistant**: Google Gemini API
- **Data Visualization**: Matplotlib, Seaborn
- **Testing**: Pytest

## Project Structure

```
.
├── backend/                 # Flask backend
│   ├── app.py               # Main Flask application
│   ├── delivery_predictor.py # Delivery prediction model
│   ├── chatbot_assistant.py # AI chat assistant
│   ├── models/              # Trained ML models
│   ├── tests/               # Backend tests
│   └── static/              # Static files for backend
│
├── frontend/                # React frontend
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── lib/             # Utility functions and context providers
│   │   └── App.tsx          # Main application component
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
│
└── README.md                # This file
```

## Installation

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Git

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r delivery_predictor_requirements.txt
pip install flask flask-cors python-dotenv requests
```

4. Create a `.env` file with the following variables:

```
FLASK_SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

5. Run the backend server:

```bash
python app.py
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with API configuration:

```
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

4. Run the development server:

```bash
npm run dev
```

## Usage

Once both the frontend and backend servers are running:

1. Access the frontend at `http://localhost:5173`
2. Sign in with your credentials
3. Navigate through the application using the sidebar menu
4. Add deliveries, optimize routes, and use the chat assistant

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
