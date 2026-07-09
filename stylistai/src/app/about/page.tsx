"use client";

import {
  Lightbulb,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
} from "lucide-react";
import Link from "next/link";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI and machine learning to deliver personalized fashion recommendations that evolve with your style.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description:
      "Fashion is for everyone. Our platform celebrates diverse body types, styles, budgets, and cultural backgrounds.",
  },
  {
    icon: Shield,
    title: "Privacy",
    description:
      "Your personal style data belongs to you. We employ industry-leading encryption and never share your information without consent.",
  },
  {
    icon: Sparkles,
    title: "Quality",
    description:
      "Every recommendation is curated from top brands, ensuring you get the best quality outfits that match your preferences.",
  },
];

const teamMembers = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", initials: "SC" },
  { name: "Marcus Johnson", role: "CTO & Co-Founder", initials: "MJ" },
  { name: "Priya Patel", role: "Head of Design", initials: "PP" },
  { name: "Alex Rivera", role: "Head of AI", initials: "AR" },
];

const stats = [
  { icon: Users, value: "50+", label: "Team Members" },
  { icon: Globe, value: "30+", label: "Countries Served" },
  { icon: TrendingUp, value: "500K+", label: "Users Worldwide" },
  { icon: Award, value: "10K+", label: "Brand Partnerships" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-end/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              About <span className="gradient-text">StylistAI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              We&apos;re on a mission to democratize personal fashion styling
              using the power of artificial intelligence, making everyone feel
              confident in what they wear.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="border-y bg-secondary/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  StylistAI was born in 2023 when our founders realized that
                  personal fashion styling was a privilege reserved for the few.
                  Combining expertise in AI technology and fashion curation, they
                  built a platform that brings professional-grade style
                  recommendations to everyone.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Today, we serve hundreds of thousands of users across the
                  globe, partnering with leading brands to offer personalized
                  outfit recommendations for any occasion, budget, and style
                  preference.
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl gradient-bg flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Sparkles className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg font-semibold">
                    &ldquo;Fashion should be personal, accessible, and
                    empowering&rdquo;
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    — Sarah Chen, CEO
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="mt-2 text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="h-full border-0 bg-secondary/50">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full gradient-bg">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-bg px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center text-white">
                  <stat.icon className="mx-auto h-8 w-8 mb-3 opacity-80" />
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-white/70">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold">Meet the Team</h2>
              <p className="mt-2 text-muted-foreground">
                The people building the future of fashion
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <StaggerItem key={member.name}>
                <Card className="border-0 bg-secondary/50 text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-bg text-xl font-bold text-white">
                      {member.initials}
                    </div>
                    <h3 className="mt-4 font-semibold">{member.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold">Join Us on This Journey</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Whether you&apos;re a fashion enthusiast, a brand, or a potential
              team member, we&apos;d love to have you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
