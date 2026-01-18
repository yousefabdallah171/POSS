# Dashboard App - Restaurant POS SaaS

Complete dashboard with authentication system.

## Quick Start

```bash
# Install dependencies
pnpm install

# Create .env file
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env

# Run development server
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002)

## Routes

- `/` - Auto-redirects to `/auth/login` or `/dashboard` based on auth state
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Password reset page
- `/dashboard` - Protected dashboard (requires auth)

## Features

- ✅ Full authentication flow
- ✅ Multi-tenant support
- ✅ Form validation with Zod
- ✅ State management with Zustand
- ✅ API client with Axios
- ✅ Dark/Light mode
- ✅ Toast notifications
- ✅ Protected routes
- ✅ Auto-logout on token expiry

## Tech Stack

- Next.js 15
- TypeScript
- TailwindCSS
- Shadcn/UI
- React Hook Form
- Zod
- Zustand
- Axios
- Sonner
