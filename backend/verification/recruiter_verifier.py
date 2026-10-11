"""
JobShield AI - Recruiter Email Verification Service
Analyzes recruiter email, checks domain consistency against company website,
identifies disposable or free email providers, and computes risk contribution.
"""
import re
import urllib.parse

FREE_EMAIL_PROVIDERS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
    "icloud.com", "protonmail.com", "mail.com", "zoho.com", "yandex.com",
    "gmx.com", "live.com"
}

def verify_recruiter_email(recruiter_email: str, company_website: str = "", company_name: str = "") -> dict:
    """
    Verifies recruiter email against corporate company identity.
    Considers:
    - Syntactic email validation
    - Extraction of email domain
    - Comparison with company website domain
    - Free email provider detection
    """
    if not recruiter_email or not isinstance(recruiter_email, str) or not recruiter_email.strip():
        return {
            "recruiter_email": "",
            "email_domain": "",
            "company_domain": "",
            "domain_match": False,
            "is_free_provider": False,
            "trust_status": "Unable to Verify",
            "risk_contribution": 10,
            "explanation": "No recruiter contact email was supplied with the posting. Direct recruiter verification cannot be established."
        }

    email_clean = recruiter_email.strip().lower()
    email_regex = r'^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$'
    match = re.match(email_regex, email_clean)

    if not match:
        return {
            "recruiter_email": recruiter_email,
            "email_domain": "",
            "company_domain": "",
            "domain_match": False,
            "is_free_provider": False,
            "trust_status": "Suspicious",
            "risk_contribution": 20,
            "explanation": f"Recruiter email '{recruiter_email}' is malformed or invalid."
        }

    email_domain = match.group(1).lower()
    is_free = email_domain in FREE_EMAIL_PROVIDERS

    # Extract company domain if available
    company_domain = ""
    if company_website:
        raw_url = company_website.strip()
        if not raw_url.startswith("http://") and not raw_url.startswith("https://"):
            raw_url = "https://" + raw_url
        parsed = urllib.parse.urlparse(raw_url)
        company_domain = parsed.netloc.lower()
        if ":" in company_domain:
            company_domain = company_domain.split(":")[0]
        # Remove www. prefix for comparison
        company_domain = re.sub(r'^www\.', '', company_domain)

    # Clean email domain for comparison
    clean_email_dom = re.sub(r'^www\.', '', email_domain)

    # Compare
    domain_match = False
    if company_domain and clean_email_dom:
        if clean_email_dom == company_domain or clean_email_dom.endswith("." + company_domain):
            domain_match = True

    # Determine trust status and explanation
    if domain_match:
        trust_status = "Verified"
        risk_contribution = 0
        explanation = f"Recruiter email domain '@{email_domain}' matches company domain '{company_domain}'."
    elif is_free:
        trust_status = "Suspicious"
        risk_contribution = 20
        if company_domain:
            explanation = (
                f"Recruiter uses free email provider (@{email_domain}) instead of official company domain ({company_domain}). "
                "Note: Free email providers are sometimes used by early startups, but represent an elevated risk factor."
            )
        else:
            explanation = (
                f"Recruiter contact is hosted on free public email (@{email_domain}). "
                "Reputable corporate recruiters typically correspond through dedicated enterprise domains."
            )
    elif company_domain and not domain_match:
        trust_status = "Suspicious"
        risk_contribution = 22
        explanation = (
            f"Recruiter domain '@{email_domain}' does NOT match company website domain '{company_domain}'. "
            "This domain mismatch is a strong indicator of impersonation."
        )
    else:
        # Non-free corporate domain, but no company website provided to compare against
        trust_status = "Unverified Corporate Domain"
        risk_contribution = 5
        explanation = f"Recruiter uses custom domain '@{email_domain}', but no company website was supplied for cross-validation."

    return {
        "recruiter_email": email_clean,
        "email_domain": email_domain,
        "company_domain": company_domain,
        "domain_match": domain_match,
        "is_free_provider": is_free,
        "trust_status": trust_status,
        "risk_contribution": risk_contribution,
        "explanation": explanation
    }
