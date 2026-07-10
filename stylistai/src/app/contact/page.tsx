"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Globe,
  ExternalLink,
} from "lucide-react";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@stylistai.app",
    href: "mailto:hello@stylistai.app",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Fashion Avenue, Suite 100, New York, NY 10001",
    href: null,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday - Friday: 9 AM - 6 PM EST",
    href: null,
  },
];

const socialLinks = [
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Globe, label: "Instagram", href: "#" },
  { icon: ExternalLink, label: "LinkedIn", href: "#" },
];

export default function ContactPage() {
  const [subject, setSubject] = useState("");

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-end/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-bg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Have a question, feedback, or want to partner with us? We&apos;d
              love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn>
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Send Us a Message
                    </h2>
                    <StaggerContainer className="space-y-6">
                      <StaggerItem>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              className="h-11"
                            />
                          </div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">
                                General Inquiry
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnership
                              </SelectItem>
                              <SelectItem value="support">
                                Support
                              </SelectItem>
                              <SelectItem value="feedback">
                                Feedback
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us how we can help..."
                            rows={6}
                          />
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <Button size="lg" className="w-full sm:w-auto gradient-bg text-white border-0">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </StaggerItem>
                    </StaggerContainer>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <FadeIn>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-bg">
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Social Links */}
              <FadeIn delay={0.1}>
                <div>
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <link.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Map Placeholder */}
              <FadeIn delay={0.2}>
                <div className="aspect-[4/3] overflow-hidden rounded-xl gradient-bg flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <MapPin className="mx-auto h-8 w-8 mb-2" />
                    <p className="font-medium">New York Office</p>
                    <p className="text-sm text-white/70 mt-1">
                      Map integration coming soon
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
