export const userCollectionsQueries = {
  all: [{ scope: "user-collections" }] as const,

  lists: () => [{ ...userCollectionsQueries.all[0], entity: "list" }] as const,

  list: ({ userId }: { userId: string }) => [{ ...userCollectionsQueries.lists()[0], userId }] as const,
};

export type UserCollectionsQueryKey = ReturnType<typeof userCollectionsQueries.list>;
