"use client";

import { useState } from "react";
import { motion } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const galleryItems = [
  {
    id: 1,
    title: "Virtual Try-On Example 1",
    before: "/assets/PersonTryOnBefore-1.png",
    after: "/assets/PersonTryOnAfter-1.png",
    description: "Elegant dress transformation"
  },
  {
    id: 2,
    title: "Virtual Try-On Example 2", 
    before: "/assets/PersonTryOnBefore-2.png",
    after: "/assets/PersonTryOnAfter-2.png",
    description: "Casual outfit styling"
  },
  {
    id: 3,
    title: "Virtual Try-On Example 3",
    before: "/assets/PersonTryOnBefore-3.png", 
    after: "/assets/PersonTryOnAfter-3.png",
    description: "Professional attire fitting"
  },
];

const additionalImages = [
  {
    id: 4,
    title: "Model Reference",
    image: "/assets/model-picture.png",
    description: "High-quality model input for best results"
  },
  {
    id: 5,
    title: "Result Quality",
    image: "/assets/resultimage.jpg",
    description: "Final output with realistic fitting"
  }
];

export function GallerySection() {
  const [activeItem, setActiveItem] = useState<number | null>(null);

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
              See the transformative power of our RapidAPI virtual try-on technology through these real before and after examples.
            </p>
          </motion.div>
        </div>

        {/* Before/After Examples */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">Before & After Transformations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div 
                  className="relative overflow-hidden rounded-xl cursor-pointer aspect-[3/4] bg-muted border border-border/50 shadow-sm"
                  onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
                >
                  {/* Before Image */}
                  <div className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out",
                    activeItem === item.id ? "opacity-0" : "opacity-100"
                  )}>
                    <Image 
                      src={item.before} 
                      alt={`Before ${item.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.description}</p>
                      <p className="text-white text-xs font-medium mt-1">BEFORE</p>
                    </div>
                  </div>
                  
                  {/* After Image */}
                  <div className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out",
                    activeItem === item.id ? "opacity-100" : "opacity-0"
                  )}>
                    <Image 
                      src={item.after} 
                      alt={`After ${item.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.description}</p>
                      <p className="text-white text-xs font-medium mt-1">AFTER</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    Click to compare
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Images */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Quality Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {additionalImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-muted border border-border/50 shadow-sm">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to experience the magic yourself?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/generate-outfit"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Try Virtual Try-On Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}