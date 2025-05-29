"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "@/components/ui/motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [activeImage, setActiveImage] = useState(0);
  const images = [
    "https://images.pexels.com/photos/4049876/pexels-photo-4049876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/5691874/pexels-photo-5691874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7691066/pexels-photo-7691066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Virtual <span className="text-primary">Try-On</span> <br />
                Redefined
              </h1>
              <p className="mt-6 max-w-md text-lg text-muted-foreground">
                Experience clothes before you buy them. StyleSync uses advanced AI to 
                show how garments will look on you in real-time.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="group">
                  <Link href="/generate-outfit">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Virtual Try-On Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#how-it-works">How It Works</Link>
                </Button>
              </div>
              
              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">1M+</p>
                  <p className="text-xs text-muted-foreground">Try-ons generated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">98%</p>
                  <p className="text-xs text-muted-foreground">Accuracy rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">5sec</p>
                  <p className="text-xs text-muted-foreground">Average processing</p>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-sm font-medium text-muted-foreground">
                  Trusted by top fashion brands
                </p>
                <div className="mt-4 flex flex-wrap gap-6 items-center">
                  {["Zara", "H&M", "Nike", "Adidas"].map((brand) => (
                    <span key={brand} className="text-foreground/70 font-medium">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Decoration elements */}
              <div className="absolute -right-8 -top-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -left-8 -bottom-8 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
              
              {/* Images */}
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000",
                    activeImage === idx ? "opacity-100" : "opacity-0"
                  )}
                >
                  <img
                    src={src}
                    alt={`Fashion model ${idx + 1}`}
                    className="object-cover w-full h-full rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
                </div>
              ))}
              
              {/* Floating information card */}
              <div className="absolute bottom-6 left-0 right-0 mx-auto w-[90%] bg-background/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">AI-Powered Try-On</h3>
                    <p className="text-sm text-muted-foreground">
                      See clothes on your body instantly
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" asChild className="ml-auto">
                    <Link href="/generate-outfit">
                      Try Now
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Image selector dots */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mb-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    activeImage === idx ? "bg-primary" : "bg-primary/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}