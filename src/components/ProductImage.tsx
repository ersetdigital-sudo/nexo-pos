"use client";

import { Product } from "@/store";

interface ProductImageProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-9 h-9 sm:w-11 sm:h-11", text: "text-lg sm:text-xl" },
  md: { container: "w-10 h-10 sm:w-12 sm:h-12", text: "text-xl sm:text-2xl" },
  lg: { container: "w-14 h-14 sm:w-16 sm:h-16", text: "text-2xl sm:text-3xl" },
};

export default function ProductImage({ product, size = "md", className = "" }: ProductImageProps) {
  const s = sizeMap[size];

  if (product.imageUrl) {
    return (
      <div className={`${s.container} rounded-xl overflow-hidden border border-primary-100/40 flex-shrink-0 ${className}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`${s.container} rounded-xl bg-primary-50 border border-primary-100/40 flex items-center justify-center ${s.text} flex-shrink-0 ${className}`}>
      {product.image}
    </div>
  );
}
