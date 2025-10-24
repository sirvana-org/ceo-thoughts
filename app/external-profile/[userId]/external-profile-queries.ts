export const externalProfileQueries = {
  all: [{ scope: "external-profile" }] as const,

  details: () => [{ ...externalProfileQueries.all[0], entity: "detail" }] as const,

  detail: ({ userId }: { userId: string }) => [{ ...externalProfileQueries.details()[0], userId }] as const,
};

export type ExternalProfileDetailQueryKey = ReturnType<typeof externalProfileQueries.detail>;
