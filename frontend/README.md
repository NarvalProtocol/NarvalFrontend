# Narval Finance Frontend

A Next.js 15 application providing a user interface for blockchain financial services.

## Project Overview

Narval Finance is a decentralized finance (DeFi) platform focused on lending, liquidity provision, and asset management services on the Sui blockchain. This frontend application provides a user-friendly interface enabling users to interact with Narval protocol smart contracts.

### Key Features

- Wallet connection and management
- Asset lending and borrowing
- Liquidity provision
- Strategy management
- Governance participation
- User dashboard

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Blockchain Integration**: 
  - [Sui SDK](https://github.com/MystenLabs/sui)
  - [Sui Dapp Kit](https://github.com/MystenLabs/sui/tree/main/sdk/dapp-kit)
  - [Suiet Wallet Kit](https://github.com/suiet/wallet-kit)
- **Form Validation**: [Zod](https://github.com/colinhacks/zod)
- **Code Quality**:
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
  - [Husky](https://typicode.github.io/husky/)
  - [lint-staged](https://github.com/okonet/lint-staged)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/narval-frontend.git
   cd narval-frontend/frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Environment setup:
   ```bash
   cp .env.example .env.local
   ```
   Edit the `.env.local` file as needed.

### Development

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
frontend/
├── .husky/                # Git hooks configuration
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable components
│   │   ├── ui/            # Basic UI components
│   │   ├── layout/        # Layout components
│   │   ├── wallet/        # Wallet-related components
│   │   └── ...
│   ├── context/           # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Common library functions
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── .env.example          # Environment variables example
├── .gitignore            # Git ignore file
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the production version
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint checks
- `pnpm format`: Format code with Prettier

## Coding Standards

- Use ESLint and Prettier for code style checking
- Follow TypeScript strict type checking
- Use Husky and lint-staged for pre-commit code quality checks
- Follow [Conventional Commits](https://www.conventionalcommits.org/) specification

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
