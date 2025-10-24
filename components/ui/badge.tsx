import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border p-2 py-0.5 body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-blueSubtle text-accent-bluePrimary shadow",
        secondary: "border-transparent bg-neutral-graySecondary text-neutral-blackPrimary",
        destructive: "border-transparent bg-feedback-error-lighter text-feedback-error shadow",
        outline: "border-neutral-graySecondary text-neutral-grayPrimary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  imageUrl?: string;
  imageAlt?: string;
}

function Badge({ className, variant, imageUrl, imageAlt, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {imageUrl && (
        <div className="relative w-4 h-4 rounded-full overflow-hidden mr-1.5 flex-shrink-0">
          <Image src={imageUrl} alt={imageAlt || ""} fill className="object-cover" />
        </div>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
