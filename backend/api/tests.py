"""
JobShield AI - Backend Test Suite
Tests authentication, validation, domain verification, salary analysis,
risk scoring, and end-to-end analysis endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from analysis.models import JobAnalysis
from verification.company_verifier import verify_company_website
from verification.recruiter_verifier import verify_recruiter_email
from analysis.salary_analyzer import analyze_salary
from analysis.keyword_engine import scan_scam_keywords
from analysis.risk_engine import calculate_risk

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123"
        }

    def test_user_registration(self):
        resp = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(resp.data['success'])
        self.assertEqual(resp.data['data']['user']['email'], "jane@example.com")
        self.assertTrue(User.objects.filter(email="jane@example.com").exists())

    def test_user_login(self):
        User.objects.create_user(email="jane@example.com", password="securepassword123", name="Jane")
        login_data = {"email": "jane@example.com", "password": "securepassword123"}
        resp = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data['data'])
        self.assertIn('refresh', resp.data['data'])

    def test_invalid_login(self):
        resp = self.client.post(self.login_url, {"email": "fake@example.com", "password": "wrong"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp.data['success'])

class HeuristicAndVerificationTests(TestCase):
    def test_company_website_verification(self):
        # Empty website
        res_empty = verify_company_website("")
        self.assertEqual(res_empty['trust_status'], 'Unable to Verify')

        # HTTPS website
        res_https = verify_company_website("https://google.com", "Google")
        self.assertEqual(res_https['https_status'], 'Secure (HTTPS)')

        # Suspicious .xyz website
        res_suspicious = verify_company_website("http://fake-jobs.xyz", "Legit Corp")
        self.assertEqual(res_suspicious['trust_status'], 'Suspicious')

    def test_recruiter_email_verification(self):
        # Domain match
        res_match = verify_recruiter_email("jobs@stripe.com", "https://stripe.com")
        self.assertTrue(res_match['domain_match'])
        self.assertEqual(res_match['trust_status'], 'Verified')

        # Free provider flag
        res_free = verify_recruiter_email("jobs@gmail.com", "https://stripe.com")
        self.assertFalse(res_match_free := res_free['domain_match'])
        self.assertTrue(res_free['is_free_provider'])
        self.assertEqual(res_free['trust_status'], 'Suspicious')

    def test_salary_analysis(self):
        # Normal
        res_normal = analyze_salary(100000, 130000, "USD", "3 years", "Developer")
        self.assertEqual(res_normal['salary_risk'], 'Low')

        # Inverted anomaly
        res_inverted = analyze_salary(150000, 80000, "USD", "3 years", "Developer")
        self.assertTrue(any("Inverted salary range" in a for a in res_inverted['anomalies']))

        # Unrealistic entry-level compensation
        res_high_entry = analyze_salary(120000, 160000, "USD", "no experience", "Data Entry")
        self.assertEqual(res_high_entry['salary_risk'], 'High')

    def test_scam_keyword_engine(self):
        text = "Urgent hiring! Immediate joining. Pay refundable registration fee of $150 via wire transfer."
        res = scan_scam_keywords(text)
        self.assertIn("PAYMENT_REQUESTS", res['detected_by_category'])
        self.assertIn("URGENT_LANGUAGE", res['detected_by_category'])
        self.assertGreaterEqual(res['total_indicators_detected'], 2)

    def test_risk_scoring_engine(self):
        ml_res = {"is_scam": True, "confidence": 92.0}
        kw_res = {"detected_by_category": {"PAYMENT_REQUESTS": ["registration fee"]}}
        company_res = {"risk_contribution": 15, "trust_status": "Suspicious"}
        recruiter_res = {"risk_contribution": 20, "trust_status": "Suspicious"}
        salary_res = {"risk_contribution": 10, "salary_risk": "Medium"}

        risk = calculate_risk(ml_res, kw_res, company_res, recruiter_res, salary_res)
        self.assertGreaterEqual(risk['risk_score'], 75)
        self.assertEqual(risk['risk_level'], 'Critical')
        self.assertTrue(len(risk['contributing_factors']) >= 4)

class EndToEndAnalysisAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.analysis_url = reverse('analysis-list-create')

    def test_validation_error_on_empty_description(self):
        payload = {
            "job_title": "Software Engineer",
            "company_name": "Acme",
            "job_description": "" # Too short / empty
        }
        resp = self.client.post(self.analysis_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp.data['success'])

    def test_full_analysis_pipeline(self):
        payload = {
            "job_title": "Remote Data Entry Assistant",
            "company_name": "Apex Fast Hire",
            "job_description": "Immediate joining! Urgent hiring. You must pay a $100 registration fee via wire transfer to receive equipment. Send bank details.",
            "salary_min": 90000,
            "salary_max": 120000,
            "currency": "USD",
            "experience": "None",
            "company_website": "http://apex-hire.xyz",
            "recruiter_email": "apex.recruiter@gmail.com"
        }
        resp = self.client.post(self.analysis_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(resp.data['success'])
        data = resp.data['data']
        self.assertIn('risk_score', data)
        self.assertIn('prediction', data)
        self.assertIn('explainable_ai', data)
        self.assertGreater(data['risk_score'], 50) # High or critical scam
        self.assertTrue(JobAnalysis.objects.filter(pk=data['id']).exists())
