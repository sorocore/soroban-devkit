# Architecture

High-level architecture for soroban-devkit.

- Monorepo with pnpm workspaces
- Packages are single-purpose, independently publishable
- Rust contracts in `contracts/` as a Cargo workspace
- Examples and apps show how to use packages in real projects

Design principles

- SOLID principles and Clean Architecture
- Minimal runtime dependencies in core packages
- ESM-first, tree-shakable exports
- Strong typing and runtime validation with Zod

Package responsibilities

- See plan in repository README and package READMEs.
