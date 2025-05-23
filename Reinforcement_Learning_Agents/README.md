# Reinforcement Learning Agents

This project implements agents that learn to make decisions in uncertain environments using reinforcement learning techniques. It includes value iteration, Q-learning, and function approximation strategies for intelligent behavior in grid-based tasks.

## 🧠 Overview

The project demonstrates how agents can:
- Solve Markov Decision Processes (MDPs) using value iteration
- Learn action policies via Q-learning with exploration
- Generalize using feature-based approximation for large state spaces

## 🔧 Technologies Used

- Python 3
- Markov Decision Processes (MDPs)
- Tabular Q-Learning
- Approximate Q-Learning with feature extractors
- Policy evaluation and improvement
- Object-Oriented Programming

## 🎯 Features

- `ValueIterationAgent`: Solves MDPs using iterative dynamic programming
- `QLearningAgent`: Uses exploration and reward feedback to learn Q-values
- `ApproximateQAgent`: Learns generalizable strategies using linear features
- `SimpleExtractor`: Extracts meaningful state-action features
- Configurable agents and training environments (Gridworld, Crawler)

## 📁 My Contributions

- Implemented:
  - Value iteration algorithm
  - Tabular Q-learning agent
  - Approximate Q-learning with feature extractor
- Designed and tuned a basic feature set for generalization
- Cleaned and modularized RL agent infrastructure

## 💻 How to Run It

Run value iteration:

```bash
python gridworld.py -a value -i 100
```

Train a Q-learning agent:

```bash
python crawler.py -a q -k 100
```

Train an approximate Q-learning agent:

```bash
python pacman.py -p ApproximateQAgent -x 2000 -n 2010 -l smallGrid
```

List all available agent options:

```bash
python pacman.py -h
```
