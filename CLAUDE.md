we use pnpm for installing deps and running commands
this is a nextjs project

## React Query + SSR Setup

This project uses TanStack Query v5 with Next.js App Router SSR pattern.

### Architecture

**Two-File Setup:**
1. `app/get-query-client.ts` - Query client factory with server/client isolation
2. `app/providers.tsx` - Client-side QueryClientProvider wrapper

**Critical Principles:**
- Server: Always creates NEW QueryClient (prevents data leakage between users)
- Client: Reuses singleton QueryClient (prevents React suspense recreation)
- Default `staleTime: 60s` prevents immediate refetch after SSR hydration

### How to Use in Server Components

```tsx
import { getQueryClient } from '@/app/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function Page() {
  const queryClient = getQueryClient()

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  )
}
```

### How to Use in Client Components

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'

export function ClientComponent() {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return <div>{data?.map(...)}</div>
}
```

### Best Practices

**DO:**
- Use `queryClient.prefetchQuery()` in server components for data prefetching
- Wrap prefetched content with `<HydrationBoundary state={dehydrate(queryClient)}>`
- Let client components access data via `useQuery()` with same queryKey
- Use server components as "prefetch locations" only

**DO NOT:**
- Render prefetched data in server components (causes sync issues on revalidation)
- Use `queryClient.fetchQuery()` and pass result to client components
- Put QueryClient in useState (breaks with React suspense)
- Share QueryClient between server requests (data leakage risk)

### Common Patterns

**Prefetch + Client Render:**
```tsx
// Server Component
export default async function PostsPage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}

// Client Component
'use client'
function Posts() {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts, // Will use prefetched data, won't refetch for 60s
  })
  return <div>{data?.map(...)}</div>
}
```

**Parallel Prefetching:**
```tsx
await Promise.all([
  queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts }),
  queryClient.prefetchQuery({ queryKey: ['users'], queryFn: getUsers }),
])
```

### Why This Matters

- **Data Leakage Prevention**: Each server request gets isolated QueryClient
- **Hydration Optimization**: 60s staleTime prevents wasteful refetch after SSR
- **Streaming Support**: Dehydrate config enables streaming pending queries
- **Type Safety**: QueryKey consistency between server prefetch and client usage
