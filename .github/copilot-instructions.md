# GitHub Copilot Instructions

## TypeScript & JavaScript Rules

### General Principles

- Always use TypeScript
- Follow algorithmic approach to writing code
- Avoid code comments - code should be self-explanatory
- Use latest ECMAScript features and best practices
- Prefer functional programming patterns where applicable

### Type System

- Always use `type` instead of `interface`
- Type names must follow the pattern: `TName`, `TUserProps`, `TAvatarData`
- Store all types in a separate `types.ts` file
- Examples:
  ```typescript
  type TUser = { name: string; age: number };
  type TButtonProps = { onClick: () => void; label: string };
  ```

### Module Exports

- Always use Named Exports
- Never use default exports
- Example: `export const Component = () => {}`

## React Components

### Component Structure

- Components must be arrow functions
- Always use React.memo for memoization
- Props must be destructured in function arguments
- Never use `React.FC` or `FC` type annotations

Example:

```typescript
export const Button = memo((props: TButtonProps) => {
  return <button onClick={props.onClick}>{props.label}</button>;
});
```

### Component Architecture

- Break large components into smaller, focused components
- Extract all state logic into custom hooks
- Component should only handle rendering
- Custom hooks should handle all business logic and state management

Example pattern:

```typescript
const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
  return { count, increment };
};

export const Counter = memo(() => {
  const { count, increment } = useCounter();
  return <button onClick={increment}>{count}</button>;
});
```

### File Organization

- `Component.tsx` - component implementation
- `types.ts` - all TypeScript types
- `hooks.ts` or `useComponentName.ts` - custom hooks
- `utils.ts` - utility functions (if needed)

## Code Style

### Naming Conventions

- Types: `TName`, `TProps`
- Components: PascalCase
- Hooks: `useHookName`
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE for true constants, camelCase for config objects

### Best Practices

- Immutable data patterns
- Pure functions where possible
- Avoid side effects in render logic
- Use early returns to reduce nesting
- Prefer composition over inheritance
- Keep functions small and focused (single responsibility)

## Performance

- Memoize all components with React.memo
- Use useMemo for expensive calculations
- Use useCallback for function props passed to children
- Avoid inline object/array creation in JSX

## State Management

- Extract all useState, useEffect, useReducer into custom hooks
- Keep components "dumb" - they only receive props and render
- Business logic lives in hooks, not components
