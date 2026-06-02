import { Link } from "wouter";

export default function Guides() {
  const guides = [
    { 
      id: 1, 
      title: "The iPhone Setup Guide", 
      desc: "Optimize your iPhone for a minimal, productive experience.", 
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" 
    },
    { 
      id: 2, 
      title: "Clean Mac Workspace", 
      desc: "Set up your Mac for focus and clean aesthetics.", 
      img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop" 
    },
    { 
      id: 3, 
      title: "Digital Minimalism 101", 
      desc: "Declutter your digital life across all devices.", 
      img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" 
    },
  ];

  return (
    <div className="w-full min-h-screen pb-10">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Guides
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Step-by-step guides to build a cleaner digital life.
        </p>
      </section>

      <section className="mt-8">
        {guides.map(guide => (
          <div key={guide.id} className="border-b border-[#EEEEEE]" data-testid={`guide-row-${guide.id}`}>
            <div className="flex items-center gap-4 py-5 max-w-[1200px] mx-auto px-4 sm:px-8">
              <div className="w-[80px] h-[80px] shrink-0 rounded-[8px] overflow-hidden bg-[#F5F5F5]">
                <img src={guide.img} alt={guide.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-[700] text-[15px] text-[#000]">{guide.title}</h3>
                <p className="text-[#747474] text-[13px] mt-1 line-clamp-2">{guide.desc}</p>
              </div>
              <div className="shrink-0 pl-2">
                <Link href="#" className="text-[#0000EE] text-[13px] hover:underline underline-offset-2" data-testid={`btn-read-guide-${guide.id}`}>
                  Read Guide →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
