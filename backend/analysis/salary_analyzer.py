"""
JobShield AI - Salary Anomaly Analysis Service
Performs heuristic, rule-based salary anomaly detection.
Analyzes compensation boundaries, experience mismatches, and unrealistic income claims.
"""
import re

def analyze_salary(
    min_salary: float = None,
    max_salary: float = None,
    currency: str = "USD",
    experience: str = "",
    job_title: str = "",
    description: str = ""
) -> dict:
    """
    Evaluates salary metrics using rule-based anomaly detection:
    - Inverted salary ranges
    - Disproportionate spread ratio
    - Disconnect between low experience requirements and exorbitant salary figures
    - Unrealistic hourly or weekly claims in text
    """
    anomalies = []
    risk_contribution = 0
    salary_risk = "Low"
    anomaly_status = "Normal"

    # Normalize numeric inputs
    try:
        min_val = float(min_salary) if min_salary not in (None, "", 0) else None
    except (ValueError, TypeError):
        min_val = None

    try:
        max_val = float(max_salary) if max_salary not in (None, "", 0) else None
    except (ValueError, TypeError):
        max_val = None

    # Text heuristic for crazy claims in description
    desc_lower = (description or "").lower()
    unrealistic_money_patterns = [
        (r'\$([5-9]\d{2}|\d{4,})\s*(per|/|a)\s*(day|daily)', "Claims extreme daily payout (>$500/day)"),
        (r'\$([2-9]\d{3}|\d{5,})\s*(per|/|a)\s*(week|weekly)', "Claims extreme weekly payout (>$2,000/week)"),
        (r'\$([5-9]\d|\d{3,})\s*(per|/|a)\s*(hour|hr)', "Claims extreme hourly rate (>$50/hour) for low-skill role"),
        (r'earn (huge|unlimited|instant) (money|cash|returns)', "Promises unrealistic instant wealth or returns")
    ]

    for pattern, desc in unrealistic_money_patterns:
        if re.search(pattern, desc_lower):
            anomalies.append(desc)
            risk_contribution += 10

    # Numerical evaluations
    if min_val is not None and max_val is not None:
        if min_val > max_val:
            anomalies.append("Inverted salary range (Minimum salary is greater than maximum)")
            risk_contribution += 12
        elif min_val > 0 and (max_val / min_val) >= 3.5:
            anomalies.append(f"Excessive salary spread ({currency} {min_val:,.0f} - {max_val:,.0f}, ratio > 3.5x)")
            risk_contribution += 8

    # Experience vs compensation check
    exp_lower = (experience or "").lower()
    title_lower = (job_title or "").lower()
    is_entry_or_no_exp = any(w in exp_lower for w in ["0", "no experience", "entry", "fresh", "none", "intern"]) or \
                         any(w in title_lower for w in ["entry", "intern", "assistant", "data entry", "typing"])

    effective_max = max_val if max_val is not None else min_val
    if is_entry_or_no_exp and effective_max:
        # If USD or EUR or GBP annual figure > 100,000 for zero experience
        if currency in ["USD", "EUR", "GBP"] and effective_max >= 100000:
            anomalies.append(f"Unusually high salary ({currency} {effective_max:,.0f}) advertised for entry-level or no-experience role")
            risk_contribution += 15

    # Determine risk level
    if risk_contribution >= 15:
        salary_risk = "High"
        anomaly_status = "Unusually High For Experience / Unrealistic Claims"
    elif risk_contribution >= 8:
        salary_risk = "Medium"
        anomaly_status = "Suspicious Spread / Anomaly"
    else:
        salary_risk = "Low"
        anomaly_status = "Normal / Expected Range"

    if anomalies:
        explanation = f"Rule-based salary anomaly analysis: {'; '.join(anomalies)}."
    elif min_val or max_val:
        salary_str = f"{currency} {min_val or 0:,.0f} - {max_val or 'open':,.0f}" if (min_val and max_val) else f"{currency} {effective_max:,.0f}"
        explanation = f"Rule-based salary anomaly analysis: Advertised compensation ({salary_str}) is within standard structural ranges for role requirements."
    else:
        explanation = "Rule-based salary anomaly analysis: No explicit numeric compensation was specified; no structural anomalies detected."

    return {
        "min_salary": min_val,
        "max_salary": max_val,
        "currency": currency,
        "salary_risk": salary_risk,
        "anomaly_status": anomaly_status,
        "anomalies": anomalies,
        "risk_contribution": min(risk_contribution, 20),
        "explanation": explanation,
        "analysis_type": "Rule-Based Salary Anomaly Analysis"
    }
