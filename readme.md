# JobShield AI
> **AI-Powered Job Scam Detection and Risk Analysis Platform**  
> *"Detect. Verify. Stay Safe."*

JobShield AI is an intelligent full-stack cybersecurity web application designed to help job seekers detect deceptive employment opportunities, verify recruiter authenticity, analyze digital footprints, and receive explainable, evidence-backed risk scores before applying.

---

## 🎯 Project Objective

Online employment fraud has escalated dramatically—ranging from advance equipment check scams and refundable registration fee extortion to corporate impersonation and identity theft. Traditional scam detection tools either rely on basic keyword blocklists or generate opaque binary outputs ("Fake" vs "Real") without transparency.

JobShield AI solves this problem by combining:
1. **NLP & Machine Learning**: TF-IDF vectorization + Random Forest Classifier trained on job listings.
2. **Company Verification**: Real-time HTTPS protocol inspection, domain age heuristics, and digital presence validation.
3. **Recruiter Identity Correlation**: Cross-referencing recruiter email domains against corporate company domains to flag impersonation.
4. **Salary Anomaly Engine**: Rule-based heuristic analysis detecting inverted salary bounds and unrealistic entry-level wages.
5. **Configurable Keyword Engine**: Scanning predatory phrase categories (Payment Requests, Sensitive Identity Harvesting, Unrealistic Claims, Artificial Urgency).
6. **Composite Risk Engine**: Computing an aggregate **0–100 Risk Score** categorized into 4 tiers with traceable factors.
7. **Explainable AI (XAI)**: Explicit human-readable reasons answering *"Why did the system give this result?"* with dynamic safety recommendations.
8. **Exportable PDF Dossiers**: Executive cybersecurity report generation via ReportLab.

---

## 🚀 Key Features

- **Modern Cyber SaaS UI**: Dark-mode glassmorphic interface inspired by security platforms like CrowdStrike and Cloudflare.
- **Interactive Risk Gauge**: Dynamic SVG circular gauge with animated score transitions and risk levels (`Low`, `Moderate`, `High`, `Critical`).
- **One-Click Test Presets**: Pre-configured sample jobs in the `/analyze` UI (Genuine tech job, Critical fee scam, Recruiter domain mismatch, High salary scam).
- **Executive PDF Reports**: Generates formal, downloadable PDF threat assessments with traceable scores and recommendations.
- **Audit History & Search**: Full historical database of analyzed jobs with risk level filtering, keyword search, and pagination.
- **Admin Control Plane**: Specialized dashboard for platform administrators visualizing system-wide metrics, common indicators, and telemetry.
- **Secure JWT Authentication**: Access and refresh token rotation with role-based access control (`USER` vs `ADMIN`).

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js (v18) + Vite (v6)
- **Styling**: Tailwind CSS (Dark Cyber SaaS theme)
- **Routing**: React Router (v6)
- **Data Visualizations**: Recharts (Pie charts, Area trends, Bar charts)
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized JWT interceptors

### Backend
- **Language**: Python 3.10+
- **Framework**: Django 5+ & Django REST Framework (DRF)
- **Authentication**: `djangorestframework-simplejwt`
- **PDF Generation**: `reportlab`
- **CORS & Middleware**: `django-cors-headers`

### Machine Learning & NLP
- **Libraries**: `scikit-learn`, `pandas`, `NumPy`, `joblib`
- **Feature Extraction**: TF-IDF Vectorizer (`ngram_range=(1,2)`, `max_features=3000`)
- **Classifier**: Random Forest Classifier (`n_estimators=100`, `random_state=42`)
- **Preprocessing**: Custom regex tokenization, URL/email normalization, and stopwords filtering

### Database
- **Primary**: PostgreSQL (with automatic zero-friction SQLite fallback for local development)
- **ORM**: Django ORM with compound indexing and foreign key constraints

---

## 📁 Monorepo Folder Structure

```
jobshield-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, RiskGauge, VerificationCard, etc.)
│   │   ├── pages/           # Landing, Dashboard, Analyze, Result, History, Admin
│   │   ├── context/         # AuthContext with session persistence
│   │   ├── services/        # Centralized Axios API client
│   │   ├── App.jsx          # Protected route declarations
│   │   └── main.jsx         # React root DOM mount
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/              # Django settings, URLs, WSGI
│   ├── users/               # Custom User model, JWT views, serializers
│   ├── analysis/            # Models, scoring engine, keyword scanner, seed command
│   ├── verification/        # Company & recruiter verification services
│   ├── reports/             # ReportLab PDF generator
│   └── api/                 # DRF routes, views, custom exception handler, tests
│
├── ml/
│   ├── datasets/            # Curated job posting dataset (CSV)
│   ├── preprocessing/       # NLP text cleaner & tokenizer
│   ├── training/            # Model training script
│   ├── models/              # Serialized .pkl artifacts and evaluation metrics
│   └── prediction/          # Singleton ML inference engine with fallback
│
├── database/
│   ├── schema/              # PostgreSQL DDL schema.sql
│   └── seed/                # SQL seed.sql script
│
├── docs/                    # Architectural documents
├── train_model.py           # Root training shortcut
├── docker-compose.yml       # Production Docker orchestration
├── .env.example             # Environment configuration template
└── README.md
```

---

## ⚡ Quick Start & Running Instructions

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed demo accounts and jobs
python manage.py seed_data

# Start backend server
python manage.py runserver 127.0.0.1:8000
```
Backend will be live at: `http://localhost:8000/api`

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install node packages
npm install

# Start Vite dev server
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| **Security Analyst** | `analyst@jobshield.ai` | `password123` |
| **Platform Administrator** | `admin@jobshield.ai` | `admin123` |

*(Quick-fill buttons are provided on the Login screen for instant testing during project evaluations).*

---

## 🧪 Testing

Run the complete backend automated test suite:
```bash
cd backend
python manage.py test api
```
Output:
```
Ran 10 tests in 4.2s - OK
```

To test the frontend build:
```bash
cd frontend
npm run build
```

---

## 🐳 Docker Deployment

To launch all three services (PostgreSQL, Django API, React frontend) with a single command:
```bash
docker compose up --build -d
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`
- PostgreSQL: `localhost:5432`

---

## 📜 Documentation Index

- [System Architecture](file:///C:/Users/shyam/.gemini/antigravity-ide/scratch/jobshield-ai/ARCHITECTURE.md)
- [Database Schema & ERD](file:///C:/Users/shyam/.gemini/antigravity-ide/scratch/jobshield-ai/DATABASE.md)
- [REST API Reference](file:///C:/Users/shyam/.gemini/antigravity-ide/scratch/jobshield-ai/API.md)
- [Machine Learning & NLP Guide](file:///C:/Users/shyam/.gemini/antigravity-ide/scratch/jobshield-ai/ML_MODEL.md)
- [Deployment & Production Guide](file:///C:/Users/shyam/.gemini/antigravity-ide/scratch/jobshield-ai/DEPLOYMENT.md)
