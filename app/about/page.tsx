import Link from "next/link";
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
            of how clothes will look and fit. We're committed to creating technology that bridges 
            the gap between digital browsing and physical try-on, making fashion more accessible and 
            reducing waste from returns.
          </p>
          <p className="text-muted-foreground">
            We believe that everyone deserves to shop with confidence, regardless of body type, 
            location, or lifestyle. By providing accurate virtual try-on experiences, we empower 
            customers to make informed decisions and help retailers reduce return rates and 
            increase customer satisfaction.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Team working together"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're a diverse group of fashion technologists, AI specialists, and retail experts 
            passionate about revolutionizing the online shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Ahmad Saboor",
              role: "Founder & CEO",
              image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
            {
              name: "Sarah Johnson",
              role: "Chief Technology Officer",
              image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
            {
              name: "David Chen",
              role: "Head of AI Research",
              image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
            {
              name: "Priya Patel",
              role: "Fashion Technology Director",
              image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
          ].map((member) => (
            <div key={member.name} className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm">
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Technology */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Technology</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            StyleSync combines advanced computer vision, machine learning, and 3D modeling to create 
            an immersive virtual try-on experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Body Mapping",
              description: "Our proprietary algorithms create accurate body models from simple photos, mapping your unique proportions in seconds.",
            },
            {
              title: "3D Garment Simulation",
              description: "We transform 2D product images into 3D models that drape and fold naturally on your virtual body, showing realistic fit.",
            },
            {
              title: "Real-time Rendering",
              description: "Experience instant visualization as you browse, with seamless transitions between garments and multiple angle views.",
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