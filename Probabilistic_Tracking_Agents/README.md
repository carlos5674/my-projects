# Probabilistic Tracking Agents

This project implements agents that track and pursue hidden ghosts in a partially observable grid world using probabilistic inference techniques. It combines exact and approximate filtering methods with belief-based decision-making.

## 🧠 Overview

The system uses noisy observations and a ghost movement model to estimate ghost positions over time. Agents then act based on these probabilistic beliefs. The project includes:

- Exact inference with Hidden Markov Models (HMMs)
- Particle filtering for scalability
- Multi-agent joint inference
- Ghost-chasing agents using belief distributions

## 🔧 Technologies Used

- Python 3
- Hidden Markov Models
- Bayes Nets
- Particle Filtering
- Factor Elimination
- Belief State Updating
- Object-Oriented Design

## 🎯 Features

- `ExactInference`: Implements the forward algorithm for single-ghost tracking
- `ParticleFilter`: Samples particles to approximate belief states
- `JointParticleFilter`: Tracks multiple ghosts jointly with particles
- `GreedyBustersAgent`: Uses belief distributions to pursue the closest ghost
- Interactive visualizations with ghost inference overlays

## 📁 My Contributions

- Implemented:
  - Exact and approximate inference logic
  - Joint particle filtering for multi-ghost tracking
  - Ghost-hunting agent using probabilistic beliefs
- Refactored and modularized belief update logic
- Tuned particle sampling and resampling strategies

## 💻 How to Run It

Run a ghost-hunting agent using particle filtering:

```bash
python busters.py -p GreedyBustersAgent -k 1 -l smallHunt
```

List all options:

```bash
python busters.py -h
```
