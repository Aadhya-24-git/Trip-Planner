# YatraPlan — Smart India Trip Planner

> **"Tell us what kind of trip you want, and we will create a realistic India trip plan."**

YatraPlan is a production-quality web application designed to help travelers plan personalized, realistic trips across India. Powered by a deterministic rule-based scoring engine and geographically clustered itinerary generator, YatraPlan solves real travel problems: preventing zig-zag cross-city fatigue, offering authentic local delicacies, and calculating true door-to-door budgets.

---

## Key Features

1. **Rule-Based Recommendation Engine (100-Point Scoring)**
   - Transparent scoring based on budget match (+25), duration match (+15), interests (+25), travel style (+15), season (+10), traveler type (+5), and ratings (+5).
   - Generates human-readable explanations (e.g., *"Munnar matches your budget (₹25,000), nature & photography interests, and relaxed 5-day pace for couples"*).
   - Zero hallucinations or black-box machine learning.

2. **Geographically Clustered Smart Itinerary Generator**
   - Automatically clusters attractions into North, South, Central, East, and West daily zones to minimize travel transit fatigue.
   - Pacing options:
     - **Relaxed**: 3–4 activities/day
     - **Balanced**: 4–6 activities/day
     - **Packed**: 6–8 activities/day
   - Each activity contains time, location, estimated cost, duration, description, and travel time from previous sights.
   - Allows users to add, edit, delete activities, regenerate single days, or regenerate the entire plan.

3. **Dynamic Budget Breakdown Calculator**
   - Categorizes costs: Transportation, Accommodation, Food, Activities, Local Transit, and Miscellaneous buffers.
   - Computes total trip budget and per-person cost with interactive visual percentage share bars.

4. **32+ Curated Indian Destinations & 120+ Attractions**
   - Spanning Kerala, Tamil Nadu, Karnataka, Goa, Rajasthan, Himachal Pradesh, Uttarakhand, Jammu & Kashmir, Meghalaya, West Bengal, Uttar Pradesh, and Maharashtra.
   - Seeded with authentic coordinates, seasonal profiles, entry fees, and local dishes.

5. **Interactive Map & Weather Integration**
   - Interactive Leaflet/OpenStreetMap rendering of destinations, attraction markers, and route paths (zero third-party API key required out of the box).
   - Real-time weather conditions, humidity, rain probability, best sightseeing day recommendation, and 5-day forecasts with OpenWeather API integration and offline seasonal fallback.

6. **Local Culinary Discovery**
   - Highlights must-try regional delicacies, vegetarian/non-vegetarian indicators, famous street food stalls, and price ranges for every destination.

7. **Trip Management & User Dashboard**
   - Save custom itineraries, rename trips, duplicate itineraries, export/print clean PDF layouts, and share trips with friends and family via link.
   - JWT authentication with one-click demo login option.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Indian-inspired luxury warm palette)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Maps**: Leaflet + OpenStreetMap
- **HTTP Client**: Axios with JWT interceptors

### Backend
- **Framework**: Python FastAPI
- **Validation**: Pydantic v2
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (python-jose, passlib, bcrypt)
- **Database Driver**: psycopg2-binary (PostgreSQL) / sqlite3

### Database
- **Primary**: Neon PostgreSQL (fully supported via `DATABASE_URL`)
- **Local Fallback**: SQLite (`sqlite:///./yatraplan.db`) when no Neon connection string is provided for zero-friction local execution.

---

## Project Structure

