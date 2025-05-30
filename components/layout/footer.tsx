import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShirtIcon, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/40">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
              <ShirtIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">StyleSync</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              StyleSync is a next-generation virtual try-on platform powered by RapidAPI technology. 
              Built by Ahmad Saboor to help you visualize clothes before making a purchase decision.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://instagram.com/iamahmadsaboor" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/iamahmadsaboor" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/iamahmadsaboor" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/iamahmadsaboor" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-muted-foreground hover:text-primary">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-sm text-muted-foreground hover:text-primary">
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Stay Updated</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="mt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} StyleSync. All rights reserved. Designed by{" "}
            <a
              href="https://github.com/iamahmadsaboor"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Ahmad Saboor
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}