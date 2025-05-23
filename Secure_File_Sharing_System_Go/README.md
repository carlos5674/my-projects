# Secure Client in Go

This project implements a secure file storage and sharing client written in Go. It combines cryptographic primitives with modular design to support encryption, authentication, file sharing, and access revocation in a distributed environment.

## 🧠 Overview

The client supports:
- Secure user initialization and authentication
- Confidential, tamper-resistant file storage
- File sharing using encrypted invitations
- Revocation of previously granted file access
- User-specific access control and auditability

## 🔐 Security Features

- AES-based encryption (confidentiality)
- HMAC authentication (integrity)
- UUID-based datastore indexing
- Public-key infrastructure for secure sharing

## 🔧 Technologies Used

- Go (Golang)
- UUIDs via `github.com/google/uuid`
- JSON serialization
- Go unit testing

## 📁 My Contributions

- Implemented:
  - Encrypted file storage and indexing
  - Invitation generation and secure access control
  - User authentication using derived keys
  - File revocation using tree-based update logic
- Refactored interfaces and tests for clarity
- Added documentation and maintained modularity

## 🧪 How to Run

1. Ensure Go is installed and configured.

2. Build and run tests using an IDE


## 🧬 File Structure

- `client/client.go`: Core secure storage logic
- `client/client_test.go`: Functional tests
- `client/client_unittest.go`: Unit tests

## 🗃️ Notes

- Only standard and approved libraries are used.
This project was built as a security-focused exercise and follows best practices where possible. However, it is not intended to be production-grade secure. Limitations include:

- Simplified key management and trust assumptions
- No formal threat modeling or auditing
- Assumes a trusted datastore interface

It demonstrates secure design principles, modular implementation, and cryptographic reasoning, but is not suitable for real-world deployment without further review.
