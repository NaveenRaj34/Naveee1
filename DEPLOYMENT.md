# JobShield AI - Deployment Guide

## 1. Local Development Setup

### Prerequisites
- Python 3.10+ (Tested up to Python 3.14)
- Node.js 18+ (Tested on Node.js v24)
- npm 9+

---

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed demonstration accounts and jobs
python manage.py seed_data

# Start backend server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be accessible at: `http://localhost:8000/api`

---

### Step 2: Model Training (Optional - Pre-Trained Artifacts Included)
From the project root:
```bash
python train_model.py
```
This generates the model files in `ml/models/`.

---

### Step 3: Frontend Setup
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:5173`

---

## 2. Docker & Containerized Deployment

JobShield AI includes a production-ready `docker-compose.yml` orchestrating PostgreSQL, the Django backend, and the React frontend.

```bash
# From project root
docker compose up --build -d
```

### Services Started:
- `jobshield_postgres`: PostgreSQL 16 on port `5432`
- `jobshield_backend`: Django REST API on port `8000`
- `jobshield_frontend`: React Frontend on port `5173`

To inspect container health:
```bash
docker compose ps
docker compose logs -f backend
```

---

## 3. Production Deployment Hardening

1. **Environment Variables**: Set `DEBUG=False` and supply a secure `SECRET_KEY` in production.
2. **Reverse Proxy (Nginx)**: Configure Nginx to terminate SSL/TLS (HTTPS) and reverse-proxy traffic to Gunicorn on port 8000 and the static frontend build.
3. **Database**: Utilize managed PostgreSQL (e.g., AWS RDS, Supabase, or dedicated Docker container) with connection pooling.
4. **Static Assets**: Run `python manage.py collectstatic` to bundle admin and DRF assets.
