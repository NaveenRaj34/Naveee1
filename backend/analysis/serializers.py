"""
JobShield AI - Analysis Serializers
"""
from rest_framework import serializers
from .models import (
    JobAnalysis, MLResult, RiskAnalysis, RiskFactor,
    CompanyVerification, RecruiterVerification, SalaryAnalysis,
    Recommendation, Report
)

class MLResultSerializer(serializers.ModelSerializer):
    is_fallback = serializers.SerializerMethodField()
    model_status = serializers.SerializerMethodField()

    class Meta:
        model = MLResult
        fields = ['id', 'prediction', 'confidence', 'model_version', 'model_name', 'is_fallback', 'model_status', 'created_at']

    def get_is_fallback(self, obj):
        return 'fallback' in (obj.model_name or '').lower()

    def get_model_status(self, obj):
        if 'fallback' in (obj.model_name or '').lower():
            return 'Development Fallback Heuristic'
        return 'Production ML Model (Random Forest)'

class RiskAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAnalysis
        fields = ['id', 'risk_score', 'risk_level', 'created_at']

class RiskFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskFactor
        fields = ['id', 'factor_name', 'factor_type', 'severity', 'score_contribution', 'explanation']

class CompanyVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyVerification
        fields = ['id', 'website', 'https_status', 'domain_status', 'trust_status', 'explanation']

class RecruiterVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterVerification
        fields = ['id', 'recruiter_email', 'email_domain', 'company_domain', 'domain_match', 'trust_status', 'explanation']

class SalaryAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryAnalysis
        fields = ['id', 'min_salary', 'max_salary', 'anomaly_status', 'risk_level', 'explanation']

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ['id', 'title', 'recommendation', 'severity']

class JobAnalysisDetailSerializer(serializers.ModelSerializer):
    ml_result = MLResultSerializer(read_only=True)
    risk_analysis = RiskAnalysisSerializer(read_only=True)
    risk_factors = RiskFactorSerializer(many=True, read_only=True)
    company_verification = CompanyVerificationSerializer(read_only=True)
    recruiter_verification = RecruiterVerificationSerializer(read_only=True)
    salary_analysis = SalaryAnalysisSerializer(read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)
    
    # Flattened top-level helpers for quick frontend consumption
    prediction = serializers.SerializerMethodField()
    confidence = serializers.SerializerMethodField()
    risk_score = serializers.SerializerMethodField()
    risk_level = serializers.SerializerMethodField()

    class Meta:
        model = JobAnalysis
        fields = [
            'id', 'user', 'job_title', 'company_name', 'job_description',
            'salary_min', 'salary_max', 'currency', 'location',
            'employment_type', 'experience', 'company_website',
            'recruiter_name', 'recruiter_email', 'job_portal',
            'job_url', 'contact_number', 'additional_notes', 'created_at',
            'prediction', 'confidence', 'risk_score', 'risk_level',
            'ml_result', 'risk_analysis', 'risk_factors',
            'company_verification', 'recruiter_verification',
            'salary_analysis', 'recommendations'
        ]

    def get_prediction(self, obj):
        return obj.ml_result.prediction if hasattr(obj, 'ml_result') else 'N/A'

    def get_confidence(self, obj):
        return obj.ml_result.confidence if hasattr(obj, 'ml_result') else 0.0

    def get_risk_score(self, obj):
        return obj.risk_analysis.risk_score if hasattr(obj, 'risk_analysis') else 0

    def get_risk_level(self, obj):
        return obj.risk_analysis.risk_level if hasattr(obj, 'risk_analysis') else 'Low'

class JobAnalysisListSerializer(serializers.ModelSerializer):
    prediction = serializers.SerializerMethodField()
    risk_score = serializers.SerializerMethodField()
    risk_level = serializers.SerializerMethodField()

    class Meta:
        model = JobAnalysis
        fields = [
            'id', 'job_title', 'company_name', 'created_at',
            'prediction', 'risk_score', 'risk_level'
        ]

    def get_prediction(self, obj):
        return obj.ml_result.prediction if hasattr(obj, 'ml_result') else 'N/A'

    def get_risk_score(self, obj):
        return obj.risk_analysis.risk_score if hasattr(obj, 'risk_analysis') else 0

    def get_risk_level(self, obj):
        return obj.risk_analysis.risk_level if hasattr(obj, 'risk_analysis') else 'Low'

class JobAnalysisCreateSerializer(serializers.Serializer):
    job_title = serializers.CharField(max_length=255, required=True)
    company_name = serializers.CharField(max_length=255, required=True)
    job_description = serializers.CharField(required=True, min_length=20)
    salary_min = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    salary_max = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    currency = serializers.CharField(max_length=10, default='USD', required=False)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    employment_type = serializers.CharField(max_length=100, required=False, allow_blank=True, default='Full-time')
    experience = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    company_website = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    recruiter_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    recruiter_email = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    job_portal = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    job_url = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    contact_number = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    additional_notes = serializers.CharField(required=False, allow_blank=True, default='')
