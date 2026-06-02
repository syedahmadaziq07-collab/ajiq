import { useState } from "react";

export default function Templates() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Notion", "Productivity", "Planning"];
  
  const templates = [
    { id: 1, title: "Weekly Planner", category: "Notion", image: "https://images.unsplash.com/photo-1484788984921-03950022c38b?w=600&h=400&fit=crop" },
    { id: 2, title: "Goal Tracker", category: "Productivity", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop" },
    { id: 3, title: "Daily Journal", category: "Planning", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop" },
  ];

  const filteredTemplates = activeFilter === "All" 
    ? templates 
    : templates.filter(t => t.category === activeFilter);

  return (
    <div className="w-full min-h-screen">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Templates
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Clean, functional templates for productive workflows.
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
          {filteredTemplates.map(template => (
            <div key={template.id} className="border border-[#EEEEEE] rounded-[10px] overflow-hidden group hover:scale-[1.01] transition-transform duration-200 bg-white flex flex-col" data-testid={`template-${template.id}`}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-[12px] flex flex-col gap-3">
                <div>
                  <h3 className="text-[14px] font-[700] text-[#000]">{template.title}</h3>
                  <div className="mt-2">
                    <span className="bg-[#000] text-white text-[12px] px-2 py-0.5 rounded-[4px]">Free</span>
                  </div>
                </div>
                <button className="w-full bg-[#000] text-white rounded-[8px] h-[40px] text-[13px] font-[500] hover:bg-[#222] transition-colors" data-testid={`btn-get-template-${template.id}`}>
                  Get Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
