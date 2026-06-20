import { Link } from "wouter";
import { optimizeImage } from "../lib/image";

interface ProductCardProps {
  category: string;
  image: string;
  href: string;
}

export function ProductCard({ category, image, href }: ProductCardProps) {
  return (
    <Link href={href} className="block group" data-testid={`card-${category.toLowerCase()}`}>
      <div className="border border-[#EEEEEE] rounded-[10px] p-5 bg-white relative">
        <div className="absolute top-5 right-5 text-[#000] text-[16px] z-10 font-bold">
          ↗
        </div>
        <div className="aspect-[4/3] rounded-[8px] overflow-hidden mb-4 bg-[#f5f5f5]">
          <img src={optimizeImage(image, 400)} alt={category} width="400" height="300" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-[#000]">{category}</h3>
          <p className="text-[#747474] text-[11px] mt-0.5">Browse all {category}</p>
        </div>
      </div>
    </Link>
  );
}
