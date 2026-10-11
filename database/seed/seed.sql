-- ========================================================
-- JobShield AI - Seed Data (PostgreSQL / Relational)
-- ========================================================

-- Insert Demo Users (Passwords hashed via PBKDF2/argon2 standard)
INSERT INTO users_user (id, name, email, password, role, is_active, is_staff, is_superuser, created_at, updated_at)
VALUES 
(1, 'Alex Rivera', 'analyst@jobshield.ai', 'pbkdf2_sha256$870000$Wv9e$Y5eP...', 'USER', TRUE, FALSE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Platform Administrator', 'admin@jobshield.ai', 'pbkdf2_sha256$870000$Wv9e$Y5eP...', 'ADMIN', TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert Benchmark Sample Jobs
INSERT INTO analysis_jobanalysis (id, user_id, job_title, company_name, job_description, salary_min, salary_max, currency, location, employment_type, experience, company_website, recruiter_name, recruiter_email, job_portal, created_at)
VALUES 
(1, 1, 'Senior Python Backend Engineer', 'Stripe, Inc.', 'We are looking for a Senior Python Developer with strong Django, PostgreSQL, and AWS experience...', 135000, 160000, 'USD', 'San Francisco, CA', 'Full-time', '5+ years', 'https://stripe.com', 'Elena Vance', 'recruiting@stripe.com', 'LinkedIn', CURRENT_TIMESTAMP),
(2, 1, 'Work From Home Data Entry Assistant', 'Apex Worldwide Consultants', 'URGENT HIRING! Registration fee of $150 via wire transfer required...', 85000, 120000, 'USD', 'Remote', 'Full-time', 'No experience', 'http://apex-jobs-free.xyz', 'Mark Smith', 'apex.consulting@gmail.com', 'Telegram', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
