"""
JobShield AI - Company Verification Service
Analyzes company website, HTTPS implementation, domain reputation patterns,
and network reachability.
"""
import re
import urllib.parse
import requests

SUSPICIOUS_TLDS = {".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".click", ".buzz", ".live"}
FREE_HOSTING_PATTERNS = ["wixsite.com", "weebly.com", "wordpress.com", "blogspot.com", "sites.google.com", "carrd.co"]

def verify_company_website(website_url: str, company_name: str = "") -> dict:
    """
    Performs comprehensive website verification:
    - URL structure and protocol validation (HTTPS vs HTTP)
    - Domain extraction and corporate domain pattern heuristics
    - Real-time HTTP reachability check (with safety timeout)
    - Clearly distinguishes website verification from official registration verification.
    """
    if not website_url or not isinstance(website_url, str) or not website_url.strip():
        return {
            "website": "",
            "domain": "",
            "https_status": "Missing",
            "domain_status": "Not Provided",
            "trust_status": "Unable to Verify",
            "is_reachable": False,
            "status_code": None,
            "risk_contribution": 10,
            "explanation": "No company website was provided with this job posting. Unable to verify digital web presence.",
            "verification_type": "Website Verification (Not Official Legal Registry)"
        }

    raw_url = website_url.strip()
    if not raw_url.startswith("http://") and not raw_url.startswith("https://"):
        raw_url = "https://" + raw_url

    parsed = urllib.parse.urlparse(raw_url)
    domain = parsed.netloc.lower()
    
    # Strip port if present
    if ":" in domain:
        domain = domain.split(":")[0]

    uses_https = parsed.scheme.lower() == "https"
    https_status = "Secure (HTTPS)" if uses_https else "Insecure (HTTP)"

    # Analyze domain heuristics
    domain_issues = []
    has_suspicious_tld = any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS)
    if has_suspicious_tld:
        domain_issues.append("Uses high-risk top-level domain frequently associated with throwaway sites")

    is_free_hosting = any(sub in domain for sub in FREE_HOSTING_PATTERNS)
    if is_free_hosting:
        domain_issues.append("Hosted on a free web builder rather than dedicated corporate domain")

    # Name similarity check if company name is provided
    clean_company = re.sub(r'[^a-z0-9]', '', (company_name or "").lower())
    clean_domain = re.sub(r'[^a-z0-9]', '', domain.split('.')[0])
    
    domain_mismatch = False
    if clean_company and len(clean_company) >= 4 and clean_domain:
        if clean_company not in clean_domain and clean_domain not in clean_company:
            domain_mismatch = True

    # Real-time HTTP reachability check (short timeout to prevent blocking)
    is_reachable = False
    status_code = None
    try:
        headers = {"User-Agent": "JobShield-Verifier/1.0 (+https://jobshield.ai)"}
        resp = requests.head(raw_url, timeout=3.0, allow_redirects=True, headers=headers)
        status_code = resp.status_code
        if status_code < 400:
            is_reachable = True
        elif status_code == 405: # Method not allowed on HEAD, try quick GET
            resp_get = requests.get(raw_url, timeout=3.0, allow_redirects=True, headers=headers, stream=True)
            status_code = resp_get.status_code
            is_reachable = status_code < 400
    except requests.RequestException:
        is_reachable = False

    # Determine Trust Status and Risk Contribution
    if not is_reachable and not is_free_hosting and not has_suspicious_tld:
        trust_status = "Unable to Verify"
        risk_contribution = 10
        explanation = f"Domain {domain} could not be reached over HTTP/HTTPS. Site may be offline, temporary, or blocking automated verification."
    elif domain_issues or not uses_https:
        trust_status = "Suspicious"
        risk_contribution = 18
        issues_summary = "; ".join(domain_issues) if domain_issues else "Site does not use secure HTTPS protocol"
        explanation = f"Company website flagged as suspicious: {issues_summary}."
    else:
        trust_status = "Verified"
        risk_contribution = 0
        explanation = f"Company domain '{domain}' is active, securely delivered via HTTPS, and accessible."

    if domain_mismatch and trust_status != "Verified":
        explanation += f" Domain '{domain}' does not appear to reflect company name '{company_name}'."

    return {
        "website": raw_url,
        "domain": domain,
        "https_status": https_status,
        "domain_status": "Suspicious" if domain_issues else "Active",
        "trust_status": trust_status,
        "is_reachable": is_reachable,
        "status_code": status_code,
        "risk_contribution": risk_contribution,
        "explanation": explanation,
        "verification_type": "Website Verification (Not Official Legal Registry)"
    }
