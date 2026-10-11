# JobShield AI - Machine Learning & NLP Architecture

## 1. Machine Learning Methodology

The machine learning pipeline in JobShield AI classifies job postings into **Genuine** or **Suspicious / Scam** categories using Natural Language Processing (NLP) and supervised ensemble learning.

```
Raw Job Posting Input (Title + Description + Requirements)
                          ↓
              NLP Text Preprocessing
         (Lowercase, URL/Email Normalization,
          Punctuation Cleanup, Stop Words Removal)
                          ↓
              TF-IDF Feature Extraction
            (1-2 N-grams, Sublinear TF,
               Max Features = 3,000)
                          ↓
         Random Forest Classification Ensemble
            (100 Estimators, Gini Index)
                          ↓
              Probabilistic Prediction
              [P(Genuine), P(Scam)]
```

---

## 2. Text Preprocessing Details

Implemented in `ml/preprocessing/text_cleaner.py`:
1. **HTML Removal**: Strips any formatting or markup tags.
2. **Entity Tokenization**: Normalizes URLs to `url_token` and emails to `email_token` to capture link density without overfitting to specific domains.
3. **Punctuation Normalization**: Removes non-alphanumeric noise while tracking structural exclamation points and capitalization ratios as heuristic features.
4. **Stop Words Filtering**: Eliminates high-frequency English stopwords (e.g., 'the', 'is', 'at').
5. **Whitespace Canonicalization**: Normalizes spaces and trims leading/trailing whitespace.

---

## 3. Vectorization & Classifier Hyperparameters

- **Feature Extractor**: `TfidfVectorizer` (scikit-learn)
  - `ngram_range`: `(1, 2)` (captures both unigrams and bigrams like "wire transfer" and "registration fee")
  - `max_features`: `3,000`
  - `sublinear_tf`: `True` (applies sublinear scaling `1 + log(tf)` to downweight excessively repetitive terms)
- **Classifier**: `RandomForestClassifier` (scikit-learn)
  - `n_estimators`: `100` decision trees
  - `criterion`: `'gini'`
  - `random_state`: `42` (deterministic reproducibility)

---

## 4. Model Training & Evaluation Metrics

The model training script is located at `ml/training/train_model.py` (and root shortcut `train_model.py`):
```bash
python train_model.py
```

### Current Benchmark Evaluation Metrics (Sample Dataset):
- **Model Name**: JobShield Random Forest Classifier
- **Model Version**: `1.0.0`
- **Total Dataset Size**: 30 Curated Demonstration & Benchmark Postings
- **Training Samples**: 22
- **Testing Samples**: 8
- **Accuracy**: **100.00%**
- **Precision**: **100.00%**
- **Recall**: **100.00%**
- **F1 Score**: **100.00%**
- **Confusion Matrix**: `[[5, 0], [0, 3]]` (5 True Negatives, 3 True Positives, 0 False Positives, 0 False Negatives)

*Note: For academic and development purposes, this represents the curated benchmark dataset. The architecture is modular and designed to be retrained on Kaggle's 18,000-sample EMScam dataset without code changes.*

---

## 5. Artifact Storage & Inference Optimization

Serialized model artifacts are preserved in `ml/models/`:
- `ml/models/job_scam_model.pkl`: Serialized scikit-learn Random Forest ensemble.
- `ml/models/tfidf_vectorizer.pkl`: Fitted scikit-learn TF-IDF vectorizer vocabulary.
- `ml/models/model_metrics.json`: JSON metadata recording evaluation metrics, feature settings, and version tags.

### Singleton In-Memory Caching:
The inference engine (`ml/prediction/predictor.py`) implements a thread-safe singleton pattern (`JobScamPredictor`). Models are loaded **once** at server startup and cached in memory, preventing expensive per-request disk reads and achieving sub-10ms inference latencies.
