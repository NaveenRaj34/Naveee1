# JobShield AI - REST API Documentation

Base URL: `http://localhost:8000/api`

---

## 1. Authentication Endpoints

### `POST /auth/register/`
Registers a new job seeker or security analyst account.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### `POST /auth/login/`
Authenticates a user and issues JWT access and refresh tokens.

**Request Body:**
```json
{
  "email": "analyst@jobshield.ai",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Rivera",
      "email": "analyst@jobshield.ai",
      "role": "USER"
    },
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 2. Job Scam Analysis Pipeline

### `POST /analysis/`
Executes full multi-factor scam analysis on an input job posting.

**Request Body:**
```json
{
  "job_title": "Remote Data Entry Assistant",
  "company_name": "Apex Global Consultants",
  "job_description": "Urgent hiring! Immediate joining. Pay refundable registration fee of $150 via wire transfer.",
  "salary_min": 85000,
  "salary_max": 120000,
  "currency": "USD",
  "location": "Remote",
  "employment_type": "Full-time",
  "experience": "No experience",
  "company_website": "http://apex-jobs-free.xyz",
  "recruiter_name": "Mark Smith",
  "recruiter_email": "apex.hiring.manager@gmail.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Job analysis completed successfully",
  "data": {
    "id": 2,
    "job_title": "Remote Data Entry Assistant",
    "company_name": "Apex Global Consultants",
    "prediction": "Suspicious",
    "confidence": 94.5,
    "risk_score": 88,
    "risk_level": "Critical",
    "ml_result": {
      "prediction": "Suspicious",
      "confidence": 94.5,
      "model_version": "1.0.0",
      "model_name": "JobShield Random Forest Classifier"
    },
    "risk_analysis": {
      "risk_score": 88,
      "risk_level": "Critical"
    },
    "risk_factors": [
      {
        "name": "Payment Request Detected",
        "factor_type": "PAYMENT_INDICATOR",
        "severity": "CRITICAL",
        "score_contribution": 25,
        "explanation": "Job description requires fee or upfront funds ('registration fee'). Legitimate employers never charge candidates."
      },
      {
        "name": "Recruiter Email Domain Discrepancy",
        "factor_type": "IDENTITY_VERIFICATION",
        "severity": "HIGH",
        "score_contribution": 20,
        "explanation": "Recruiter uses free email provider (@gmail.com) instead of claimed corporate domain."
      }
    ],
    "company_verification": {
      "website": "http://apex-jobs-free.xyz",
      "https_status": "Insecure (HTTP)",
      "domain_status": "Suspicious",
      "trust_status": "Suspicious",
      "explanation": "Company website flagged as suspicious: Uses high-risk top-level domain frequently associated with throwaway sites."
    },
    "recruiter_verification": {
      "recruiter_email": "apex.hiring.manager@gmail.com",
      "email_domain": "gmail.com",
      "domain_match": false,
      "trust_status": "Suspicious",
      "explanation": "Recruiter uses free email provider (@gmail.com) instead of claimed corporate domain."
    },
    "salary_analysis": {
      "min_salary": 85000,
      "max_salary": 120000,
      "anomaly_status": "Unusually High For Experience / Unrealistic Claims",
      "risk_level": "High",
      "explanation": "Rule-based salary anomaly analysis: Unusually high salary advertised for entry-level role."
    },
    "explainable_ai": {
      "summary": "CRITICAL RISK: Multiple high-confidence fraud indicators detected.",
      "reasons": [
        "Payment or registration fee language was explicitly detected in the job posting.",
        "Recruiter uses free email provider (@gmail.com) instead of official company domain."
      ]
    }
  }
}
```

---

### `GET /analysis/`
Retrieves paginated analysis history with optional filters.

**Query Parameters:**
- `page`: Page index (default: 1)
- `risk_level`: Filter by `Low`, `Moderate`, `High`, `Critical`
- `prediction`: Filter by `Genuine`, `Suspicious`
- `search`: Case-insensitive search on `company_name` or `job_title`

---

### `GET /reports/<id>/`
Generates and downloads a binary PDF report for the given analysis ID.

**Headers:**
- `Accept`: `application/pdf`

---

## 3. Analytics Endpoints

### `GET /dashboard/stats/`
Returns summary statistics, risk distribution metrics, and recent analyses.

### `GET /admin/stats/`
Requires `role: ADMIN`. Returns global metrics, common risk indicator frequencies, and system-wide audits.
