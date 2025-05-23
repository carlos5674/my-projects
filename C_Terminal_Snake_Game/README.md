# C Terminal Snake Game

This project is a terminal-based implementation of the classic Snake game written in C. It uses a grid-based system to simulate snake movement, food consumption, and self-collision. The game can be run interactively in the terminal or executed on test levels defined via input files.

## 🧠 Overview

- Terminal-based UI with configurable board state
- Snake grows when eating food, and dies on wall or self collision
- Supports static test boards and interactive play mode
- Handles input parsing and dynamic rendering using ANSI escape codes

## 🔧 Technologies Used

- C (ISO C99)
- Terminal control with ANSI sequences
- Modular source file structure
- `Makefile` for building and testing

## 🎯 Features

- `snake.c`: Main entry point, handles CLI arguments and file I/O
- `state.c`: Board state logic and snake movement
- `snake_utils.c`: Snake rendering and utility functions
- `interactive_snake.c`: Interactive version using live key input
- `unit_tests.c`: Tests core functionality and edge cases

## 📁 My Contributions

- Implemented:
  - Snake movement logic, collision detection, and board updates
  - Input parsing and rendering logic
  - Test-driven development with unit tests and `.snk` board files
- Refactored logic into modular C files with clear responsibilities
- Documented source files and prepared for standalone compilation
