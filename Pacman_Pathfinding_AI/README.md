# Pacman Pathfinding AI

This project implements classic pathfinding algorithms to control an intelligent Pacman agent navigating grid-based mazes. It includes depth-first, breadth-first, uniform-cost, and A* search strategies applied to maze-solving problems.

## 🧠 Overview

The system is built around a flexible search interface and game environment. Search algorithms are applied by intelligent agents to solve layout-specific tasks such as:

- Reaching goals
- Collecting food
- Navigating around obstacles

## 🔧 Technologies Used

- Python 3
- Stack, Queue, and PriorityQueue data structures
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Uniform-Cost Search (UCS)
- A* Search with heuristics
- Object-Oriented Programming

## 🎯 Features

- `depthFirstSearch`, `breadthFirstSearch`, `uniformCostSearch`, `aStarSearch` in `search.py`
- Modular `SearchAgent` that runs any search function
- `PositionSearchProblem` and other agent strategies in `searchAgents.py`
- Interactive command-line game using maze layouts

## 📁 My Contributions

- Implemented all core search algorithms from scratch:
  - DFS, BFS, UCS, and A*
- Integrated search logic with agent behavior in `searchAgents.py`
- Tuned and tested agents across multiple maze environments
- Refactored code for clarity and efficiency

## 💻 How to Run It

Run DFS on a small maze:

```bash
python pacman.py -l tinyMaze -p SearchAgent -a fn=depthFirstSearch
```

Use A* with Manhattan heuristic:

```bash
python pacman.py -l mediumMaze -p SearchAgent -a fn=aStarSearch,heuristic=manhattanHeuristic
```

List all options:

```bash
python pacman.py -h
```
