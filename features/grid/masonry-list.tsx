"use client";

import Masonry from "react-masonry-css";

interface MasonryItem {
  id: string;
  width?: number;
  height?: number;
}

interface MasonryListProps<T extends MasonryItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function MasonryList<T extends MasonryItem>({
  items,
  renderItem,
  className = "",
}: MasonryListProps<T>) {
  return (
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
  );
}
