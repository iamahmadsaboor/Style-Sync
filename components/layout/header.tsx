"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  X, 
  ShirtIcon,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Virtual Try-On", href: "/generate-outfit", highlight: true },
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Gallery", href: "/#gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ShirtIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">StyleSync</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    item.highlight 
                      ? "bg-primary/10 text-primary hover:bg-primary/20 font-semibold" 
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {item.highlight && <Sparkles className="w-3 h-3 inline mr-1" />}
                  {item.name}
                </Link>
              ))}
              <ModeToggle />
              <Button asChild>
                <Link href="/generate-outfit">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Now
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md",
                  item.highlight 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-foreground/80 hover:text-primary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.highlight && <Sparkles className="w-4 h-4 inline mr-2" />}
                {item.name}
              </Link>
            ))}
            <div className="mt-4">
              <Button 
                className="w-full" 
                onClick={() => setIsMenuOpen(false)}
                asChild
              >
                <Link href="/generate-outfit">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Virtual Try-On
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}