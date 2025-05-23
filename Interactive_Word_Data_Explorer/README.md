# Interactive Word Data Explorer (Java + Web)

This project is a two-part interactive tool for exploring large-scale word usage data over time and examining relationships between words through graph traversal. It combines a Java backend with a web-based frontend to deliver responsive and insightful visualizations.

## 🧠 Overview

### Part 1: Historical Word Frequencies (NGramMap)
- Uses Google's NGram dataset to track word usage over time
- Allows interactive plotting of single or multiple word frequencies
- Backend handles CSV parsing, smoothing, and date-based filtering

### Part 2: WordNet Explorer (Hyponyms & Graph Traversal)
- Loads a WordNet-style hierarchy of synsets and hypernyms
- Supports interactive queries for all hyponyms of a given noun
- Handles multi-word queries and disambiguation logic

## 🌐 Technologies Used

- Java 8+
- Java HTTP Server for dynamic routing
- Java Collections & Data Structures (TreeMap, HashSet, Graph)
- HTML, CSS, JavaScript frontend with AJAX
- JUnit for testing

## 🎯 Key Components

- `src/ngordnet/ngrams/`: Handles word frequency data (NGramMap, TimeSeries)
- `src/ngordnet/wordnet/`: WordNet graph logic (WordNet, Hyponyms)
- `src/ngordnet/browser/`: Web routing and server handlers
- `static/`: Web frontend (plotting interface and query input)
- `tests/`: Unit tests for all core components

## 📁 My Contributions

- Implemented:
  - TimeSeries math (merge, divide, smoothing)
  - Graph traversal logic for hyponym expansion
  - Backend routing for `/history`, `/hyponyms`, and `/historytext`
- Designed and tuned word smoothing and time filters
- Developed and debugged integration with web interface
- Refactored Java packages for modularity and clarity

## 🚀 How to Run It

To run this project use an IDE like VSCode or IntelliJ

Use the search interface to test `/history`, `/historytext`, and `/hyponyms`.

