# Modular CPU in Logisim

This project implements a modular, single-cycle CPU in Logisim, capable of executing a subset of RISC-style instructions. The processor supports arithmetic operations, control flow, memory access, and basic I/O, and is tested through a custom suite of unit and integration test programs.

## 🧠 Overview

The CPU architecture includes:
- **ALU**: Performs arithmetic and logical operations
- **Register File**: Stores general-purpose registers with writeback support
- **Control Logic**: Decodes instructions and sets control signals
- **Data Memory**: Supports load/store operations
- **Program Counter**: Tracks instruction addresses
- **Instruction Memory**: Preloaded with test programs
- **Multiplexers and Immediate Generators**: Control data flow and address handling

## 🔧 Technologies Used

- Logisim Evolution
- Python and Shell scripts for test harnessing
- Git for version control

## 🎯 Key Components

- `cpu/`: Core modules (`alu.circ`, `regfile.circ`, `control-logic.circ`, etc.)
- `harnesses/`: Wrapper circuits for testing individual modules
- `tests/`: Assembly programs and expected outputs for simulation
- `tools/`: Scripts for generating hex files, formatting, and checking output

## 📁 My Contributions

- Assembled and connected modular CPU components
- Designed and tested ALU, control logic, and register file
- Debugged memory access and control signal propagation
- Built and validated integration tests with scripted harnesses
- Refactored circuit layout and labeling for clarity and maintainability

## 🧪 How to Run It

1. Open `cpu/top.circ` in Logisim Evolution
2. Load hex-encoded programs using the `tools/loaders` or prebuilt test files in `tests/`
3. Step through instructions manually or enable auto-tick to observe control flow and register/memory updates
4. Use `harnesses/*.circ` to test individual components in isolation

## 🧰 Optional Tools

- Python or shell scripts in `tools/` can automate test loading and result comparison.
- Output from `logisim` CLI or simulation runs can be compared to `.ref` or `.piperef` files.

## 🧼 Notes

- Designed for clarity, modularity, and ease of debugging
- All components are compatible with Logisim Evolution and can be tested individually

