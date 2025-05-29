"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
  { id: "sports", label: "Sports" },
];

const galleryItems = [
  {
    id: 1,
    category: "casual",
    title: "Summer Collection",
    before: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    after: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    category: "formal",
    title: "Business Attire",
    before: "https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    after: "https://images.pexels.com/photos/2922301/pexels-photo-2922301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    category: "sports",
    title: "Workout Gear",
    before: "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    after: "https://images.pexels.com/photos/2294353/pexels-photo-2294353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 4,
    category: "casual",
    title: "Weekend Style",
    before: "https://images.pexels.com/photos/5885576/pexels-photo-5885576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    after: "https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 5,
    category: "formal",
    title: "Evening Wear",
    before: "https://images.pexels.com/photos/12199790/pexels-photo-12199790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    after: "https://images.pexels.com/photos/10679171/pexels-photo-10679171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 6,
    category: "sports",
    title: "Athletic Collection",
    before: "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    after: "https://images.pexels.com/photos/3761892/pexels-photo-3761892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              StyleSync Gallery
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See the transformative power of our virtual try-on technology through these before and after examples.
            </p>
          </motion.div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <div className="flex justify-center">
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeCategory} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div 
                      className="relative overflow-hidden rounded-xl cursor-pointer aspect-[4/5] bg-muted"
                      onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
                    >
                      <div className={cn(
                        "absolute inset-0 transition-all duration-500 ease-in-out",
                        activeItem === item.id ? "opacity-0" : "opacity-100"
                      )}>
                        <img 
                          src={item.before} 
                          alt={`Before ${item.title}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-xs uppercase tracking-wider">{item.category}</p>
                          <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                          <p className="text-white/80 text-sm">Before</p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "absolute inset-0 transition-all duration-500 ease-in-out",
                        activeItem === item.id ? "opacity-100" : "opacity-0"
                      )}>
                        <img 
                          src={item.after} 
                          alt={`After ${item.title}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-xs uppercase tracking-wider">{item.category}</p>
                          <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                          <p className="text-white/80 text-sm">After</p>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        Click to compare
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}