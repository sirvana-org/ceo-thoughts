"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { fetchExternalProfile } from "@/lib/users";
import { ExternalProfileCollections } from "./external-profile-collections";
import { externalProfileQueries } from "./external-profile-queries";

export const getInitials = ({ name }: { name: string | null }) => {
  if (!name) {
    return "M";
  }

  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "M";
  }

  const first = parts[0]?.[0];
  const last = parts[parts.length - 1]?.[0];
  return `${first ?? ""}${last ?? ""}`.toUpperCase() || "M";
};

interface ExternalProfileContentProps {
  userId: string;
}

export function ExternalProfileContent({ userId }: ExternalProfileContentProps) {
  const { data, isLoading } = useQuery({
    queryKey: externalProfileQueries.detail({ userId }),
    queryFn: () => fetchExternalProfile(userId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-16 px-6 md:px-8 lg:px-12">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-lg px-12 py-16 flex flex-col items-center gap-8 animate-pulse">
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 shadow-md ring-1 ring-gray-200" />
          <div className="space-y-2 text-center w-full">
            <div className="mx-auto h-3 w-32 bg-gray-200 rounded-full" />
            <div className="mx-auto h-6 w-40 bg-gray-200 rounded-full" />
          </div>
          <div className="h-12 w-44 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-6 md:p-8">
      <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
        {data.picture ? (
          <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden">
            <Image
              src={data.picture}
              alt={data.name ? `${data.name}'s avatar` : "Melian profile avatar"}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <span className="text-4xl font-semibold text-gray-600">{getInitials(data)}</span>
        )}
        <div className="flex flex-col items-center gap-1">
          <h1 className="headline-small text-neutral-blackPrimary">{data.name}</h1>
          <p className="body-medium text-neutral-blackPrimary">{data.description}</p>
        </div>
      </div>
      <div className="w-full max-w-7xl">
        <ExternalProfileCollections userId={userId} />
      </div>
    </div>
  );
}
