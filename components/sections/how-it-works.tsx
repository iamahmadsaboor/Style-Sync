"use client";

import { Check, Upload, Shirt, Sparkles } from "lucide-react";
import { motion } from "@/components/ui/motion";

const steps = [
  {
    number: "01",
    title: "Upload Your Photo",
    description: "Take a photo or upload an existing one to create your digital model.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Browse Clothing Items",
    description: "Browse through thousands of clothing items from various brands.",
    icon: Shirt,
  },
  {
    number: "03", 
    title: "See Magic Happen",
    description: "Our AI technology shows you how the clothes will look on your body.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Shop With Confidence",
    description: "Make informed purchasing decisions based on your virtual try-on.",
    icon: Check,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How StyleSync Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our simple 4-step process makes virtual try-on easy and accessible to everyone.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          <div className="grid gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`text-center md:text-left ${
                    index % 2 === 1 ? "md:order-2 md:text-right" : "md:order-1"
                  }`}
                >
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary">{step.number}</span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                <div
                  className={`rounded-2xl overflow-hidden aspect-video bg-muted ${
                    index % 2 === 1 ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <img
                    src={`https://images.pexels.com/photos/${
                      [2058911, 5704720, 8985539, 5866272][index]
                    }/pexels-photo-${
                      [2058911, 5704720, 8985539, 5866272][index]
                    }.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                    alt={`Step ${step.number}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Step indicator for medium and larger screens */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                  <div className="h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}