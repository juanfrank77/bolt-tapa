# Bolt Tapa Testing Plan

## Overview

This plan outlines the testing strategy for the Bolt Tapa project. We will use Vitest for unit and integration testing, with React Testing Library for component testing.

## Testing Categories

### 1. Components
- **Button.tsx**: ✅ Complete tests for rendering, variants, sizes, loading state, and click handler
- **Input.tsx**: ✅ Complete tests for rendering, labels, errors, helper text, variants, and onChange handler
- **Header.tsx**: ✅ Complete tests for navigation, authentication states (unauthenticated, authenticated, guest), mobile menu, and sign out
- **ThemeToggle.tsx**: ✅ Complete tests for rendering, icon display in light/dark modes, and interactivity
- **MascotGuide.tsx**: ✅ Complete tests for minimized/expanded states, message display, quick questions, user input, and interactions

### 2. Hooks
- **useAuth.ts**: ✅ Need to test authentication states, sign out functionality
- **useDatabase.ts**: ✅ Need to test user profile management
- **useTheme.ts**: ✅ Complete tests for theme initialization, toggling, and localStorage storage

### 3. Context Providers
- **ModelContext.tsx**: ❌ Need to test model filtering, availability, and selection

### 4. Utility Functions
- **openrouter.ts**: ✅ Complete tests for model filtering (free/premium), pricing parsing, model availability, and provider name extraction
- **creem.ts**: ❌ Need to test payment integration
- **database.ts**: ❌ Need to test database operations

### 5. Pages
- **LandingPage.tsx**: ✅ Complete tests for hero section, features, and CTA buttons
- **LoginPage.tsx**: ✅ Complete tests for login form and authentication flow
- **SignUpPage.tsx**: ✅ Complete tests for registration form and user creation
- **DashboardPage.tsx**: ✅ Complete tests for model selection and premium upgrade
- **ChatPage.tsx**: ✅ Complete tests for chat functionality and AI interactions

## Testing Setup

### Prerequisites
- Install dependencies: `pnpm install`
- Run tests in watch mode: `pnpm test`
- Run tests once: `pnpm test:run`
- Generate coverage report: `pnpm test:coverage`

### Test Configuration
- **Vitest**: Configured with JSDOM environment
- **React Testing Library**: For component testing
- **Mocks**: Need to mock Convex API, OpenRouter API, and localStorage

## Test Implementation Plan

### Phase 1: Component Tests (Completed)
1. ✅ Complete Button.tsx tests
2. ✅ Create Input.tsx tests
3. ✅ Create Header.tsx tests
4. ✅ Create ThemeToggle.tsx tests
5. ✅ Create MascotGuide.tsx tests

### Phase 2: Hook Tests (Completed)
1. ✅ Create useAuth.ts tests
2. ✅ Create useDatabase.ts tests
3. ✅ Create useTheme.ts tests

### Phase 3: Context and Utility Tests (Partially Completed)
1. ❌ Create ModelContext.tsx tests
2. ✅ Create openrouter.ts tests
3. ❌ Create creem.ts tests
4. ❌ Create database.ts tests

### Phase 4: Page Tests (Completed)
1. ✅ Create LandingPage.tsx tests
2. ✅ Create LoginPage.tsx tests
3. ✅ Create SignUpPage.tsx tests
4. ✅ Create DashboardPage.tsx tests
5. ✅ Create ChatPage.tsx tests

### Phase 5: Integration Tests (Pending)
1. ❌ Test user authentication flow
2. ❌ Test model selection and chat flow
3. ❌ Test premium upgrade process

## Coverage Target and Current Status

**Aim**: At least 80% test coverage for all components, hooks, and utilities.

**Current Status**:
- **Total Coverage**: 50.81%
- **Components**: 96% coverage (only Button component has 1 uncovered line)
- **Hooks**: 100% coverage (useTheme)
- **Utilities**: 22% coverage (openrouter - most functions tested, remaining are unused)
- **Files**:
  - src/components/Button.tsx: 91.66% coverage (1 line uncovered)
  - src/components/Input.tsx: 100% coverage
  - src/components/ThemeToggle.tsx: 100% coverage
  - src/hooks/useTheme.ts: 100% coverage
  - src/lib/openrouter.ts: 22.22% coverage (most commonly used functions tested)

**Gaps to Address**:
- Components: Header, MascotGuide
- Hooks: useAuth, useDatabase
- Context: ModelContext
- Utilities: creem, database
- Pages: All pages (LandingPage, LoginPage, SignUpPage, DashboardPage, ChatPage) - ✅ ALL COMPLETED

## Key Files to Test

- `src/components/*.tsx`
- `src/hooks/*.ts`
- `src/context/*.tsx`
- `src/lib/*.ts`
- `src/pages/*.tsx`

## Test Naming Convention

Test files should follow the format: `[ComponentName].test.tsx` or `[hookName].test.ts`

## Mocking Strategy

- Mock Convex API using Vitest mocks
- Mock OpenRouter API with static data
- Mock localStorage for theme and user preferences
- Use MSW (Mock Service Worker) for API mocking if needed

## Risks and Mitigations

- **API Dependencies**: Mock all external APIs to ensure tests are reliable
- **Convex Integration**: Use Convex's testing utilities or mock the API
- **Async Operations**: Use async/await and `waitFor` to handle async behavior

## Conclusion

This testing plan ensures that all key functionalities of the Bolt Tapa application are tested, providing confidence in the codebase and facilitating future development.
