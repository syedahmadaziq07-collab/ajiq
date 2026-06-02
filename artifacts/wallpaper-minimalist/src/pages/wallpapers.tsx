import { useState } from "react";

export default function Wallpapers() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Nature", "Abstract", "Minimal", "Dark"];
  
  const wallpapers = [
    { id: 1, title: "Mountain Mist", category: "Nature", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop" },
    { id: 2, title: "Forest Light", category: "Nature", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop" },
    { id: 3, title: "Desert Calm", category: "Minimal", image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&h=400&fit=crop" },
    { id: 4, title: "Ocean Minimal", category: "Abstract", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop" },
    { id: 5, title: "Lake Serenity", category: "Nature", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop" },
    { id: 6, title: "Rocky Peak", category: "Minimal", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop" },
  ];

  const filteredWallpapers = activeFilter === "All" 
    ? wallpapers 
    : wallpapers.filter(w => w.category === activeFilter);

  return (
    <div className="w-full min-h-screen">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Wallpapers
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Download beautiful minimal wallpapers for every device.
        </p>
      </section>

      <section className="px-4 sm:px-8 py-4 max-w-[1200px] mx-auto flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map(filter => (
          <button
            key={filter}
            className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-[#000] text-white rounded-[20px]' : 'bg-white border border-[#EEEEEE] rounded-[20px] text-[#000]'}`}
            onClick={() => setActiveFilter(filter)}
            data-testid={`filter-${filter.toLowerCase()}`}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="px-4 sm:px-8 py-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWallpapers.map(wallpaper => (
            <div key={wallpaper.id} className="border border-[#EEEEEE] rounded-[10px] overflow-hidden group hover:scale-[1.01] transition-transform duration-200 bg-white flex flex-col" data-testid={`wallpaper-${wallpaper.id}`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={wallpaper.image} alt={wallpaper.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500] hover:bg-[#222]" data-testid={`btn-download-${wallpaper.id}`}>
                    Download
                  </button>
                </div>
              </div>
              <div className="p-3 pb-1 flex flex-col justify-end">
                <h3 className="text-[13px] font-[600] text-[#000]">{wallpaper.title}</h3>
                <div className="mt-2 mb-3">
                  <span className="bg-[#000] text-white text-[12px] px-2 py-0.5 rounded-[4px]">Free</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <button className="border border-[#767676] rounded-[10px] h-[50px] px-8 bg-white text-[#000] text-[15px] font-[500] hover:bg-[#F5F5F5] transition-colors" data-testid="btn-load-more">
            Load more
          </button>
        </div>
      </section>
    </div>
  );
}
