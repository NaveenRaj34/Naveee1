"""
JobShield AI - Model Training Pipeline
Trains TF-IDF Vectorizer + Random Forest Classifier for Job Scam Detection.
Outputs saved artifacts:
- ml/models/job_scam_model.pkl
- ml/models/tfidf_vectorizer.pkl
- ml/models/model_metrics.json
"""
import os
import sys
import json
import logging
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

# Configure path imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
sys.path.insert(0, PROJECT_ROOT)

from ml.preprocessing.text_cleaner import clean_text

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("JobShield_Trainer")

MODEL_VERSION = "1.0.0"
MODEL_NAME = "JobShield Random Forest Classifier"

def train(dataset_path: str = None):
    if not dataset_path:
        dataset_path = os.path.join(BASE_DIR, "datasets", "job_postings_dataset.csv")

    logger.info("Loading dataset from: %s", dataset_path)
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path)
    logger.info("Dataset loaded successfully with %d rows and %d columns", len(df), len(df.columns))

    # Validate required columns
    required_cols = ["title", "description", "fraudulent"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Required column '{col}' missing from dataset.")

    # Fill NaN values
    text_cols = ["title", "company_profile", "description", "requirements", "benefits"]
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].fillna("").astype(str)
        else:
            df[col] = ""

    # Combine text fields into rich composite text
    logger.info("Combining textual fields for feature extraction...")
    df["composite_text"] = (
        df["title"] + " " +
        df["company_profile"] + " " +
        df["description"] + " " +
        df["requirements"] + " " +
        df["benefits"]
    )

    # Preprocess text
    logger.info("Preprocessing text using NLP cleaner...")
    df["cleaned_text"] = df["composite_text"].apply(clean_text)

    X = df["cleaned_text"]
    y = df["fraudulent"].astype(int)

    logger.info("Class distribution: Genuine (0): %d, Fraudulent/Scam (1): %d", (y == 0).sum(), (y == 1).sum())

    # Split dataset
    test_size = 0.25 if len(df) >= 10 else 0.2
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=y
    )

    logger.info("Training samples: %d, Testing samples: %d", len(X_train), len(X_test))

    # TF-IDF Vectorization
    logger.info("Fitting TF-IDF Vectorizer (ngram_range=(1,2), max_features=3000)...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=3000, sublinear_tf=True)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Random Forest Classifier
    logger.info("Training Random Forest Classifier (n_estimators=100, random_state=42)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=None, random_state=42)
    clf.fit(X_train_vec, y_train)

    # Predictions & Evaluations
    y_pred = clf.predict(X_test_vec)

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n" + "="*50)
    print("      JOBSHIELD AI - MODEL EVALUATION METRICS     ")
    print("="*50)
    print(f"Model Name        : {MODEL_NAME}")
    print(f"Model Version     : {MODEL_VERSION}")
    print(f"Total Samples     : {len(df)}")
    print(f"Accuracy          : {acc * 100:.2f}%")
    print(f"Precision         : {prec * 100:.2f}%")
    print(f"Recall            : {rec * 100:.2f}%")
    print(f"F1 Score          : {f1 * 100:.2f}%")
    print(f"Confusion Matrix  : {cm} (Format: [[TN, FP], [FN, TP]])")
    print("="*50 + "\n")

    # Save artifacts
    models_dir = os.path.join(BASE_DIR, "models")
    os.makedirs(models_dir, exist_ok=True)

    model_path = os.path.join(models_dir, "job_scam_model.pkl")
    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
    metrics_path = os.path.join(models_dir, "model_metrics.json")

    joblib.dump(clf, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    logger.info("Saved model to %s", model_path)
    logger.info("Saved vectorizer to %s", vectorizer_path)

    metrics_data = {
        "model_name": MODEL_NAME,
        "model_version": MODEL_VERSION,
        "dataset_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": cm,
        "classification_algorithm": "RandomForestClassifier",
        "feature_extraction": "TF-IDF Vectorizer (ngram 1-2, sublinear_tf)",
        "status": "Production-Ready Trained Model",
        "dataset_type": "Curated Demonstration & Benchmark Dataset",
    }

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)
    logger.info("Saved metrics to %s", metrics_path)

    return metrics_data

if __name__ == "__main__":
    train()
