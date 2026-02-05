# TAPA AI Platform - Development Guide

## 1. Build/Lint/Test Commands

### Development Server
```bash
pnpm dev
```
Starts the Vite development server on port 5173 (default).

### Build for Production
```bash
pnpm build
```
Builds the application for production in the `dist/` directory.

### Preview Production Build
```bash
pnpm preview
```
Previews the production build locally.

### Linting
```bash
pnpm lint
```
Runs ESLint with TypeScript support to check for code quality issues.

### Testing
```bash
pnpm test          # Run tests in watch mode
pnpm test:run      # Run all tests once
pnpm test:coverage # Run tests with coverage report
```
Uses Vitest for testing. Coverage reports are generated in `coverage/` directory.

## 2. Code Style Guidelines

### Imports
- **Order**: External dependencies first, then internal modules, then relative imports
- **Format**: Use named imports where possible for clarity
- **Example**:

  ```typescript
  import React from 'react';
  import { Link, useNavigate } from 'react-router';
  import { useAuth, isGuestUser } from '../hooks/useAuth';
  import { Button } from '../components';
  import tapaIcon from '../assets/tapa-icon.png';
  ```

### Formatting
- **Indentation**: 2 spaces
- **Line Length**: Aim for 80 characters max
- **Semicolons**: Optional
- **Quotes**: Single quotes for strings, backticks for templates

### Types
- **TypeScript**: Strict type definitions are required
- **Interfaces**: Use `interface` for object types (PascalCase)
- **Type Aliases**: Use `type` for unions/intersections
- **Optional Properties**: Mark optional fields with `?`
- **Example**:

  ```typescript
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
  }
  ```

### Naming Conventions
- **Components**: PascalCase (e.g., `Button`, `LandingPage`)
- **Functions/Hooks**: camelCase (e.g., `useAuth`, `isGuestUser`)
- **Variables**: camelCase (e.g., `userProfile`, `selectedModel`)
- **Constants**: UPPERCASE_SNAKE_CASE (e.g., `GUEST_PROFILE`)
- **Interfaces/Types**: PascalCase (e.g., `GuestUser`, `OpenRouterModel`)
- **Files**: PascalCase for components/pages, kebab-case for utilities

### React Component Guidelines
- **Function Components**: Use arrow function syntax. Avoid Class Components.
- **Props**: Destructure props at the beginning of components
- **Hooks**: Call hooks at the top level of components
- **Example**:

  ```typescript
  const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    loading = false,
    icon,
    iconPosition = 'left',
    disabled,
    className = '',
    ...props
  }) => {
    // Component logic here
  };
  ```

## 3. Project-Specific, Non-Obvious Information

### Tech Stack Overview
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.x
- **Backend**: Convex (Realtime Database + Functions)
- **Authentication**: Convex Auth (with guest user support)
- **AI Integration**: OpenRouter API (multiple LLM models)
- **Testing**: Vitest + React Testing Library
- **Icons**: Phosphor Icons

### Convex Backend Structure
Located in `/convex/` directory:
- `schema.ts`: Database schema definition
- `auth.config.js`: Authentication configuration
- `auth.ts`: Authentication helpers
- `users.ts`: User profile management
- `interactions.ts`: Interaction logging
- `creemCheckout.ts`: Payment integration (Creem checkout)
- `http.ts`: HTTP endpoints
- `_generated/`: Auto-generated files (API types, etc.)

### Key Features
1. **Guest Mode**: Users can try the app without signing up
2. **Multiple AI Models**: Access to OpenRouter models (free and premium)
3. **Subscription Tiers**: Free and Premium ($15/month) plans
4. **Mascot Guide**: Interactive AI companion (TAPA)
5. **Chat Interface**: Real-time messaging with AI models
6. **Usage Analytics**: Tracks interactions and token usage

### Environment Variables
Required variables (in `.env` file):
```env
VITE_CONVEX_URL=your_convex_deployment_url
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Convex Database Tables
1. `auth_users`: Authentication records (from Convex Auth)
2. `user_profiles`: User profile information (subscription status, etc.)
3. `interaction_logs`: Chat interactions with AI models
4. `model_access`: Model access permissions per user
5. `usage_analytics`: Daily usage statistics

### Routing Structure
- `/`: Landing page
- `/login`: Login page
- `/signup`: Sign up page
- `/dashboard`: Dashboard with model selection
- `/chat`: AI chat interface
- `/payment-success`: Payment confirmation page
- `/privacy-policy`: Privacy policy
- `/terms-of-service`: Terms of service

### Styling System
- Uses Tailwind CSS with custom gradient colors:
  - Primary: `from-[#812dea] to-[#4ea6fd]` (purple to blue)
  - Secondary: Various gray shades
- Dark mode support via `dark:` class prefix
- Responsive design with `sm:`, `md:`, `lg:` breakpoints

### Key Hooks
- `useAuth()`: Authentication state and user info
- `useUserProfile()`: User profile data
- `useModels()`: AI model management (free/premium filtering)
- `useSelectedModel()`: Currently selected AI model
- `useModelAvailability()`: Check if model is available to user

### Build Configuration
- **Vite**: Fast build tool with React plugin
- **ESLint**: TypeScript + React hooks rules
- **TypeScript**: Strict type checking (tsconfig.app.json)
- **Vitest**: Unit testing with coverage reporting

### Deployment
- **Netlify**: CI/CD integration (auto-deploys on git push)
- **Build Command**: `pnpm build`
- **Output Directory**: `dist/`

### Testing Setup
- Test files: Located in `src/test/`
- Setup file: `src/test/setup.ts`
- Coverage: Generated in `coverage/` directory
- Uses Vitest globals and Node environment for testing