```
trip-planner/
├── backend/
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models (User, Destination, Attraction, FoodItem, SavedTrip, WeatherCache)
│   │   ├── schemas/           # Pydantic v2 request/response validation schemas
│   │   ├── routers/           # API routes (auth, destinations, recommendations, itinerary, budget, trips, weather, foods, attractions)
│   │   ├── services/          # Recommendation scoring, smart itinerary generator, budget calculator, weather service
│   │   ├── auth.py            # Password hashing & JWT token verification
│   │   ├── config.py          # App settings via pydantic-settings
│   │   ├── database.py        # SQLAlchemy engine supporting Neon PostgreSQL & SQLite
│   │   └── main.py            # FastAPI entrypoint with CORS & table initialization
│   ├── database/
│   │   └── seed.py            # 32 Indian destinations, 120+ attractions, regional foods, and demo user
│   ├── requirements.txt       # Python dependencies
│   ├── test_api.py            # Automated API integration test suite
│   ├── .env.example           # Backend environment template
│   └── .env                   # Local backend configuration
├── frontend/
│   ├── src/
│   │   ├── api/               # Centralized Axios client and API modules
│   │   ├── components/        # Navbar, Footer, HeroSection, DestinationCard, FilterPanel, TripWizard, RecommendationCard, ItineraryTimeline, ActivityCard, BudgetBreakdown, WeatherCard, MapView, FoodCard, ShareModal, LoadingSkeleton, EmptyState
│   │   ├── context/           # AuthContext (with Demo login) & ToastContext
│   │   ├── pages/             # LandingPage, ExplorePage, DestinationDetailPage, PlanWizardPage, RecommendationResultsPage, ItineraryViewPage, DashboardPage, MyTripsPage, LoginPage, RegisterPage, ProfilePage
│   │   ├── types/             # TypeScript interfaces for destinations, itineraries, budgets, and users
│   │   ├── App.tsx            # Main routes & protected route wrapper
│   │   ├── main.tsx           # React root
│   │   └── index.css          # Tailwind CSS directives & custom styles
│   ├── tailwind.config.js     # Luxury Indian travel color tokens
│   ├── package.json           # Frontend dependencies
│   ├── .env.example           # Frontend environment template
│   └── .env                   # Local frontend configuration
└── README.md
```

---

## Getting Started Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

---

### Step 1: Backend Setup

1. Open a terminal in the project root:
   ```bash
   cd "backend"
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `backend/.env`:
   ```env
   # Leave as SQLite or paste your Neon PostgreSQL connection string:
   # Example Neon: postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/yatraplan?sslmode=require
   DATABASE_URL=sqlite:///./yatraplan.db

   JWT_SECRET=yatraplan_super_secret_jwt_key_india_travel_2025_secure
   ACCESS_TOKEN_EXPIRE_MINUTES=10080

   # Optional 3rd-party keys (leave empty to use rich built-in profiles):
   WEATHER_API_KEY=
   MAP_API_KEY=

   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

5. Seed the database with 32 Indian destinations, 120+ attractions, regional foods, and the demo user:
   ```bash
   python database/seed.py
   ```

6. Run the automated backend integration tests:
   ```bash
   python test_api.py
   ```

7. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   API interactive documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### Step 2: Frontend Setup

1. In a new terminal window, navigate to `frontend/`:
   ```bash
   cd "frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:5173](http://localhost:5173).

---

## Demo Account Credentials

For quick evaluation, use the one-click demo login button or enter:
- **Email**: `demo@yatraplan.com`
- **Password**: `yatra12345`

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Fetch current user profile |
| `PUT` | `/api/auth/profile` | Update profile preferences and home city |
| `GET` | `/api/destinations` | List destinations with state, budget, and mood filters |
| `GET` | `/api/destinations/{id}` | Single destination with attractions and foods |
| `GET` | `/api/destinations/states` | List all unique Indian states available |
| `POST` | `/api/recommendations` | Submit trip preferences to get scored top 5 destinations with explanations |
| `POST` | `/api/itinerary/generate` | Generate smart, geographically clustered day-by-day itinerary |
| `POST` | `/api/budget/calculate` | Calculate itemized budget breakdown |
| `GET` | `/api/weather/{destination}`| Real-time weather and 5-day forecast |
| `GET` | `/api/foods/{destination}` | Regional delicacies and famous food spots |
| `GET` | `/api/attractions/{destination}` | All attractions with regional clusters |
| `POST` | `/api/trips` | Save trip itinerary to user profile |
| `GET` | `/api/trips` | List user's saved trips |
| `GET` | `/api/trips/{id}` | Retrieve saved trip by ID |
| `PUT` | `/api/trips/{id}` | Update trip title, status, or itinerary |
| `POST` | `/api/trips/{id}/duplicate`| Duplicate an existing saved trip |
| `DELETE` | `/api/trips/{id}` | Delete a saved trip |

---

## Neon PostgreSQL Deployment

To connect directly to Neon PostgreSQL in production or cloud environments:
1. Create a database instance on [Neon.tech](https://neon.tech).
2. Copy the connection string (format: `postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require`).
3. Set `DATABASE_URL` in your environment or hosting provider (Render, Railway, Fly.io, Vercel).
4. Run `python database/seed.py` once to seed the Neon database.
5. The application automatically configures SSL mode and connection pooling for Neon.
