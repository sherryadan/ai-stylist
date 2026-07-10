"use client";

import Link from "next/link";
import {
  Heart,
  Briefcase,
  UserCheck,
  GraduationCap,
  Cake,
  PartyPopper,
  BookOpen,
  Flame,
  Mic,
  Presentation,
  Coffee,
  Plane,
  Star,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { occasions } from "@/data/occasions";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";


const iconMap: Record<string, LucideIcon> = {
  Heart,
  Briefcase,
  UserCheck,
  GraduationCap,
  Cake,
  PartyPopper,
  BookOpen,
  Flame,
  Mic,
  Presentation,
  Coffee,
  Plane,
  Star,
  Users,
  UtensilsCrossed,
};

export default function OccasionsGrid() {
  return (
    <section className="py-12 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Style for Every <span className="gradient-text">Occasion</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From boardroom meetings to weekend parties — find the perfect look
              for any event.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occasion) => {
            const Icon = iconMap[occasion.icon] || Star;
            return (
              <StaggerItem key={occasion.id}>
                <Link href={`/stylist?occasion=${occasion.id}`}>
                  <div className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 cursor-pointer overflow-hidden">
                    {/* Colored left accent */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 group-hover:w-1.5"
                      style={{ backgroundColor: occasion.color }}
                    />

                    {/* Icon */}
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300"
                      style={{
                        backgroundColor: `${occasion.color}15`,
                        color: occasion.color,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {occasion.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {occasion.description}
                    </p>

                    {/* Dress code */}
                    <p className="mt-3 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                      {occasion.dressCode}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
