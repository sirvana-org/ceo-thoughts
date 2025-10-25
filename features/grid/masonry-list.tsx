"use client";

import Masonry from "react-masonry-css";
import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/mixpanel";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-16 h-16 border-[6px]",
  };
  return (
    <div
      className={`${sizeClasses[size]} border-neutral-graySecondary border-b-accent-bluePrimary rounded-full inline-block box-border animate-spin ${className}`}
    />
  );
}

interface MasonryItem {
  id: string;
  width?: number;
  height?: number;
}

interface MasonryListProps<T extends MasonryItem> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function MasonryList<T extends MasonryItem>({
  items,
  renderItem,
  className = "",
  onLoadMore,
  isLoadingMore = false,
}: MasonryListProps<T>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onLoadMore || isLoadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackEvent("infinite_scroll", {
            items_loaded: items.length,
          });
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, isLoadingMore, items.length]);

  return (
    <>
      <Masonry
        breakpointCols={{
          default: 5,
          1280: 5,
          1024: 4,
          768: 3,
          640: 2,
        }}
        className={`flex gap-4 md:gap-6 ${className}`}
        columnClassName="flex flex-col gap-4 md:gap-6"
      >
        {items.map((item, index) => (
          <div key={item.id}>{renderItem(item, index)}</div>
        ))}
      </Masonry>

      {onLoadMore && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {isLoadingMore && <Spinner size="md" />}
        </div>
      )}
    </>
  );
}
