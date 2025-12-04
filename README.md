# TourneyManager

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Architecture

This project follows the **Front-end Clean Architecture** principles to ensure scalability, maintainability, and low coupling. Each page should adhere to a standardized folder structure with the following four main abstractions:

### 📁 Required Folder Structure for Each Page

```
src/app/[page-name]/
├── components/     # UI presentation and user interactions
├── entities/       # Data adapters and transformations
├── services/      # External API communication
└── stores/        # Client-side data persistence and state management
```

### 🏗️ Architecture Layers

#### 🧩 **Components**

- Handle UI presentation, user interactions, and view updates
- Should remain agnostic to business logic
- Focus on performance and user experience

#### 👤 **Entities**

- Act as data adapters, transforming JSON from APIs into application-suitable formats
- Centralize data formatting and validation logic
- Provide documentation of data shapes used throughout the application
- Example: User entity, Product entity, etc.

#### 📞 **Services**

- Manage external communication (API calls, analytics tracking, etc.)
- Always return `Promise<Entity>` or `Promise<Entity[]>`
- Must remain stateless - no data persistence logic
- Handle GET, POST, UPDATE, DELETE operations

#### 🕋 **Stores**

- Manage client-side data persistence and application state
- Facilitate communication between components
- Can use services to fetch data when needed
- Handle state transitions and business logic

### 🎯 Benefits of This Structure

1. **Separation of Concerns**: Each layer has a clear, single responsibility
2. **Easy to Navigate**: Predictable structure across all pages
3. **Testable**: Business logic is decoupled from UI frameworks
4. **Scalable**: Easy to add new features without affecting existing code
5. **Framework Independent**: Core logic isn't tied to React/Next.js specifics

### 📖 Reference

This architecture is based on the principles outlined in [Eduardo Ottaviani's Front-end Clean Architecture guide](https://eduardo-ottaviani.medium.com/a-definitive-guide-to-front-end-clean-architecture-3a62418becb4).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
