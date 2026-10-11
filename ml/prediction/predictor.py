"""
JobShield AI - ML Prediction Engine
Loads serialized TF-IDF vectorizer and Random Forest model once in memory
Provides high-performance inference with confidence probabilities and graceful fallback.
"""
import os
import sys
import logging
import joblib

# Ensure project root is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.dirname(CURRENT_DIR)
PROJECT_ROOT = os.path.dirname(ML_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.preprocessing.text_cleaner import clean_text, extract_textual_metrics

logger = logging.getLogger("JobShield_Predictor")

class JobScamPredictor:
    _instance = None
    _model = None
    _vectorizer = None
    _model_version = "1.0.0"
    _model_name = "JobShield Random Forest Classifier"
    _is_fallback = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.load_model()

    def load_model(self):
        models_dir = os.path.join(ML_DIR, "models")
        model_path = os.path.join(models_dir, "job_scam_model.pkl")
        vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")

        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            try:
                self._model = joblib.load(model_path)
                self._vectorizer = joblib.load(vectorizer_path)
                self._is_fallback = False
                logger.info("Successfully loaded ML model and TF-IDF vectorizer from %s", models_dir)
            except Exception as e:
                logger.error("Failed to deserialize model artifacts: %s. Using heuristic fallback.", e)
                self._is_fallback = True
        else:
            logger.warning("ML model files not found at %s. Operating in development fallback mode.", models_dir)
            self._is_fallback = True

    def predict(self, title: str, description: str, company_profile: str = "", requirements: str = "", benefits: str = "") -> dict:
        """
        Executes prediction on job posting textual components.
        """
        composite_text = f"{title} {company_profile} {description} {requirements} {benefits}"
        cleaned = clean_text(composite_text)
        text_metrics = extract_textual_metrics(description)

        if not self._is_fallback and self._model is not None and self._vectorizer is not None:
            try:
                X_vec = self._vectorizer.transform([cleaned])
                probs = self._model.predict_proba(X_vec)[0]
                # Classes: [0: Genuine, 1: Fraudulent]
                p_genuine = float(probs[0])
                p_scam = float(probs[1]) if len(probs) > 1 else (1.0 - p_genuine)
                
                is_scam = bool(p_scam >= 0.5)
                confidence = round(max(p_scam, p_genuine) * 100, 1)
                
                return {
                    "prediction": "Suspicious" if is_scam else "Genuine",
                    "is_scam": is_scam,
                    "confidence": confidence,
                    "model_name": self._model_name,
                    "model_version": self._model_version,
                    "model_status": "Production ML Model (Random Forest)",
                    "probabilities": {
                        "genuine": round(p_genuine * 100, 1),
                        "scam": round(p_scam * 100, 1)
                    },
                    "cleaned_token_count": len(cleaned.split()),
                    "text_metrics": text_metrics,
                    "is_fallback": False
                }
            except Exception as e:
                logger.error("Inference execution error: %s. Reverting to rule-based fallback.", e)

        # Graceful development fallback
        # Rule heuristic check for development when model is missing
        scam_markers = [
            "registration fee", "processing fee", "wire transfer", "cash app", 
            "instant hire", "no interview", "whatsapp", "telegram", "earn huge money",
            "deposit check", "gift card", "western union"
        ]
        lower_desc = composite_text.lower()
        matched = sum(1 for m in scam_markers if m in lower_desc)
        is_scam = matched > 0
        conf = 85.0 if is_scam else 80.0

        return {
            "prediction": "Suspicious" if is_scam else "Genuine",
            "is_scam": is_scam,
            "confidence": conf,
            "model_name": "JobShield Heuristic Engine (Dev Fallback)",
            "model_version": "0.1.0-dev",
            "model_status": "Development Fallback Heuristic",
            "probabilities": {
                "genuine": 15.0 if is_scam else 80.0,
                "scam": 85.0 if is_scam else 20.0
            },
            "cleaned_token_count": len(cleaned.split()),
            "text_metrics": text_metrics,
            "is_fallback": True
        }

# Global singleton helper
def get_ml_predictor() -> JobScamPredictor:
    return JobScamPredictor.get_instance()
