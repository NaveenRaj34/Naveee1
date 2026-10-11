"""
JobShield AI - Text Preprocessing Pipeline
Provides tokenization, stop-word removal, text cleaning, and feature extraction.
"""
import re
import string

# Standard English stop words
STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having",
    "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how",
    "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself",
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the",
    "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
    "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
}

def clean_text(text: str) -> str:
    """
    Cleans raw text while preserving linguistic content for NLP modeling:
    - Strips HTML tags
    - Converts to lowercase
    - Normalizes URLs and emails into tokens
    - Removes excessive punctuation
    - Removes standard stopwords
    - Normalizes whitespace
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Remove HTML tags
    cleaned = re.sub(r'<[^>]+>', ' ', text)
    
    # Normalize URLs and emails
    cleaned = re.sub(r'https?://\S+|www\.\S+', ' url_token ', cleaned)
    cleaned = re.sub(r'\S+@\S+', ' email_token ', cleaned)
    
    # Lowercase
    cleaned = cleaned.lower()
    
    # Remove non-alphanumeric except token markers
    cleaned = re.sub(r'[^a-z0-9_\s]', ' ', cleaned)
    
    # Normalize whitespaces
    tokens = cleaned.split()
    
    # Filter stopwords and short tokens (keep tokens length >= 2)
    filtered = [w for w in tokens if w not in STOP_WORDS and len(w) >= 2]
    
    return " ".join(filtered)

def extract_textual_metrics(text: str) -> dict:
    """
    Extracts structural textual metrics useful for scam detection analysis:
    - exclamation counts
    - all-caps tokens count
    - word count
    - char count
    """
    if not text:
        return {
            "char_count": 0,
            "word_count": 0,
            "exclamation_count": 0,
            "uppercase_ratio": 0.0,
        }
    
    words = text.split()
    exclamations = text.count('!') + text.count('?')
    uppercase_chars = sum(1 for c in text if c.isupper())
    total_letters = sum(1 for c in text if c.isalpha())
    
    return {
        "char_count": len(text),
        "word_count": len(words),
        "exclamation_count": exclamations,
        "uppercase_ratio": round(uppercase_chars / max(total_letters, 1), 3),
    }
