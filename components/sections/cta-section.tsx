"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "@/components/ui/motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Fashion background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
          </div>

          <div className="relative py-24 px-6 sm:py-32 sm:px-12 lg:px-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to revolutionize your shopping experience?
              </h2>
              <p className="mt-6 text-xl text-white/90">
                Join thousands of satisfied users who are trying on clothes virtually with StyleSync's AI-powered technology.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 group" asChild>
                  <Link href="/generate-outfit">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Your Virtual Try-On
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/#how-it-works">How It Works</Link>
                </Button>
              </div>
              
              {/* Add trust indicators */}
              <div className="mt-8 flex items-center justify-center space-x-8 text-white/70 text-sm">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Free to try</span>
                </div>
                <div>•</div>
                <div>No signup required</div>
                <div>•</div>
                <div>Instant results</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}