export const collectionQueries = {
  all: [{ scope: "collections" }] as const,

  details: () => [{ ...collectionQueries.all[0], entity: "detail" }] as const,

  detail: ({ id }: { id: string }) => [{ ...collectionQueries.details()[0], id }] as const,

  productLists: () => [{ ...collectionQueries.all[0], entity: "products" }] as const,

  products: ({ id }: { id: string }) => [{ ...collectionQueries.productLists()[0], id }] as const,
};
