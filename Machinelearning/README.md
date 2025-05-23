# Foundational ML Models

This project implements several foundational machine learning models and training infrastructure using PyTorch. It includes classification models such as the perceptron, linear classifiers, and multilayer perceptrons, as well as optional extensions into language modeling.

## 🧠 Overview

The goal of this project is to understand and build core machine learning components from scratch, including:

- Linear classifiers trained with gradient descent
- Feedforward neural networks (MLPs)
- Modular training loops
- Dataset loading and preprocessing
- Optional GPT-style language modeling extensions

## 🔧 Technologies Used

- Python 3
- PyTorch
- NumPy
- Matplotlib

## 🎯 Features

- `PerceptronModel`: Linear perceptron classifier
- `LinearModel`: Fully connected neural network with a single layer
- `MLP`: Deep neural network with ReLU activations
- `backend.py`: Visualization, plotting, and data tools
- `chargpt.py`, `gpt_model.py`: Experimental transformer-like modules
- `autograder.py`: Test runner for validating model performance

## 📁 My Contributions

- Implemented:
  - Model architectures for machine learning using low-level PyTorch APIs
  - Training and evaluation routines
  - Utilities for timing, graphics, and debugging
- Designed training scripts and customized dataset handling
- Wrote, cleaned, and documented model implementations

## 💻 How to Run It

Run the autograder:

```bash
python autograder.py
```

## 🧪 Data

Place your dataset files in the `data/` directory. Example files include:

- `mnist.npz`: For digit classification
- `lang_id.npz`: For character-level language ID tasks

