# Java Deque Implementations

This project implements multiple double-ended queue (deque) data structures in Java, showcasing different internal representations and supporting both basic and extended functionality.

## 🧠 Overview

A deque allows constant-time addition and removal from both the front and back of a sequence. This project contains three implementations:

- `LinkedListDeque`: A sentinel-based linked list implementation
- `ArrayDeque`: A resizable circular array-based deque
- `MaxArrayDeque`: An array-based deque supporting maximum element queries via a comparator

## 🔧 Technologies Used

- Java (Java 8+)
- Object-Oriented Programming
- Generics
- Comparator-based design

## 🎯 Features

- `LinkedListDeque`: Supports dynamic resizing using a circular doubly-linked list
- `ArrayDeque`: Maintains elements in a ring buffer; resizes automatically
- `MaxArrayDeque`: Adds `max()` methods for comparing elements with custom comparators
- Full unit testing suite included

## 📁 My Contributions

- Implemented all three deque types from scratch
- Used Java generics for type safety
- Designed testable, modular code with reusable interfaces
- Added documentation and refactored for clarity and performance

## 🧪 Tests

JUnit-style test files for each deque implementation can be found in:

```
tests/deque/
```

Use any Java IDE or CLI test runner to execute them.
