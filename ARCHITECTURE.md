# JobShield AI - System Architecture

## 1. High-Level System Architecture

JobShield AI is an enterprise-grade AI-powered employment cybersecurity and job scam detection platform. It is engineered with a decoupled multi-layer architecture separating presentation, API orchestration, machine learning inference, entity verification, and persistence.

```mermaid
flowchart TD
    User["Job Seeker / Security Analyst"] -->|Web Browser| Frontend["React.js + Vite Frontend (Tailwind CSS, Recharts)"]
    Frontend -->|REST APIs (JWT Auth)| Backend["Django REST Framework Core API"]
    
    subgraph Core Processing Pipeline
        Backend --> Preprocessing["NLP Text Preprocessor (clean_text, tokens)"]
        Preprocessing --> ML["TF-IDF Vectorizer + Random Forest Classifier"]
        Backend --> KeywordEngine["Scam Indicator Engine (4 Categories)"]
        Backend --> CompVerifier["Company Website Verifier (HTTPS, Domain Syntax, Reachability)"]
        Backend --> RecVerifier["Recruiter Email Verifier (Domain Cross-Correlation)"]
        Backend --> SalaryAnalyzer["Rule-Based Salary Anomaly Analyzer"]
        
        ML --> RiskEngine["Composite Risk Scoring Engine (0-100)"]
        KeywordEngine --> RiskEngine
        CompVerifier --> RiskEngine
        RecVerifier --> RiskEngine
        SalaryAnalyzer --> RiskEngine
        
        RiskEngine --> XAI["Explainable AI & Dynamic Safety Recommendations"]
    end
    
    XAI --> DB[("PostgreSQL / Relational Database")]
    XAI --> PDFGen["ReportLab PDF Dossier Generator"]
    DB --> Backend
    Backend -->|Standardized JSON| Frontend
```

---

## 2. End-to-End Processing Pipeline

1. **Job Posting Input**: Job seeker submits the job title, company name, raw job description, salary range, company website, recruiter contact, and employment metadata.
2. **Input Validation**: DRF serializers validate schema boundaries, ensuring the description meets minimum semantic length thresholds.
3. **NLP Preprocessing**: Text is converted to lowercase, URLs/emails are normalized to canonical semantic tokens, punctuation is cleaned, and stopwords are filtered out.
4. **TF-IDF & Random Forest Inference**: The cleaned composite string is transformed via a 3,000-feature TF-IDF matrix (1-2 n-grams) and classified via an ensemble Random Forest model to produce class probability (`p_genuine`, `p_scam`).
5. **Scam Indicator Pattern Matching**: Text is scanned for high-risk phrases across four predatory categories:
   - *Payment Requests* (registration fees, starter kits, advance checks)
   - *Sensitive Identity Requests* (bank routing numbers, OTPs, SSN)
   - *Deceptive Unrealistic Claims* (instant hire without interview, earn $5,000/week)
   - *Urgent Pressure Language* (immediate joining, limited spots)
6. **Company Web Presence Verification**: Validates whether the website implements secure HTTPS, verifies top-level domain reputation (checking for throwaway TLDs like `.xyz` or free web hosts), and conducts real-time HTTP reachability tests with non-blocking timeouts.
7. **Recruiter Identity Cross-Correlation**: Compares the recruiter email domain against the verified company website domain. Flags discrepancies (corporate impersonation) and highlights free email providers (`@gmail.com`, `@yahoo.com`) as risk factors.
8. **Salary Anomaly Analysis**: Conducts heuristic boundary analysis comparing advertised wage to experience requirements, detecting excessive spreads or impossible hourly claims.
9. **Composite Risk Engine**: Synthesizes all signals into an aggregate **0–100 Risk Score** mapped into four distinct risk tiers (`Low`, `Moderate`, `High`, `Critical`), ensuring every score has traceable additive contributing factors.
10. **Explainable AI (XAI)**: Generates human-understandable evidence traces ("Why did the system give this result?") and formulates dynamic safety recommendations.
11. **Dossier Archiving & Export**: Persists the complete audit trail to the relational database and compiles a downloadable PDF report.

---

## 3. Frontend Architecture

- **Technology**: React 18, Vite 6, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React.
- **Design System**: Cybersecurity SaaS palette featuring deep navy background (`#070b14`), cyan accents (`#38bdf8`), risk-coded visual indicators (safe green, warning amber, critical red), and dynamic SVG circular risk gauges.
- **State & Authentication**: `AuthContext` provides global session state, persisting access and refresh tokens in `localStorage`.
- **API Communication**: Centralized Axios client (`services/api.js`) featuring automatic JWT injection, error interceptors, and non-blocking token refresh mechanisms.

---

## 4. Backend Architecture

- **Framework**: Django 5+ & Django REST Framework (DRF).
- **Modularity**:
  - `users`: User identity, authentication, profile management, and RBAC (`USER` vs `ADMIN`).
  - `analysis`: Core data models, serializers, scoring, keyword scanning, and salary heuristics.
  - `verification`: Domain verification and recruiter identity cross-checking.
  - `ml_engine`: NLP preprocessing, model serialization, cached singleton prediction.
  - `reports`: Executive PDF generation using ReportLab.
  - `api`: URL routing, standardized exception handling, and dashboard analytics.

---

## 5. Security Posture

- **Password Hashing**: PBKDF2 with SHA-256 (Django default cryptographic standard).
- **Session Tokens**: JWT authentication with short-lived access tokens and refresh rotation.
- **SQL Injection Prevention**: 100% parameterization through Django Object-Relational Mapping (ORM).
- **Cross-Origin Resource Sharing (CORS)**: Configurable origins preventing unauthorized cross-origin requests.
- **XSS Mitigation**: React virtual DOM auto-escaping on frontend and DRF sanitized JSON responses.
- **No Plaintext Secrets**: All sensitive secrets isolated in environment variables.
