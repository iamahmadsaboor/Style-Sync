import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About StyleSync
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Revolutionizing online shopping with cutting-edge virtual try-on technology.
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            At StyleSync, our mission is to transform online shopping by eliminating the uncertainty 
            of how clothes will look and fit. We&apos;re committed to leveraging cutting-edge RapidAPI 
            diffusion technology that bridges the gap between digital browsing and physical try-on, 
            making fashion more accessible and reducing waste from returns.
          </p>
          <p className="text-muted-foreground">
            We believe that everyone deserves to shop with confidence, regardless of body type, 
            location, or lifestyle. By providing accurate virtual try-on experiences powered by 
            advanced diffusion models, we empower customers to make informed decisions and help 
            retailers reduce return rates and increase customer satisfaction.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden relative h-96">
          <Image
            src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Team working together"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Meet the Creator</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            StyleSync was created by Ahmad Saboor, a passionate developer dedicated to revolutionizing 
            the online shopping experience through innovative technology.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm max-w-sm">
            <div className="aspect-square overflow-hidden relative">
              <Image
                src="/assets/ahmad.jpg"
                alt="Ahmad Saboor"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ahmad Saboor</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Full-stack developer and technology enthusiast who built StyleSync from the ground up. 
                Ahmad specializes in integrating modern APIs and creating seamless user experiences 
                that solve real-world problems in e-commerce and fashion technology.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="https://github.com/iamahmadsaboor" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/iamahmadsaboor" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Technology */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Technology</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            StyleSync leverages RapidAPI&apos;s Try-On Diffusion technology, a state-of-the-art 
            diffusion-based pipeline that creates immersive virtual try-on experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "RapidAPI Integration",
              description: "Our platform leverages RapidAPI's Try-On Diffusion technology, a state-of-the-art diffusion-based pipeline for fast and flexible virtual try-on experiences.",
            },
            {
              title: "Multi-Modal Processing",
              description: "Using advanced diffusion models, we process clothing and avatar images with support for text prompts, enabling versatile virtual try-on scenarios.",
            },
            {
              title: "Real-time Results",
              description: "Experience quick processing with typical response times of 5-10 seconds, delivering high-quality virtual try-on results efficiently.",
            },
          ].map((tech) => (
            <div key={tech.title} className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
              <h3 className="text-xl font-bold mb-4">{tech.title}</h3>
              <p className="text-muted-foreground">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose StyleSync */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Choose StyleSync</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            StyleSync offers advantages for both shoppers and retailers, creating a win-win solution for the fashion industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl p-8 border border-border/50 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">For Shoppers</h3>
            <ul className="space-y-4">
              {[
                "See exactly how clothes will look on your body",
                "Reduce disappointment from ill-fitting purchases",
                "Save time by avoiding returns and exchanges",
                "Shop with confidence from anywhere",
                "Discover styles that truly complement your body type",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border/50 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">For Retailers</h3>
            <ul className="space-y-4">
              {[
                "Reduce return rates by up to 40%",
                "Increase customer confidence and satisfaction",
                "Gather valuable data on fit preferences",
                "Reduce environmental impact from shipping returns",
                "Stand out with cutting-edge shopping experience",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Shopping Experience?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join StyleSync today and revolutionize the way you shop for clothes online.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact">Try StyleSync Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Request a Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}