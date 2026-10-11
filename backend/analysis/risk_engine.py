"""
JobShield AI - Risk Scoring Engine
Calculates aggregate multi-factor risk score (0-100), maps into 4 distinct risk tiers,
and compiles traceable additive contributing factors.
"""

def calculate_risk(
    ml_result: dict,
    keyword_result: dict,
    company_result: dict,
    recruiter_result: dict,
    salary_result: dict
) -> dict:
    """
    Computes holistic risk score from component evidence.
    Returns:
    - risk_score: int (0 - 100)
    - risk_level: 'Low' | 'Moderate' | 'High' | 'Critical'
    - factors: list of traceable contributing factors with name, severity, score_contribution, explanation
    """
    factors = []
    total_score = 0

    # 1. Machine Learning Inference Factor
    ml_is_scam = ml_result.get("is_scam", False)
    ml_confidence = ml_result.get("confidence", 50.0)
    if ml_is_scam:
        contrib = int(round(25 + (ml_confidence - 50) * 0.2)) # 25 - 35
        contrib = max(20, min(contrib, 35))
        total_score += contrib
        factors.append({
            "name": "NLP / ML Fraud Classifier",
            "type": "MACHINE_LEARNING",
            "severity": "HIGH",
            "score_contribution": contrib,
            "explanation": f"The Random Forest model identified linguistic scam patterns with {ml_confidence}% confidence."
        })
    else:
        # Genuine ML prediction provides trust baseline
        pass

    # 2. Payment Request Keywords
    detected_cats = keyword_result.get("detected_by_category", {})
    if "PAYMENT_REQUESTS" in detected_cats:
        phrases = ", ".join(f"'{p}'" for p in detected_cats["PAYMENT_REQUESTS"][:3])
        contrib = 25
        total_score += contrib
        factors.append({
            "name": "Payment Request Detected",
            "type": "PAYMENT_INDICATOR",
            "severity": "CRITICAL",
            "score_contribution": contrib,
            "explanation": f"Job description requires fee or upfront funds ({phrases}). Legitimate employers never charge candidates to apply or work."
        })

    # 3. Personal / Financial Information Request
    if "PERSONAL_INFORMATION" in detected_cats:
        phrases = ", ".join(f"'{p}'" for p in detected_cats["PERSONAL_INFORMATION"][:3])
        contrib = 22
        total_score += contrib
        factors.append({
            "name": "Sensitive Financial Info Request",
            "type": "DATA_HARVESTING",
            "severity": "CRITICAL",
            "score_contribution": contrib,
            "explanation": f"Request for sensitive banking details or ID upfront ({phrases}). Major risk for identity theft."
        })

    # 4. Unrealistic Claims
    if "UNREALISTIC_CLAIMS" in detected_cats:
        phrases = ", ".join(f"'{p}'" for p in detected_cats["UNREALISTIC_CLAIMS"][:2])
        contrib = 14
        total_score += contrib
        factors.append({
            "name": "Unrealistic Employment Claims",
            "type": "DECEPTIVE_CLAIMS",
            "severity": "MEDIUM",
            "score_contribution": contrib,
            "explanation": f"Posting advertises guaranteed income without standard interviews ({phrases})."
        })

    # 5. Urgent Language
    if "URGENT_LANGUAGE" in detected_cats:
        phrases = ", ".join(f"'{p}'" for p in detected_cats["URGENT_LANGUAGE"][:2])
        contrib = 8
        total_score += contrib
        factors.append({
            "name": "Artificial Urgency Language",
            "type": "PRESSURE_TACTIC",
            "severity": "LOW",
            "score_contribution": contrib,
            "explanation": f"High-pressure hiring language detected ({phrases}) used to prompt hasty action."
        })

    # 6. Recruiter Email Verification
    recruiter_contrib = recruiter_result.get("risk_contribution", 0)
    if recruiter_contrib > 0:
        total_score += recruiter_contrib
        severity = "HIGH" if recruiter_contrib >= 20 else ("MEDIUM" if recruiter_contrib >= 10 else "LOW")
        factors.append({
            "name": "Recruiter Email Domain Discrepancy",
            "type": "IDENTITY_VERIFICATION",
            "severity": severity,
            "score_contribution": recruiter_contrib,
            "explanation": recruiter_result.get("explanation", "Recruiter domain does not validate with enterprise employer identity.")
        })

    # 7. Company Website Verification
    company_contrib = company_result.get("risk_contribution", 0)
    if company_contrib > 0:
        total_score += company_contrib
        severity = "HIGH" if company_contrib >= 15 else "MEDIUM"
        factors.append({
            "name": "Company Website Trust Risk",
            "type": "COMPANY_VERIFICATION",
            "severity": severity,
            "score_contribution": company_contrib,
            "explanation": company_result.get("explanation", "Company web presence could not be authenticated.")
        })

    # 8. Salary Anomaly
    salary_contrib = salary_result.get("risk_contribution", 0)
    if salary_contrib > 0:
        total_score += salary_contrib
        severity = "HIGH" if salary_contrib >= 15 else "MEDIUM"
        factors.append({
            "name": "Salary Anomaly Detected",
            "type": "SALARY_ANOMALY",
            "severity": severity,
            "score_contribution": salary_contrib,
            "explanation": salary_result.get("explanation", "Advertised compensation deviates from expected ranges.")
        })

    # Clamp total score between 0 and 100
    final_score = max(0, min(total_score, 100))

    # Determine Risk Level
    if final_score >= 75:
        risk_level = "Critical"
    elif final_score >= 50:
        risk_level = "High"
    elif final_score >= 25:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "contributing_factors": factors
    }
