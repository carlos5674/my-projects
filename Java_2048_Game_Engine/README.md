# Java 2048 Game Engine

This project implements a fully functional version of the classic 2048 puzzle game using Java. It features a clean separation between game logic and graphical user interface (GUI), and supports tile merging, win/lose conditions, and custom board sizes.

## 🧠 Overview

The game is built using a model-view-controller (MVC) design:
- The `Model` manages the board state and game logic
- The `Board` class represents tile positions and movements
- The `Game` class connects user input with updates to the model
- The `GUI` and `BoardWidget` components render the game interface

## 🔧 Technologies Used

- Java (Java 8+)
- Java Swing for GUI
- Object-Oriented Programming
- MVC Design Pattern

## 🎯 Features

- Implements all core mechanics of 2048:
  - Tilting and merging in all directions
  - Random tile spawning
  - Game-over detection
- Clean Java interface with keyboard controls
- Includes unit tests under `tests/game2048/`

## 📁 My Contributions

- Implemented:
  - Game state transitions and tile merging logic
  - Game-over checks, max tile detection, and scoring system
- Refactored and cleaned controller and model classes
- Documented all core classes and public methods

## 💻 How to Run It

To run this project use an IDE like VSCode or IntelliJ

Use arrow keys to control tile movement in the GUI.
