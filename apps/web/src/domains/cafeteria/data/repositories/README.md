# Cafeteria Repository Layer

This directory contains the data access layer for the Cafeteria domain following Repository pattern.

## Files

### Production Repositories
- `cafeteria-repository.ts` - Real implementation using HttpClient
- `cafeteria-review-repository.ts` - Real implementation for review operations

### Stub/Mock Repositories (Development Only)
- `cafeteria-repository.stub.ts` - Mock implementation for development without backend
- `cafeteria-review-repository.stub.ts` - Mock implementation for review operations

## Mock Mode

The project supports a **Mock Mode** for frontend development without a running backend server.

### Enabling Mock Mode

Set the environment variable in `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK=true
```

### How It Works

The DI Container (`src/di/cafeteria-*-container.ts`) checks this environment variable and automatically uses Stub repositories instead of real implementations:

```typescript
// In DI Container
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

if (useMock) {
  return new CafeteriaRepositoryStub(); // No HttpClient needed
} else {
  return new CafeteriaRepositoryImpl(httpClient); // Uses real API
}
```

### When to Use Mock Mode

- ✅ **Frontend development** without backend dependency
- ✅ **UI/UX prototyping** and design validation
- ✅ **Component development** in isolation
- ✅ **Storybook stories** that need data
- ❌ **Production builds** (always set to `false`)
- ❌ **Integration testing** with real APIs

### Mock Data Location

Mock data is stored separately in:
- `/src/domains/cafeteria/mocks/` - Contains mock data generators and fixtures

### Current Status

⚠️ **Note**: Some Stub methods are not fully implemented yet and return empty data with TODO comments. These will be completed as the corresponding API endpoints are developed on the backend.

## Architecture

```
DI Container
    ↓
Repository Interface (types)
    ↓
├─ Real Implementation (HttpClient)
└─ Stub Implementation (Mock Data)
```

This architecture allows seamless switching between real and mock data without changing any business logic or UI code.
