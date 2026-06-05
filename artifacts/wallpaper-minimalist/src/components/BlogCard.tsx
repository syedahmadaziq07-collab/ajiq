import { Link } from "wouter";

interface BlogCardProps {
  date: string;
  title: string;
  image: string;
}

export function BlogCard({ date, title, image }: BlogCardProps) {
  return (
    <Link href="/blog" className="block group" data-testid={`blog-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col gap-2 hover:scale-[1.01] transition-transform duration-200">
        <div className="h-[90px] rounded-[8px] bg-[#F5F5F5] overflow-hidden">
          <img src={image} alt={title} width="400" height="300" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="mt-[2px]">
          <p className="text-[11px]">
            <span className="text-[#747474]">On </span>
            <span className="font-bold text-[#000]">{date}</span>
          </p>
          <h3 className="text-[14px] font-bold leading-[1.4] text-[#000] mt-1 group-hover:underline underline-offset-2">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
