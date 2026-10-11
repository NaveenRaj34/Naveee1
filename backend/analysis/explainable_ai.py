"""
JobShield AI - Explainable AI (XAI) & Recommendation Engine
Transforms multi-factor mathematical scores into plain-language explanations
and actionable candidate safety recommendations.
"""

def generate_explanations_and_recommendations(
    ml_result: dict,
    keyword_result: dict,
    company_result: dict,
    recruiter_result: dict,
    salary_result: dict,
    risk_result: dict
) -> dict:
    """
    Constructs explainable AI report and prioritized safety recommendations.
    Ensures every explanation maps to concrete evidence.
    """
    reasons = []
    recommendations = []
    risk_score = risk_result.get("risk_score", 0)
    risk_level = risk_result.get("risk_level", "Low")
    detected_cats = keyword_result.get("detected_by_category", {})

    # Explainable reasons
    if "PAYMENT_REQUESTS" in detected_cats:
        reasons.append("Payment or registration fee language was explicitly detected in the job posting.")
        recommendations.append({
            "severity": "CRITICAL",
            "title": "Do Not Send Money",
            "text": "Never pay registration, application, or equipment fees. Legitimate corporate employers bear all onboarding costs."
        })

    if "PERSONAL_INFORMATION" in detected_cats:
        reasons.append("Request for sensitive banking or identity credentials prior to formal hiring.")
        recommendations.append({
            "severity": "CRITICAL",
            "title": "Protect Financial & Identity Data",
            "text": "Refuse to share bank account numbers, OTPs, or passport copies during early recruitment stages."
        })

    if recruiter_result.get("trust_status") == "Suspicious":
        reasons.append(recruiter_result.get("explanation", "Recruiter domain does not align with company identity."))
        recommendations.append({
            "severity": "HIGH",
            "title": "Verify Recruiter Identity",
            "text": "Cross-reference the recruiter on LinkedIn or contact the organization through their official verified public channels."
        })

    if company_result.get("trust_status") == "Suspicious":
        reasons.append(company_result.get("explanation", "Company web address exhibits security or domain flags."))
        recommendations.append({
            "severity": "HIGH",
            "title": "Examine Company Credentials",
            "text": "Search official government business registers (e.g. SEC EDGAR, Companies House, MCA) before accepting agreements."
        })
    elif company_result.get("trust_status") == "Unable to Verify":
        reasons.append("No active or verifiable corporate website was found to confirm company operations.")
        recommendations.append({
            "severity": "MEDIUM",
            "title": "Request Corporate Information",
            "text": "Ask the hiring manager for verified headquarters address, official web portal, and enterprise references."
        })

    if salary_result.get("salary_risk") in ["High", "Medium"]:
        reasons.append(salary_result.get("explanation", "Advertised compensation exhibits structural anomalies."))
        recommendations.append({
            "severity": "MEDIUM",
            "title": "Benchmark Market Compensation",
            "text": "Verify realistic wage ranges for this job title and experience level on trusted industry portals like Levels.fyi or Glassdoor."
        })

    if "UNREALISTIC_CLAIMS" in detected_cats:
        reasons.append("Contains exaggerated employment promises such as guaranteed income without competitive interviews.")
        recommendations.append({
            "severity": "HIGH",
            "title": "Be Skeptical of Guaranteed Offers",
            "text": "Legitimate jobs require structured screening and interviews. Unsolicited instant job offers are almost always fraudulent."
        })

    if ml_result.get("is_scam"):
        reasons.append(f"Machine learning model flagged phrasing similarities to known fraudulent job listings with {ml_result.get('confidence')}% confidence.")

    # Fallback explanation if no high-risk flags
    if not reasons:
        reasons.append("No critical fraudulent markers or domain anomalies were identified in this posting.")
        recommendations.append({
            "severity": "LOW",
            "title": "Standard Application Precautions",
            "text": "Review offer letter terms carefully and verify company presence on professional networks as standard procedure."
        })

    # Core system summary
    if risk_score >= 75:
        summary = "CRITICAL RISK: Multiple high-confidence fraud indicators detected. High probability of deceptive hiring or financial advance scam."
    elif risk_score >= 50:
        summary = "HIGH RISK: Several suspicious traits found. Strong caution recommended before engaging with recruiter."
    elif risk_score >= 25:
        summary = "MODERATE RISK: Minor or ambiguous discrepancies observed. Exercise routine verification."
    else:
        summary = "LOW RISK: The posting appears consistent with legitimate corporate job listings."

    return {
        "summary": summary,
        "reasons": reasons,
        "recommendations": recommendations,
        "technical_details": {
            "model_name": ml_result.get("model_name"),
            "model_version": ml_result.get("model_version"),
            "ml_confidence": ml_result.get("confidence"),
            "ml_status": ml_result.get("model_status"),
            "probabilities": ml_result.get("probabilities", {}),
            "text_metrics": ml_result.get("text_metrics", {})
        },
        "disclaimer": "JobShield AI is an intelligent decision-support platform designed to highlight scam indicators. It does not provide legal guarantees. Always conduct independent verification."
    }
