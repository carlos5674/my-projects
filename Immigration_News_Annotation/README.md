# Immigration News Reliability Annotation & Analysis

This project explores perceived media reliability in immigration-related news using NLP and manual annotation. It combines human-labeled tone assessments with machine learning to classify headlines and snippets based on emotional language, bias, and balance.

## 🧠 Project Goals

- Create and curate a dataset of news article annotations
- Label tone, emotionality, and neutrality according to custom guidelines
- Analyze feature correlations with perceived reliability
- Train and evaluate models including TF-IDF + logistic regression

## 🔍 Methodology

- Custom annotation guidelines for subjective tone evaluation
- Feature extraction using TF-IDF
- Baseline comparison using majority class prediction
- Logistic regression and ordinal regression models
- Qualitative error analysis and interpretability review

## 📊 Results

- Models outperformed majority baseline on subtle class distinctions
- Most articles fell within the mid-range of perceived reliability
- Interpretability analysis revealed consistent misclassification on emotionally neutral but contextually biased samples

## 🏁 Status

Complete. Results documented in the final notebook and PDF report. Potential extensions include fine-tuning transformer models and expanding cross-country sources.
