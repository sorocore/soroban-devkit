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

## Releasing & Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for automated version bumping and changelog generation.

### Adding a Changeset
When contributing changes that affect packages, include a changeset:

1. Run:
   ```bash
   pnpm changeset
   ```
2. Select the packages that have changed using the arrow keys and spacebar.
3. Choose the appropriate semver bump level (`major`, `minor`, or `patch`).
4. Provide a clear summary description of your changes.
5. Commit the generated markdown file under `.changeset/` along with your PR.

When changes are merged into `main`, the Changesets GitHub Action will automatically open or update a "Version Packages" pull request.

License and Code of Conduct

See CODE_OF_CONDUCT.md
