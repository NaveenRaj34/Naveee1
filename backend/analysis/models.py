"""
JobShield AI - Relational Database Models
Models for Job Postings, ML Predictions, Risk Analyses, Verifications, and Reports.
"""
from django.db import models
from django.conf import settings
from django.utils import timezone

class JobAnalysis(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='analyses'
    )
    job_title = models.CharField(max_length=255, db_index=True)
    company_name = models.CharField(max_length=255, db_index=True)
    job_description = models.TextField()
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    location = models.CharField(max_length=255, blank=True, default='')
    employment_type = models.CharField(max_length=100, blank=True, default='')
    experience = models.CharField(max_length=100, blank=True, default='')
    company_website = models.CharField(max_length=255, blank=True, default='')
    recruiter_name = models.CharField(max_length=150, blank=True, default='')
    recruiter_email = models.CharField(max_length=255, blank=True, default='')
    job_portal = models.CharField(max_length=100, blank=True, default='')
    job_url = models.URLField(max_length=500, blank=True, default='')
    contact_number = models.CharField(max_length=50, blank=True, default='')
    additional_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company_name', 'created_at']),
            models.Index(fields=['job_title']),
        ]

    def __str__(self):
        return f"[{self.id}] {self.job_title} @ {self.company_name}"

class MLResult(models.Model):
    analysis = models.OneToOneField(JobAnalysis, on_delete=models.CASCADE, related_name='ml_result')
    prediction = models.CharField(max_length=50) # 'Genuine' or 'Suspicious'
    confidence = models.FloatField() # 0 to 100
    model_version = models.CharField(max_length=50, default='1.0.0')
    model_name = models.CharField(max_length=150, default='JobShield Random Forest Classifier')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.prediction} ({self.confidence}%) - {self.model_name}"

class RiskAnalysis(models.Model):
    analysis = models.OneToOneField(JobAnalysis, on_delete=models.CASCADE, related_name='risk_analysis')
    risk_score = models.IntegerField(db_index=True) # 0 to 100
    risk_level = models.CharField(max_length=50, db_index=True) # 'Low', 'Moderate', 'High', 'Critical'
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Risk {self.risk_score}/100 ({self.risk_level})"

class RiskFactor(models.Model):
    analysis = models.ForeignKey(JobAnalysis, on_delete=models.CASCADE, related_name='risk_factors')
    factor_name = models.CharField(max_length=255)
    factor_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20) # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    score_contribution = models.IntegerField()
    explanation = models.TextField()

    def __str__(self):
        return f"+{self.score_contribution} | {self.factor_name} ({self.severity})"

class CompanyVerification(models.Model):
    analysis = models.OneToOneField(JobAnalysis, on_delete=models.CASCADE, related_name='company_verification')
    website = models.CharField(max_length=255, blank=True)
    https_status = models.CharField(max_length=50, blank=True)
    domain_status = models.CharField(max_length=50, blank=True)
    trust_status = models.CharField(max_length=50) # 'Verified', 'Suspicious', 'Unable to Verify'
    explanation = models.TextField()

    def __str__(self):
        return f"{self.trust_status} - {self.website}"

class RecruiterVerification(models.Model):
    analysis = models.OneToOneField(JobAnalysis, on_delete=models.CASCADE, related_name='recruiter_verification')
    recruiter_email = models.CharField(max_length=255, blank=True)
    email_domain = models.CharField(max_length=255, blank=True)
    company_domain = models.CharField(max_length=255, blank=True)
    domain_match = models.BooleanField(default=False)
    trust_status = models.CharField(max_length=50)
    explanation = models.TextField()

    def __str__(self):
        return f"{self.trust_status} - {self.recruiter_email}"

class SalaryAnalysis(models.Model):
    analysis = models.OneToOneField(JobAnalysis, on_delete=models.CASCADE, related_name='salary_analysis')
    min_salary = models.FloatField(null=True, blank=True)
    max_salary = models.FloatField(null=True, blank=True)
    anomaly_status = models.CharField(max_length=100)
    risk_level = models.CharField(max_length=50)
    explanation = models.TextField()

    def __str__(self):
        return f"Salary Risk: {self.risk_level} ({self.anomaly_status})"

class Recommendation(models.Model):
    analysis = models.ForeignKey(JobAnalysis, on_delete=models.CASCADE, related_name='recommendations')
    title = models.CharField(max_length=255, default='Safety Advisory')
    recommendation = models.TextField()
    severity = models.CharField(max_length=20, default='INFO')

    def __str__(self):
        return f"[{self.severity}] {self.title}"

class Report(models.Model):
    analysis = models.OneToOneField(JobAnalysis, on_delete=models.CASCADE, related_name='report')
    report_path = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Report #{self.id} for Analysis #{self.analysis_id}"
