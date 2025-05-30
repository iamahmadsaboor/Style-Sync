"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "@/components/ui/motion";
import { Camera, ShoppingBag, Shapes, Share2, Sparkles, Smartphone } from "lucide-react";

const features = [
  {
    title: "Real-time Virtual Try-On",
    description: "See how clothes fit on your body instantly with our advanced AI technology.",
    icon: Camera,
  },
  {
    title: "Drop Return Ratio",
    description: "Rotate and view outfits improve satisfaction adn drop return reatio.",
    icon: Shapes,
  },
  {
    title: "Share Your Looks",
    description: "Share potential outfits with friends and get their opinion before buying.",
    icon: Share2,
  },
  {
    title: "Mobile Friendly",
    description: "Try on clothes anytime, anywhere using just your smartphone.",
    icon: Smartphone,
  },
  {
    title: "Smart Recommendations",
    description: "Get personalized style recommendations based on your body type and preferences.",
    icon: Sparkles,
  },
  {
    title: "Direct Shopping",
    description: "Purchase items you love directly through our platform with exclusive discounts.",
    icon: ShoppingBag,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Features that make StyleSync special
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our cutting-edge technology transforms how you shop for clothes online,
              making the experience more interactive and personalized.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}