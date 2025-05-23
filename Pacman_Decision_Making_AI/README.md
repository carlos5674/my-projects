# Pacman Decision-Making AI

This project implements intelligent multi-agent search strategies in a Pacman game environment. Agents reason about adversaries (ghosts) and uncertainty using classic game tree algorithms and evaluation functions.

## 🧠 Overview

The project demonstrates the use of adversarial search algorithms to make optimal decisions in a multi-agent setting. Each agent chooses actions based on future game states, considering both deterministic and probabilistic outcomes.

## 🔧 Technologies Used

- Python 3
- Minimax Search
- Alpha-Beta Pruning
- Expectimax Search
- Reflex Agent Evaluation
- Game Tree Traversal
- Object-Oriented Programming

## 🎯 Features

- `ReflexAgent`: Evaluates successor states to make greedy moves
- `MinimaxAgent`: Implements classical Minimax decision-making
- `AlphaBetaAgent`: Optimized version of Minimax with pruning
- `ExpectimaxAgent`: Accounts for stochastic opponent behavior
- `betterEvaluationFunction`: Custom heuristic for Pacman states

## 📁 My Contributions

- Implemented:
  - `ReflexAgent`, `MinimaxAgent`, `AlphaBetaAgent`, `ExpectimaxAgent`
  - A custom evaluation function for improved strategy
- Debugged recursive search logic for multi-agent tree expansion
- Tuned agent behavior across different maze layouts

## 💻 How to Run It

Run a Reflex agent:

```bash
python pacman.py -p ReflexAgent -l testClassic
```

Try Minimax and Expectimax:

```bash
python pacman.py -p MinimaxAgent -l minimaxClassic -a depth=3
python pacman.py -p ExpectimaxAgent -l trickyClassic -a depth=3
```

See all options:

```bash
python pacman.py -h
```
