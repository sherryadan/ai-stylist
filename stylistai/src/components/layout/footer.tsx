"use client";

import Link from "next/link";
import { Sparkles, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  product: [
    { label: "AI Stylist", href: "/stylist" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Partner Brands", href: "/partner-brands" },
    { label: "Pricing", href: "/pricing" },
    { label: "Saved Outfits", href: "/saved-outfits" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "FAQ", href: "/faq" },
    { label: "Style Guide", href: "#" },
    { label: "Fashion Blog", href: "#" },
    { label: "API Documentation", href: "#" },
    { label: "Community", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t bg-background">
      {/* CTA Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-0">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 mt-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to elevate your style?
              </h3>
              <p className="text-white/80 mt-2 max-w-md">
                Join thousands who have transformed their wardrobe with AI-powered recommendations.
              </p>
            </div>
            <Link href="/stylist">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8"
              >
                Get Started Free
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Stylist</span>
                <span className="text-foreground">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Your AI Personal Fashion Stylist. Discover perfect outfits for any occasion
              from the brands you love.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@stylistai.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground capitalize mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h4 className="text-sm font-semibold">Stay in the loop</h4>
              <p className="text-sm text-muted-foreground">
                Get style tips and product updates.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="your@email.com"
                className="max-w-xs rounded-full bg-secondary border-0"
              />
              <Button type="submit" className="rounded-full gradient-bg text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StylistAI. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
