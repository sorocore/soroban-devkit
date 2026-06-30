# Contributing to soroban-devkit

Thank you for your interest. This document outlines workflows, coding standards, and how to add new packages or examples.

- Follow TypeScript strict mode and write tests for new functionality.
- Open an issue before major design or API changes.
- Use Changesets for releases: pnpm changeset

Development workflow

1. pnpm install
2. pnpm -w build
3. pnpm -w test

Creating a new package

1. Use the CLI generator (TODO) or copy an existing package template.
2. Ensure the package has its own package.json, tsconfig.json and build script.

License and Code of Conduct

See CODE_OF_CONDUCT.md
