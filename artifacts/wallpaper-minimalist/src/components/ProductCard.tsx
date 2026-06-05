import { Link } from "wouter";

interface ProductCardProps {
  category: string;
  image: string;
  href: string;
}

export function ProductCard({ category, image, href }: ProductCardProps) {
  return (
    <Link href={href} className="block group" data-testid={`card-${category.toLowerCase()}`}>
      <div className="border border-[#EEEEEE] rounded-[10px] p-5 bg-white relative hover:scale-[1.01] transition-transform duration-200">
        <div className="absolute top-5 right-5 text-[#000] text-[16px] z-10 font-bold">
          ↗
        </div>
        <div className="h-[120px] rounded-[8px] overflow-hidden mb-4">
          <img src={image} alt={category} width="400" height="300" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-[#000]">{category}</h3>
          <p className="text-[#747474] text-[11px] mt-0.5">Browse all {category}</p>
        </div>
      </div>
    </Link>
  );
}
