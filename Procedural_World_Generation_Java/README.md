# Procedural World Generation in Java

This project generates a dynamic, tile-based 2D world using procedural generation techniques. It supports randomized layouts with interconnected rooms and hallways, rendered in real-time using a simple tile engine.

## 🧠 Overview

The program builds a grid world by:
- Randomly placing rooms on a tile map
- Connecting rooms with L-shaped hallways
- Avoiding overlaps through bounding box checks
- Drawing the result using a terminal-based tile renderer

## 🔧 Technologies Used

- Java (Java 8+)
- Custom rendering engine using `StdDraw`
- Object-Oriented Design
- Randomized seed-based world generation

## 🎯 Features

- `World.java`: Main logic for room placement, hallway drawing, and tile map generation
- `Room.java`: Defines dimensions and overlap checks for rectangular rooms
- `Tuple.java`: Simple (x, y) coordinate representation
- `Main.java`: Entry point that ties together rendering and logic
- `TERenderer`, `TETile`, and `Tileset`: Custom tile engine

## 📁 My Contributions

- Implemented core world-building logic including hallway and room generation
- Designed and tested room overlap prevention
- Refactored classes for modularity and extensibility
- Added documentation to support future development

## 💻 How to Run It

To run this project use an IDE like VSCode or IntelliJ
