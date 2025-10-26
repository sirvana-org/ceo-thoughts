export const storeQueries = {
  all: [{ scope: "stores" }] as const,

  details: () => [{ ...storeQueries.all[0], entity: "detail" }] as const,

  detail: ({ id }: { id: string }) => [{ ...storeQueries.details()[0], id }] as const,

  productLists: () => [{ ...storeQueries.all[0], entity: "products" }] as const,

  products: ({ id, category }: { id: string; category?: string }) =>
    [{ ...storeQueries.productLists()[0], id, category }] as const,
};

export type StoreDetailQueryKey = ReturnType<typeof storeQueries.detail>;
export type StoreProductsQueryKey = ReturnType<typeof storeQueries.products>;
