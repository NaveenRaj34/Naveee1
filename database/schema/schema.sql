-- ========================================================
-- JobShield AI - Relational Database Schema (PostgreSQL)
-- ========================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users_user (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users_user (email);

-- Job Analysis Primary Table
CREATE TABLE IF NOT EXISTS analysis_jobanalysis (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users_user (id) ON DELETE SET NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    salary_min NUMERIC(12, 2) NULL,
    salary_max NUMERIC(12, 2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    location VARCHAR(255) NOT NULL DEFAULT '',
    employment_type VARCHAR(100) NOT NULL DEFAULT '',
    experience VARCHAR(100) NOT NULL DEFAULT '',
    company_website VARCHAR(255) NOT NULL DEFAULT '',
    recruiter_name VARCHAR(150) NOT NULL DEFAULT '',
    recruiter_email VARCHAR(255) NOT NULL DEFAULT '',
    job_portal VARCHAR(100) NOT NULL DEFAULT '',
    job_url VARCHAR(500) NOT NULL DEFAULT '',
    contact_number VARCHAR(50) NOT NULL DEFAULT '',
    additional_notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobanalysis_company_created ON analysis_jobanalysis (company_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobanalysis_title ON analysis_jobanalysis (job_title);

-- Machine Learning Inference Result
CREATE TABLE IF NOT EXISTS analysis_mlresult (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT UNIQUE NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    prediction VARCHAR(50) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    model_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    model_name VARCHAR(150) NOT NULL DEFAULT 'JobShield Random Forest Classifier',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Aggregate Risk Analysis
CREATE TABLE IF NOT EXISTS analysis_riskanalysis (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT UNIQUE NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_riskanalysis_score ON analysis_riskanalysis (risk_score);
CREATE INDEX IF NOT EXISTS idx_riskanalysis_level ON analysis_riskanalysis (risk_level);

-- Traceable Contributing Factors
CREATE TABLE IF NOT EXISTS analysis_riskfactor (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    factor_name VARCHAR(255) NOT NULL,
    factor_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    score_contribution INTEGER NOT NULL,
    explanation TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_riskfactor_analysis ON analysis_riskfactor (analysis_id);

-- Company Verification Status
CREATE TABLE IF NOT EXISTS analysis_companyverification (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT UNIQUE NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    website VARCHAR(255) NOT NULL DEFAULT '',
    https_status VARCHAR(50) NOT NULL DEFAULT '',
    domain_status VARCHAR(50) NOT NULL DEFAULT '',
    trust_status VARCHAR(50) NOT NULL,
    explanation TEXT NOT NULL
);

-- Recruiter Verification Status
CREATE TABLE IF NOT EXISTS analysis_recruiterverification (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT UNIQUE NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    recruiter_email VARCHAR(255) NOT NULL DEFAULT '',
    email_domain VARCHAR(255) NOT NULL DEFAULT '',
    company_domain VARCHAR(255) NOT NULL DEFAULT '',
    domain_match BOOLEAN NOT NULL DEFAULT FALSE,
    trust_status VARCHAR(50) NOT NULL,
    explanation TEXT NOT NULL
);

-- Salary Anomaly Analysis
CREATE TABLE IF NOT EXISTS analysis_salaryanalysis (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT UNIQUE NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    min_salary DOUBLE PRECISION NULL,
    max_salary DOUBLE PRECISION NULL,
    anomaly_status VARCHAR(100) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    explanation TEXT NOT NULL
);

-- Actionable Safety Recommendations
CREATE TABLE IF NOT EXISTS analysis_recommendation (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Safety Advisory',
    recommendation TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO'
);

-- Exported Security Report
CREATE TABLE IF NOT EXISTS analysis_report (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT UNIQUE NOT NULL REFERENCES analysis_jobanalysis (id) ON DELETE CASCADE,
    report_path VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
