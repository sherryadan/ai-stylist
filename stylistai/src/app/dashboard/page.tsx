"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  Heart,
  TrendingUp,
  Clock,
  User,
  Bookmark,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const statCards = [
  {
    label: "Saved Outfits",
    value: "12",
    icon: ShoppingBag,
    color: "from-violet-500 to-purple-500",
  },
  {
    label: "Recommendations",
    value: "47",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Favorite Brands",
    value: "8",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
  },
  {
    label: "Outfit Score",
    value: "92%",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
  },
];

const savedOutfits = [
  { name: "Summer Casual Look", occasion: "Casual", items: 4, cost: 245 },
  { name: "Business Meeting Ready", occasion: "Business", items: 5, cost: 520 },
  { name: "Date Night Elegance", occasion: "Date Night", items: 3, cost: 310 },
  { name: "Weekend Explorer", occasion: "Travel", items: 4, cost: 280 },
];

const recentActivity = [
  { action: "Saved outfit", detail: "Summer Casual Look", time: "2 hours ago" },
  { action: "Updated preferences", detail: "Added Streetwear style", time: "1 day ago" },
  { action: "Generated recommendation", detail: "Business Meeting", time: "3 days ago" },
  { action: "Favorited brand", detail: "Nike", time: "5 days ago" },
];

const sidebarItems = [
  { icon: User, label: "Profile", active: true },
  { icon: Bookmark, label: "Saved Outfits", active: false },
  { icon: History, label: "History", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const styleProfile = {
  preferred: ["Minimalist", "Smart Casual", "Streetwear"],
  colors: ["Black", "White", "Navy", "Olive"],
  budget: "Mid-Range",
  brands: ["Nike", "Zara", "Levi's"],
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 border-r lg:block">
          <div className="sticky top-20 p-6 space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">
                S
              </div>
              <div>
                <p className="font-semibold">Sarah</p>
                <p className="text-xs text-muted-foreground">
                  Premium Member
                </p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-white shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 max-w-[85vw] bg-background p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">
                  S
                </div>
                <div>
                  <p className="font-semibold">Sarah</p>
                  <p className="text-xs text-muted-foreground">
                    Premium Member
                  </p>
                </div>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      item.active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 py-8 lg:px-8">
          {/* Welcome */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="gradient-text">Sarah!</span>
              </h1>
              <p className="mt-1 text-muted-foreground">
                Here&apos;s your style overview
              </p>
            </div>
          </FadeIn>

          {/* Stats */}
          <StaggerContainer className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="border-0 bg-secondary/40">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                        stat.color
                      )}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Saved Outfits */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Saved Outfits</h2>
                  <Link
                    href="/saved-outfits"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </FadeIn>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                {savedOutfits.map((outfit) => (
                  <StaggerItem key={outfit.name}>
                    <Card className="border-0 bg-secondary/30 overflow-hidden">
                      <div className="h-28 gradient-bg opacity-80 flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-white/50" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{outfit.name}</h3>
                            <Badge
                              variant="secondary"
                              className="mt-1 text-xs"
                            >
                              {outfit.occasion}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {outfit.items} items
                          </span>
                          <span className="font-medium">
                            ${outfit.cost}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Right sidebar */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <FadeIn>
                <Card className="border-0 bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Clock className="h-4 w-4" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((item) => (
                      <div key={item.detail} className="flex items-start gap-3">
                        <div className="mt-0.5 h-2 w-2 rounded-full gradient-bg shrink-0" />
                        <div>
                          <p className="text-sm font-medium">
                            {item.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.detail} &middot; {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Style Profile */}
              <FadeIn delay={0.1}>
                <Card className="border-0 bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4" />
                      Style Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Preferred Styles
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {styleProfile.preferred.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Colors
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {styleProfile.colors.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        {styleProfile.budget}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Quick Actions */}
              <FadeIn delay={0.2}>
                <div className="flex flex-col gap-3">
                  <Link href="/stylist">
                    <Button className="w-full gradient-bg text-white border-0">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get New Recommendation
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
