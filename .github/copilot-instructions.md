# Copilot Instructions for Lovable E-commerce Frontend

## Project Overview
- **Stack:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui
- **Purpose:** Modern e-commerce frontend with modular UI, state management, and API integration.

## Key Architecture & Patterns
- **Pages:** All route-level pages in `src/pages/`, organized by feature (e.g., `Product/`, `Cart/`, `Admin/`).
- **Components:** Reusable UI in `src/components/`, grouped by domain (e.g., `product/`, `profile/`, `ui/`).
- **API Layer:** All API calls in `src/api/` (e.g., `products.api.ts`, `cart.api.ts`). Use these for data fetching/mutations.
- **State Management:** Stores in `src/stores/` (e.g., `authStore.ts`, `cartStore.ts`) use Zustand for global state.
- **Constants & Types:** Shared constants in `src/constants/`, types in `src/types/`.
- **Utilities:** Common helpers in `src/lib/utils.ts`.

## Developer Workflows
- **Install dependencies:** `npm i`
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Lint:** `npm run lint`
- **Format:** `npm run format`

## Project Conventions
- **Component Naming:** PascalCase for components, camelCase for hooks and utils.
- **File Structure:** Co-locate feature-specific components under their domain (e.g., `product/ProductCard.tsx`).
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS unless necessary (see `App.css`).
- **UI Library:** Use shadcn-ui primitives from `src/components/ui/` for consistent design.
- **Routing:** Page files in `src/pages/` map to routes. Use constants from `src/constants/routes.ts` for navigation.
- **State:** Use Zustand stores for cross-component state. Avoid React context for global state.
- **API Usage:** Always use the API layer in `src/api/` for server communication. Do not call fetch/axios directly in components.

## Integration & External Services
- **Socket:** Real-time features use `src/services/socket.ts`.
- **Lovable Platform:** Project can be edited/deployed via [Lovable](https://lovable.dev/projects/a5de8499-a76f-457f-bf2e-02cb278abcb2).

## Examples
- **Product Card:** See `src/components/product/ProductCard.tsx` for UI/data pattern.
- **Cart State:** See `src/stores/cartStore.ts` for Zustand usage.
- **API Call:** See `src/api/products.api.ts` for data fetching pattern.

## Additional Notes
- **No direct DOM manipulation.**
- **No jQuery or legacy libraries.**
- **Keep code modular and composable.**
- **Document new patterns in this file.**
