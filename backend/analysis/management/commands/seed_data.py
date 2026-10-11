"""
JobShield AI - Database Seeding Command
Usage: python manage.py seed_data
Populates realistic demonstration accounts, job analyses, risk evaluations, and statistics.
"""
from django.core.management.base import BaseCommand
from users.models import User
from analysis.models import (
    JobAnalysis, MLResult, RiskAnalysis, RiskFactor,
    CompanyVerification, RecruiterVerification, SalaryAnalysis,
    Recommendation
)

class Command(BaseCommand):
    help = "Seeds database with demo users, realistic job analyses, and sample risk assessments."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding JobShield AI database...")

        # 1. Create Demo Users
        admin_user, _ = User.objects.get_or_create(
            email="admin@jobshield.ai",
            defaults={
                "name": "Platform Administrator",
                "role": "ADMIN",
                "is_staff": True,
                "is_superuser": True
            }
        )
        admin_user.set_password("admin123")
        admin_user.save()

        analyst_user, _ = User.objects.get_or_create(
            email="analyst@jobshield.ai",
            defaults={
                "name": "Alex Rivera",
                "role": "USER"
            }
        )
        analyst_user.set_password("password123")
        analyst_user.save()

        self.stdout.write(self.style.SUCCESS("Demo users created/updated: analyst@jobshield.ai (password123), admin@jobshield.ai (admin123)"))

        # Clear existing seed data if needed or skip if exists
        if JobAnalysis.objects.filter(job_title="Senior Python Backend Engineer").exists():
            self.stdout.write("Sample jobs already exist. Skipping duplicate seed creation.")
            return

        # 2. Sample 1: Genuine Safe Job
        job1 = JobAnalysis.objects.create(
            user=analyst_user,
            job_title="Senior Python Backend Engineer",
            company_name="Stripe, Inc.",
            job_description="We are looking for a Senior Python Developer with strong Django, PostgreSQL, and AWS experience. You will architect high-throughput APIs, lead system design discussions, and mentor junior engineers in a collaborative engineering culture.",
            salary_min=135000,
            salary_max=160000,
            currency="USD",
            location="San Francisco, CA",
            employment_type="Full-time",
            experience="5+ years",
            company_website="https://stripe.com",
            recruiter_name="Elena Vance",
            recruiter_email="recruiting@stripe.com",
            job_portal="LinkedIn"
        )
        MLResult.objects.create(
            analysis=job1,
            prediction="Genuine",
            confidence=95.2,
            model_version="1.0.0",
            model_name="JobShield Random Forest Classifier"
        )
        RiskAnalysis.objects.create(
            analysis=job1,
            risk_score=10,
            risk_level="Low"
        )
        CompanyVerification.objects.create(
            analysis=job1,
            website="https://stripe.com",
            https_status="Secure (HTTPS)",
            domain_status="Active",
            trust_status="Verified",
            explanation="Company domain 'stripe.com' is active, securely delivered via HTTPS, and accessible."
        )
        RecruiterVerification.objects.create(
            analysis=job1,
            recruiter_email="recruiting@stripe.com",
            email_domain="stripe.com",
            company_domain="stripe.com",
            domain_match=True,
            trust_status="Verified",
            explanation="Recruiter email domain '@stripe.com' matches company domain 'stripe.com'."
        )
        SalaryAnalysis.objects.create(
            analysis=job1,
            min_salary=135000,
            max_salary=160000,
            anomaly_status="Normal / Expected Range",
            risk_level="Low",
            explanation="Rule-based salary anomaly analysis: Advertised compensation is within standard structural ranges for role requirements."
        )
        Recommendation.objects.create(
            analysis=job1,
            title="Standard Application Precautions",
            recommendation="Review employment contracts and equity terms as standard procedure.",
            severity="LOW"
        )

        # 3. Sample 2: Critical Scam with Registration Fee & Free Mail
        job2 = JobAnalysis.objects.create(
            user=analyst_user,
            job_title="URGENT: Work From Home Data Entry Assistant - Instant Hire!",
            company_name="Apex Worldwide Business Consulting",
            job_description="URGENT HIRING! Immediate joining available. Earn $45/hour from home with no prior experience needed! High weekly guaranteed payout. To register your position and receive your company equipment, a one-time refundable registration fee of $150 must be sent via wire transfer or gift card immediately. Limited spots remaining! Apply now!",
            salary_min=85000,
            salary_max=120000,
            currency="USD",
            location="Remote",
            employment_type="Full-time",
            experience="No experience",
            company_website="http://apex-jobs-free.xyz",
            recruiter_name="Mark Smith",
            recruiter_email="apex.consulting.recruiter@gmail.com",
            job_portal="Telegram"
        )
        MLResult.objects.create(
            analysis=job2,
            prediction="Suspicious",
            confidence=94.5,
            model_version="1.0.0",
            model_name="JobShield Random Forest Classifier"
        )
        RiskAnalysis.objects.create(
            analysis=job2,
            risk_score=88,
            risk_level="Critical"
        )
        RiskFactor.objects.create(
            analysis=job2,
            factor_name="Payment Request Detected",
            factor_type="PAYMENT_INDICATOR",
            severity="CRITICAL",
            score_contribution=25,
            explanation="Job description explicitly demands a refundable registration fee of $150 via wire transfer or gift cards."
        )
        RiskFactor.objects.create(
            analysis=job2,
            factor_name="Recruiter Email Domain Discrepancy",
            factor_type="IDENTITY_VERIFICATION",
            severity="HIGH",
            score_contribution=20,
            explanation="Recruiter corresponds via free public Gmail (@gmail.com) rather than enterprise corporate domain."
        )
        RiskFactor.objects.create(
            analysis=job2,
            factor_name="Company Website Trust Risk",
            factor_type="COMPANY_VERIFICATION",
            severity="HIGH",
            score_contribution=18,
            explanation="Website uses insecure HTTP and high-risk '.xyz' TLD frequently used in disposable scam websites."
        )
        RiskFactor.objects.create(
            analysis=job2,
            factor_name="Salary Anomaly Detected",
            factor_type="SALARY_ANOMALY",
            severity="HIGH",
            score_contribution=15,
            explanation="Unusually exorbitant compensation ($120,000) promised for a no-experience data entry position."
        )
        RiskFactor.objects.create(
            analysis=job2,
            factor_name="Artificial Urgency Language",
            factor_type="PRESSURE_TACTIC",
            severity="LOW",
            score_contribution=10,
            explanation="High-pressure urgent language ('immediate joining', 'limited spots remaining', 'apply now') detected."
        )
        CompanyVerification.objects.create(
            analysis=job2,
            website="http://apex-jobs-free.xyz",
            https_status="Insecure (HTTP)",
            domain_status="Suspicious",
            trust_status="Suspicious",
            explanation="Company website flagged as suspicious: Uses high-risk top-level domain frequently associated with throwaway sites."
        )
        RecruiterVerification.objects.create(
            analysis=job2,
            recruiter_email="apex.consulting.recruiter@gmail.com",
            email_domain="gmail.com",
            company_domain="apex-jobs-free.xyz",
            domain_match=False,
            trust_status="Suspicious",
            explanation="Recruiter uses free email provider (@gmail.com) instead of claimed corporate domain."
        )
        SalaryAnalysis.objects.create(
            analysis=job2,
            min_salary=85000,
            max_salary=120000,
            anomaly_status="Unusually High For Experience / Unrealistic Claims",
            risk_level="High",
            explanation="Rule-based salary anomaly analysis: Unusually high salary ($120,000) advertised for entry-level or no-experience role."
        )
        Recommendation.objects.create(
            analysis=job2,
            title="Do Not Send Money",
            recommendation="Never pay registration, processing, or hardware fees. Real employers furnish all required equipment free of charge.",
            severity="CRITICAL"
        )
        Recommendation.objects.create(
            analysis=job2,
            title="Do Not Share Personal Financial Details",
            recommendation="Never transfer funds or buy gift cards for supposed onboarding deposits.",
            severity="CRITICAL"
        )

        # 4. Sample 3: High Risk Phishing Recruiter Email Mismatch
        job3 = JobAnalysis.objects.create(
            user=analyst_user,
            job_title="Cloud Security Architect",
            company_name="Amazon Web Services",
            job_description="Amazon Web Services is seeking a Cloud Security Architect to design zero-trust multi-cloud security architectures. Send CV for rapid evaluation. Our direct coordinator will schedule an interview.",
            salary_min=150000,
            salary_max=185000,
            currency="USD",
            location="Remote",
            employment_type="Full-time",
            experience="5+ years",
            company_website="https://aws.amazon.com",
            recruiter_name="David Vance",
            recruiter_email="aws.talent.acquisition@gmail.com", # Recruiter mismatch
            job_portal="Indeed"
        )
        MLResult.objects.create(
            analysis=job3,
            prediction="Genuine", # Text is largely normal
            confidence=68.0,
            model_version="1.0.0",
            model_name="JobShield Random Forest Classifier"
        )
        RiskAnalysis.objects.create(
            analysis=job3,
            risk_score=52,
            risk_level="High"
        )
        RiskFactor.objects.create(
            analysis=job3,
            factor_name="Recruiter Email Domain Discrepancy",
            factor_type="IDENTITY_VERIFICATION",
            severity="HIGH",
            score_contribution=22,
            explanation="Recruiter email '@gmail.com' does not match claimed enterprise domain 'amazon.com'."
        )
        CompanyVerification.objects.create(
            analysis=job3,
            website="https://aws.amazon.com",
            https_status="Secure (HTTPS)",
            domain_status="Active",
            trust_status="Verified",
            explanation="Company domain 'aws.amazon.com' is an authentic, active, HTTPS-secured website."
        )
        RecruiterVerification.objects.create(
            analysis=job3,
            recruiter_email="aws.talent.acquisition@gmail.com",
            email_domain="gmail.com",
            company_domain="aws.amazon.com",
            domain_match=False,
            trust_status="Suspicious",
            explanation="Recruiter domain '@gmail.com' does NOT match company website domain 'aws.amazon.com'. Strong indicator of corporate impersonation."
        )
        SalaryAnalysis.objects.create(
            analysis=job3,
            min_salary=150000,
            max_salary=185000,
            anomaly_status="Normal / Expected Range",
            risk_level="Low",
            explanation="Advertised compensation aligns with senior cloud security architecture benchmarks."
        )
        Recommendation.objects.create(
            analysis=job3,
            title="Verify Recruiter Through Official Corporate Careers Site",
            recommendation="Contact AWS recruiting directly via amazon.jobs or check recruiter credentials on LinkedIn to verify authenticity.",
            severity="HIGH"
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded 3 rich demonstration job analyses with complete risk breakdowns!"))
