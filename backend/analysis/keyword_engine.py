"""
JobShield AI - Scam Keyword and Indicator Engine
Scans job title, description, and requirements for high-risk phrase patterns.
Categorizes matches into:
- URGENT_LANGUAGE
- PAYMENT_REQUESTS
- UNREALISTIC_CLAIMS
- PERSONAL_INFORMATION
"""
import re

SCAM_CATEGORIES = {
    "PAYMENT_REQUESTS": [
        "registration fee", "processing fee", "training fee", "security deposit",
        "pay to apply", "starter kit fee", "advance check", "equipment deposit",
        "refundable deposit", "wire transfer", "western union", "gift card",
        "cash app", "zelle transfer", "send money", "bitcoin transfer"
    ],
    "PERSONAL_INFORMATION": [
        "send bank details", "bank account information", "send otp", "bank routing number",
        "card information", "send identity documents immediately", "photo of driver license",
        "social security number", "ssn", "seed phrase", "private keys", "wallet seed",
        "online banking login"
    ],
    "UNREALISTIC_CLAIMS": [
        "guaranteed job", "guaranteed income", "earn huge money", "no interview",
        "instant offer", "earn while sleeping", "100% money back guarantee",
        "guaranteed daily profit", "instant hire", "no resume required", "no background check"
    ],
    "URGENT_LANGUAGE": [
        "immediate joining", "urgent hiring", "apply now", "limited vacancies",
        "limited spots", "act now", "immediate start", "rush", "immediate selection"
    ]
}

def scan_scam_keywords(text: str) -> dict:
    """
    Scans input text for scam markers across multiple categories.
    Extracts matched phrases, contextual snippets, and counts.
    """
    if not text or not isinstance(text, str):
        return {
            "total_indicators_detected": 0,
            "detected_by_category": {},
            "all_detected_phrases": [],
            "risk_contribution": 0,
            "snippets": []
        }

    text_lower = text.lower()
    detected_by_cat = {}
    all_phrases = []
    snippets = []
    total_risk = 0

    category_weights = {
        "PAYMENT_REQUESTS": 25,
        "PERSONAL_INFORMATION": 22,
        "UNREALISTIC_CLAIMS": 15,
        "URGENT_LANGUAGE": 10
    }

    for cat, phrases in SCAM_CATEGORIES.items():
        cat_matches = []
        for phrase in phrases:
            # Pattern search
            pattern = r'\b' + re.escape(phrase) + r'\b'
            matches = list(re.finditer(pattern, text_lower))
            if matches:
                cat_matches.append(phrase)
                if phrase not in all_phrases:
                    all_phrases.append(phrase)
                
                # Extract surrounding snippet for explainability
                for m in matches[:2]: # take up to 2 context snippets per phrase
                    start = max(0, m.start() - 35)
                    end = min(len(text), m.end() + 35)
                    raw_snippet = text[start:end].replace('\n', ' ').strip()
                    snippets.append({
                        "phrase": phrase,
                        "category": cat,
                        "context": f"...{raw_snippet}..."
                    })

        if cat_matches:
            detected_by_cat[cat] = cat_matches
            # Apply weighted contribution for this category trigger
            total_risk += category_weights.get(cat, 10)

    # Cap risk contribution from keywords to 45
    clamped_risk = min(total_risk, 45)

    return {
        "total_indicators_detected": len(all_phrases),
        "detected_by_category": detected_by_cat,
        "all_detected_phrases": all_phrases,
        "risk_contribution": clamped_risk,
        "snippets": snippets[:8]  # Keep most salient snippets
    }
