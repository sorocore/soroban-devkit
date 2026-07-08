<div align="center">
  <h1>🛸 soroban-devkit</h1>
  <p><strong>The definitive toolkit for Soroban developers.</strong></p>
  <p>Modular, extensible, and production-ready utilities for building Soroban smart contract applications on Stellar — with less boilerplate and a better developer experience.</p>

  <p>
    <a href="https://github.com/sorocore/soroban-devkit/actions/workflows/ci.yml">
      <img src="https://github.com/sorocore/soroban-devkit/actions/workflows/ci.yml/badge.svg" alt="CI" />
    </a>
    <a href="https://github.com/sorocore/soroban-devkit/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
    </a>
    <a href="https://github.com/sorocore/soroban-devkit/issues">
      <img src="https://img.shields.io/github/issues/sorocore/soroban-devkit" alt="Open Issues" />
    </a>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/pnpm-workspace-orange" alt="pnpm workspace" />
    <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript strict" />
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Packages](#packages)
  - [@soroban-devkit/core](#soroban-devkitcore)
  - [@soroban-devkit/wallet](#soroban-devkitwallet)
  - [@soroban-devkit/react](#soroban-devkitreact)
  - [@soroban-devkit/cli](#soroban-devkitcli)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Building Packages](#building-packages)
  - [Running Tests](#running-tests)
- [Usage Examples](#usage-examples)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Community & Support](#community--support)
- [License](#license)

---

## Overview

**soroban-devkit** is an open-source monorepo providing a suite of TypeScript packages for building applications on the [Soroban](https://soroban.stellar.org/) smart contract platform. Whether you are building a dApp frontend, a backend indexer, or a CLI tool, soroban-devkit gives you composable, well-typed primitives to move fast without reinventing the wheel.

> **Status:** `v0.1` — Core architecture, type definitions, and scaffolding are in place. Several packages contain placeholder implementations that are tracked as open issues and are actively looking for contributors.

### Why soroban-devkit?

| Problem | soroban-devkit Solution |
|---|---|
| Boilerplate-heavy Soroban RPC calls | Typed contract client factory (coming in v0.2) |
| No standard wallet abstraction | `WalletAdapter` interface + `MemoryWallet` for testing |
| React state management for wallets is ad hoc | `WalletProvider` + `useWallet` hook |
| CLI tooling for Soroban is fragmented | `@soroban-devkit/cli` (in progress) |
| Inconsistent error handling across packages | Typed `Result<T>` + `SorobanError` hierarchy (in progress) |

---

## Monorepo Structure

```
soroban-devkit/
├── packages/
│   ├── core/          # @soroban-devkit/core    — shared types, utilities, error classes
│   ├── wallet/        # @soroban-devkit/wallet  — wallet adapters and interfaces
│   ├── react/         # @soroban-devkit/react   — React hooks and providers
│   └── cli/           # @soroban-devkit/cli     — command-line tooling
├── apps/
│   └── express-example/   # Fastify server demonstrating core package usage
├── contracts/             # Rust/Soroban example smart contracts (Cargo workspace)
├── examples/              # Additional usage examples
├── .github/
│   └── workflows/
│       └── ci.yml         # CI: typecheck → lint → test → build
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

All packages are independently publishable to npm and follow a strict ESM-first, tree-shakable export strategy.

---

## Packages

### `@soroban-devkit/core`

> Shared utilities, base types, and error primitives used across the entire toolkit.

**Key exports:**

| Export | Description |
|---|---|
| `Result<T>` | Discriminated union `{ ok: true; value: T } \| { ok: false; error: Error }` for safe error handling without throwing |
| `Logger` | Interface for pluggable loggers (`info`, `warn`, `error`) |
| `createLogger(prefix?)` | Factory that returns a prefixed `Logger` wrapping `console` |

**Usage:**

```ts
import { createLogger, type Result } from '@soroban-devkit/core';

const logger = createLogger('my-app');
logger.info('Starting up...');  // → [my-app] Starting up...
logger.warn('Rate limit approaching');
logger.error('Contract call failed', err);

// Safe result handling
async function fetchBalance(address: string): Promise<Result<string>> {
  try {
    const balance = await rpc.getBalance(address);
    return { ok: true, value: balance };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

const result = await fetchBalance('G...');
if (result.ok) {
  console.log('Balance:', result.value);
} else {
  console.error('Failed:', result.error.message);
}
```

**Install:**

```bash
npm install @soroban-devkit/core
# or
pnpm add @soroban-devkit/core
```

---

### `@soroban-devkit/wallet`

> Wallet abstraction layer with a pluggable adapter interface. Enables seamless switching between in-memory wallets (for testing), browser extensions (Freighter), and hardware wallets.

**Key exports:**

| Export | Description |
|---|---|
| `WalletAdapter` | Interface all wallet adapters must implement |
| `MemoryWallet` | In-memory wallet for local development and unit tests |

**`WalletAdapter` interface:**

```ts
export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getAddress(): Promise<string>;
}
```

**`MemoryWallet` usage:**

```ts
import { MemoryWallet } from '@soroban-devkit/wallet';

const wallet = new MemoryWallet();

await wallet.connect();
console.log(wallet.isConnected()); // true

const address = await wallet.getAddress();
console.log(address); // G... (Stellar public key)

await wallet.disconnect();
console.log(wallet.isConnected()); // false
```

**Implementing a custom adapter:**

```ts
import type { WalletAdapter } from '@soroban-devkit/wallet';

export class MyCustomWallet implements WalletAdapter {
  async connect(): Promise<void> { /* ... */ }
  async disconnect(): Promise<void> { /* ... */ }
  isConnected(): boolean { /* ... */ }
  async getAddress(): Promise<string> { /* ... */ }
}
```

> **Coming in v0.2:** `FreighterWalletAdapter` for the [Freighter](https://freighter.app) browser extension. See [issue #7](https://github.com/sorocore/soroban-devkit/issues/7).

**Install:**

```bash
npm install @soroban-devkit/wallet
# or
pnpm add @soroban-devkit/wallet
```

---

### `@soroban-devkit/react`

> React hooks and context providers for Soroban dApp frontends. Built on top of `@soroban-devkit/wallet`.

**Key exports:**

| Export | Type | Description |
|---|---|---|
| `WalletProvider` | Component | Context provider — wraps your app to make wallet state available |
| `useWallet()` | Hook | Returns `{ connect, disconnect, address }` |
| `useTransaction()` | Hook | Returns `{ build, submit }` for transaction lifecycle management |
| `connectWallet()` | Function | Imperative wallet connect helper |
| `signTransaction()` | Function | Imperative transaction signing helper |

**Quick start:**

```tsx
// 1. Wrap your app with WalletProvider
import { WalletProvider } from '@soroban-devkit/react';

function App() {
  return (
    <WalletProvider>
      <MyDApp />
    </WalletProvider>
  );
}
```

```tsx
// 2. Use the wallet hook anywhere inside WalletProvider
import { useWallet } from '@soroban-devkit/react';

function ConnectButton() {
  const { connect, disconnect, address } = useWallet();

  if (address) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return <button onClick={connect}>Connect Wallet</button>;
}
```

```tsx
// 3. Build and submit transactions
import { useTransaction } from '@soroban-devkit/react';

function InvokeContract() {
  const { build, submit } = useTransaction();

  const handleClick = async () => {
    build();          // Construct the transaction
    await submit();   // Sign and submit to the network
  };

  return <button onClick={handleClick}>Call Contract</button>;
}
```

> **Peer dependency:** Requires `react >= 18.0.0`.

**Install:**

```bash
npm install @soroban-devkit/react
# or
pnpm add @soroban-devkit/react
```

**Next.js setup:**

```tsx
// app/layout.tsx  (Next.js App Router)
import { WalletProvider } from '@soroban-devkit/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
```

---

### `@soroban-devkit/cli`

> Command-line tooling for Soroban developers. Scaffold projects, generate contract bindings, inspect on-chain state, and more — all from your terminal.

> **Status:** Early development. The CLI binary is registered but commands are not yet implemented. See [issue #2](https://github.com/sorocore/soroban-devkit/issues/2) to contribute the `create` command.

**Planned commands:**

| Command | Description | Status |
|---|---|---|
| `soroban-devkit create <name>` | Scaffold a new Soroban project | 🚧 In progress ([#2](https://github.com/sorocore/soroban-devkit/issues/2)) |
| `soroban-devkit generate` | Generate TypeScript bindings from a contract ABI | 📋 Planned |
| `soroban-devkit inspect <contract-id>` | Inspect on-chain contract state | 📋 Planned |
| `soroban-devkit doctor` | Check environment, toolchain, and config health | 📋 Planned |
| `soroban-devkit test` | Run contract integration tests | 📋 Planned |

**Install (once commands are implemented):**

```bash
npm install -g @soroban-devkit/cli
# or use without installing
npx @soroban-devkit/cli create my-project
```

---

## Getting Started

### Prerequisites

Before cloning and working on this repository, ensure you have the following installed:

| Tool | Version | Install |
|---|---|---|
| [Node.js](https://nodejs.org/) | `>= 22` | [nodejs.org](https://nodejs.org/) |
| [pnpm](https://pnpm.io/) | `>= 9` | `npm install -g pnpm` |
| [Git](https://git-scm.com/) | any | — |
| [Rust + Cargo](https://rustup.rs/) | stable | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` *(only needed for Rust contracts)* |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sorocore/soroban-devkit.git
cd soroban-devkit

# 2. Install all workspace dependencies
pnpm install

# 3. Build all packages
pnpm -w run build
```

### Building Packages

```bash
# Build every package and app in the monorepo
pnpm -w run build

# Build only the packages/ directory
pnpm -w run build:packages

# Build only the apps/ directory
pnpm -w run build:apps

# Build a single package
pnpm --filter @soroban-devkit/core build
pnpm --filter @soroban-devkit/wallet build
pnpm --filter @soroban-devkit/react build
pnpm --filter @soroban-devkit/cli build
```

### Running Tests

```bash
# Run tests across all packages
pnpm -w run test

# Run tests for a specific package
pnpm --filter @soroban-devkit/core test
pnpm --filter @soroban-devkit/wallet test
```

### Type Checking

```bash
# Run TypeScript project references check across the entire monorepo
pnpm -w run typecheck
```

### Linting

```bash
pnpm -w run lint
```

---

## Usage Examples

### Express / Fastify Server

The `apps/express-example` demonstrates using core devkit primitives in a Fastify server:

```ts
import Fastify from 'fastify';
import { createLogger } from '@soroban-devkit/core';

const logger = createLogger('api-server');
const server = Fastify();

server.get('/', async () => {
  logger.info('Health check hit');
  return { status: 'ok', message: 'soroban-devkit express example' };
});

server.listen({ port: 3000 }).then(() => {
  logger.info('Server started on port 3000');
});
```

### In-memory Wallet for Testing

```ts
import { MemoryWallet } from '@soroban-devkit/wallet';
import { createLogger, type Result } from '@soroban-devkit/core';

const logger = createLogger('test');

async function runTest(): Promise<Result<void>> {
  const wallet = new MemoryWallet();
  try {
    await wallet.connect();
    const address = await wallet.getAddress();
    logger.info('Wallet address:', address);
    await wallet.disconnect();
    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
```

### React dApp

```tsx
import React from 'react';
import { WalletProvider, useWallet } from '@soroban-devkit/react';

function WalletStatus() {
  const { connect, disconnect, address } = useWallet();

  return (
    <div className="wallet-panel">
      {address ? (
        <>
          <span className="address">{address.slice(0, 8)}...{address.slice(-4)}</span>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <main>
        <h1>My Soroban dApp</h1>
        <WalletStatus />
      </main>
    </WalletProvider>
  );
}
```

---

## Architecture

soroban-devkit follows **Clean Architecture** and **SOLID principles** throughout:

```
┌──────────────────────────────────────────────────────────────┐
│                        Applications                          │
│              (apps/express-example, user dApps)              │
├──────────────────────────────────────────────────────────────┤
│                    Framework Adapters                         │
│        @soroban-devkit/react    @soroban-devkit/cli          │
├──────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│       @soroban-devkit/wallet    @soroban-devkit/core         │
│     (WalletAdapter interface, Result<T>, Logger, errors)     │
├──────────────────────────────────────────────────────────────┤
│                     Infrastructure                           │
│          Stellar SDK / Soroban RPC / Freighter API           │
└──────────────────────────────────────────────────────────────┘
```

**Key design decisions:**

- **ESM-first** — All packages ship ES modules as the primary target, with CommonJS interop where needed (CLI uses CJS for Node compatibility).
- **Tree-shakable exports** — Every package uses named exports to enable dead-code elimination in bundlers.
- **Adapter pattern for wallets** — `WalletAdapter` decouples application logic from specific wallet implementations. Swap `MemoryWallet` for `FreighterWalletAdapter` with zero application changes.
- **`Result<T>` over throw** — Core async APIs return `Result<T>` rather than throwing, making error handling explicit and type-safe.
- **Minimal runtime deps in core** — `@soroban-devkit/core` has zero production dependencies, keeping bundle sizes small.
- **Strict TypeScript** — All packages use `strict: true`, `noImplicitAny`, and `noImplicitThis`.

---

## Roadmap

| Milestone | Description | Status |
|---|---|---|
| **v0.1** | Core interfaces, package scaffolding, example contracts, basic CLI and examples | 🚧 In progress |
| **v0.2** | Concrete wallet adapters (Freighter, WalletConnect), contract client factory, codegen, improved test harnesses | 📋 Planned |
| **v1.0** | Stable public APIs, documentation site, broader ecosystem integrations, npm publish automation | 📋 Planned |

Track progress and upcoming work in the [open issues](https://github.com/sorocore/soroban-devkit/issues).

---

## Contributing

We warmly welcome contributions of all kinds — from typo fixes and documentation improvements to full feature implementations.

### Quick Start for Contributors

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/soroban-devkit.git
cd soroban-devkit

# 2. Install dependencies
pnpm install

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Make your changes, then verify everything passes
pnpm -w run typecheck
pnpm -w run lint
pnpm -w run test
pnpm -w run build

# 5. Commit using conventional commits
git commit -m "feat(wallet): add FreighterWalletAdapter"

# 6. Push and open a Pull Request
git push origin feat/your-feature-name
```

### Good First Issues

New to the codebase? Start here:

- [#1 — Implement real keypair generation in MemoryWallet](https://github.com/sorocore/soroban-devkit/issues/1)
- [#3 — Add typed SorobanError class hierarchy](https://github.com/sorocore/soroban-devkit/issues/3)
- [#5 — Add unit test suite for @soroban-devkit/core](https://github.com/sorocore/soroban-devkit/issues/5)
- [#6 — Write package-level READMEs for all packages](https://github.com/sorocore/soroban-devkit/issues/6)
- [#9 — Add Changesets workflow for automated versioning](https://github.com/sorocore/soroban-devkit/issues/9)

### Contribution Guidelines

- **Open an issue first** for any non-trivial change to discuss the approach before writing code.
- **One PR per concern** — keep pull requests focused and small.
- **Write tests** for any new functionality using `vitest`.
- **Follow TypeScript strict mode** — the CI enforces it.
- **Use [Conventional Commits](https://www.conventionalcommits.org/)** for commit messages.
- **Add a changeset** before opening your PR: `pnpm changeset`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community standards.

### Creating a New Package

1. Copy an existing package (e.g. `packages/core`) as a template.
2. Update `name`, `version`, and scripts in `package.json`.
3. Add a `tsconfig.json` that extends `../../tsconfig.base.json` with `"composite": true`.
4. Add the new package path to the root `tsconfig.json` references array.
5. Add a `README.md` describing what the package does.
6. Open a PR for discussion before implementing.

---

## Community & Support

| Channel | Link |
|---|---|
| 🐛 Bug reports & feature requests | [GitHub Issues](https://github.com/sorocore/soroban-devkit/issues) |
| 📖 Stellar / Soroban documentation | [developers.stellar.org](https://developers.stellar.org/docs/smart-contracts) |
| 💬 Stellar developer Discord | [discord.gg/stellar](https://discord.gg/stellar) |
| 🔐 Security vulnerabilities | See [SECURITY.md](./SECURITY.md) |

---

## License

[MIT](./LICENSE) © [sorocore](https://github.com/sorocore)

---

<div align="center">
  <sub>Built with ❤️ for the Stellar / Soroban developer community.</sub>
</div>
