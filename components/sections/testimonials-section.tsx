"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "@/components/ui/motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emma Wilson",
    role: "Fashion Blogger",
    content: "StyleSync has revolutionized how I shop online. No more returns due to fit issues. I can now see exactly how each piece will look on me before purchasing.",
    avatar: "EW",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Regular Shopper",
    content: "I used to avoid online shopping because I could never tell if clothes would fit me well. StyleSync solved that problem completely. The virtual try-on is incredibly accurate!",
    avatar: "MC",
    rating: 5,
  },
  {
    name: "Sophia Rodriguez",
    role: "Stylist",
    content: "As a professional stylist, I recommend StyleSync to all my clients. It's an incredible tool that helps people visualize outfits before committing to purchases.",
    avatar: "SR",
    rating: 5,
  },
  {
    name: "James Thompson",
    role: "E-commerce Manager",
    content: "Since implementing StyleSync on our fashion website, we've seen a 40% decrease in returns and a significant boost in customer satisfaction. It's a game-changer.",
    avatar: "JT",
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don&apos;t just take our word for it — hear from people who have transformed their 
              online shopping experience with StyleSync.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.name}`} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}