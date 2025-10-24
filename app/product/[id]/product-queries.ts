export const productQueries = {
  all: [{ scope: "products" }] as const,

  details: () => [{ ...productQueries.all[0], entity: "detail" }] as const,

  detail: ({ id }: { id: string }) => [{ ...productQueries.details()[0], id }] as const,

  relatedLists: () => [{ ...productQueries.all[0], entity: "related" }] as const,

  relatedList: ({ id }: { id: string }) => [{ ...productQueries.relatedLists()[0], id }] as const,

  storeProducts: (storeId: string) => [{ ...productQueries.all[0], entity: "storeProducts", storeId }] as const,
};
