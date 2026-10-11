"""
JobShield AI - REST API URL Routes
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView,
    JobAnalysisView, JobAnalysisDetailView,
    CompanyVerificationView, RecruiterVerificationView,
    MLPredictView, RiskCalculateView,
    ReportGenerateView, ReportDownloadView,
    DashboardStatsView, AdminStatsView
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    # User Profile
    path('user/profile/', ProfileView.as_view(), name='profile'),

    # Analysis Pipeline & History
    path('analysis/', JobAnalysisView.as_view(), name='analysis-list-create'),
    path('analysis/<int:pk>/', JobAnalysisDetailView.as_view(), name='analysis-detail'),

    # Modular Verifications
    path('verification/company/', CompanyVerificationView.as_view(), name='verify-company'),
    path('verification/recruiter/', RecruiterVerificationView.as_view(), name='verify-recruiter'),

    # Machine Learning & Risk Engine
    path('ml/predict/', MLPredictView.as_view(), name='ml-predict'),
    path('risk/calculate/', RiskCalculateView.as_view(), name='risk-calculate'),

    # Reports
    path('reports/generate/', ReportGenerateView.as_view(), name='report-generate'),
    path('reports/<int:pk>/', ReportDownloadView.as_view(), name='report-download'),

    # Dashboards
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]
