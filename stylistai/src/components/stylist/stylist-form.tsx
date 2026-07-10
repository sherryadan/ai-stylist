"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  Calendar,
  Palette,
  ClipboardList,
  Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useStylist, FORM_STEPS } from "@/hooks/use-stylist";
import { countries, getCitiesByCountry } from "@/data/countries";
import { occasions } from "@/data/occasions";
import { styles } from "@/data/styles";
import { brands } from "@/data/brands";
import type {
  Gender,
  OccasionTag,
  StyleTag,
  BodyType,
  Season,
} from "@/types";

const stepIcons = [User, Calendar, Palette, Star, ClipboardList];

const accessoryOptions = ["Watch", "Bag", "Belt", "Sunglasses", "Hat", "Jewelry"];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

const bodyTypeOptions: { value: BodyType; label: string }[] = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "average", label: "Average" },
  { value: "muscular", label: "Muscular" },
  { value: "plus-size", label: "Plus-size" },
];

const seasonOptions: { value: Season; label: string }[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
  { value: "winter", label: "Winter" },
];

interface StepRendererProps {
  formData: ReturnType<typeof useStylist>["formData"];
  updateFormData: ReturnType<typeof useStylist>["updateFormData"];
}

function PersonalInfoStep({ formData, updateFormData }: StepRendererProps) {
  const countryCities = formData.country
    ? getCitiesByCountry(formData.country)
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Gender</Label>
        <div className="flex gap-3 flex-wrap">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFormData({ gender: opt.value })}
              className={cn(
                "min-w-0 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                formData.gender === opt.value
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            min={10}
            max={120}
            value={formData.age}
            onChange={(e) => updateFormData({ age: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={formData.country}
            onValueChange={(v) => {
              updateFormData({ country: v, city: "" });
            }}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select
            value={formData.city}
            onValueChange={(v) => updateFormData({ city: v })}
            disabled={!formData.country}
          >
            <SelectTrigger id="city">
              <SelectValue
                placeholder={
                  formData.country
                    ? "Select a city"
                    : "Select a country first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countryCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function EventStep({ formData, updateFormData }: StepRendererProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="event">Occasion / Event</Label>
        <Select
          value={formData.event}
          onValueChange={(v) => updateFormData({ event: v as OccasionTag })}
        >
          <SelectTrigger id="event">
            <SelectValue placeholder="Select an occasion" />
          </SelectTrigger>
          <SelectContent>
            {occasions.map((occ) => (
              <SelectItem key={occ.id} value={occ.id}>
                {occ.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dressCode">Dress Code</Label>
        <Input
          id="dressCode"
          placeholder='e.g. "Black Tie", "Business Casual", "Smart Casual"'
          value={formData.dressCode}
          onChange={(e) => updateFormData({ dressCode: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Budget</Label>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            ${formData.budget}
          </Badge>
        </div>
        <Slider
          min={50}
          max={2000}
          step={10}
          value={[formData.budget]}
          onValueChange={([v]) => updateFormData({ budget: v })}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-neutral-500">
          <span>$50</span>
          <span>$2,000</span>
        </div>
      </div>
    </div>
  );
}

function StyleStep({ formData, updateFormData }: StepRendererProps) {
  const toggleStyle = (styleId: string) => {
    const current = formData.preferredStyle;
    const updated = current.includes(styleId as StyleTag)
      ? current.filter((s) => s !== styleId)
      : [...current, styleId as StyleTag];
    updateFormData({ preferredStyle: updated });
  };

  const toggleColor = (color: string) => {
    const current = formData.preferredColors;
    const updated = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    updateFormData({ preferredColors: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Preferred Styles</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {styles.map((style) => {
            const isSelected = formData.preferredStyle.includes(
              style.id as StyleTag
            );
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleStyle(style.id)}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-transparent shadow-lg"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-500"
                )}
                style={
                  isSelected
                    ? {
                        borderColor: style.color,
                        backgroundColor: `${style.color}10`,
                      }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 h-4 w-4 rounded-full flex-shrink-0 border-2"
                    style={{
                      backgroundColor: isSelected ? style.color : "transparent",
                      borderColor: isSelected ? style.color : "#d4d4d8",
                    }}
                  >
                    {isSelected && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="white"
                        className="h-full w-full p-0.5"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{style.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                      {style.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Preferred Colors</Label>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" },
            { name: "Navy", hex: "#1E3A5F" },
            { name: "Grey", hex: "#71717A" },
            { name: "Beige", hex: "#F5E6D3" },
            { name: "Brown", hex: "#78350F" },
            { name: "Blue", hex: "#3B82F6" },
            { name: "Green", hex: "#22C55E" },
            { name: "Red", hex: "#EF4444" },
            { name: "Burgundy", hex: "#800020" },
            { name: "Cream", hex: "#FFFDD0" },
            { name: "Olive", hex: "#808000" },
            { name: "Camel", hex: "#C19A6B" },
            { name: "Charcoal", hex: "#36454F" },
            { name: "Sage", hex: "#BCB88A" },
            { name: "Coral", hex: "#FF7F50" },
          ].map((color) => {
            const isSelected = formData.preferredColors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all",
                  isSelected
                    ? "border-neutral-900 dark:border-white"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                )}
              >
                <span
                  className="h-4 w-4 rounded-full border border-neutral-300"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
                {isSelected && (
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      className="h-2 w-2 dark:fill-black"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContextStep({ formData, updateFormData }: StepRendererProps) {
  const togglePreferredBrand = (brandId: string) => {
    const current = formData.preferredBrands;
    const updated = current.includes(brandId)
      ? current.filter((b) => b !== brandId)
      : [...current, brandId];
    updateFormData({ preferredBrands: updated });
  };

  const toggleAvoidBrand = (brandId: string) => {
    const current = formData.avoidBrands;
    const updated = current.includes(brandId)
      ? current.filter((b) => b !== brandId)
      : [...current, brandId];
    updateFormData({ avoidBrands: updated });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select
            value={formData.bodyType}
            onValueChange={(v) => updateFormData({ bodyType: v as BodyType })}
          >
            <SelectTrigger id="bodyType">
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {bodyTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            placeholder={`e.g. 5'10" or 178cm`}
            value={formData.height}
            onChange={(e) => updateFormData({ height: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="weather">Weather / Season</Label>
        <Select
          value={formData.weather}
          onValueChange={(v) => updateFormData({ weather: v as Season })}
        >
          <SelectTrigger id="weather">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {seasonOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Preferred Brands</Label>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
            const isSelected = formData.preferredBrands.includes(brand.id);
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => togglePreferredBrand(brand.id)}
                className={cn(
                  "rounded-full border-2 px-3 py-1 text-xs font-medium transition-all",
                  isSelected
                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                )}
              >
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Avoid Brands</Label>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
            const isSelected = formData.avoidBrands.includes(brand.id);
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => toggleAvoidBrand(brand.id)}
                className={cn(
                  "rounded-full border-2 px-3 py-1 text-xs font-medium transition-all",
                  isSelected
                    ? "bg-red-500 text-white border-red-500"
                    : "border-neutral-200 hover:border-red-300 hover:text-red-500 dark:border-neutral-700 dark:hover:border-red-500"
                )}
              >
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExtrasStep({ formData, updateFormData }: StepRendererProps) {
  const toggleAccessory = (accessory: string) => {
    const current = formData.accessoriesNeeded;
    const updated = current.includes(accessory)
      ? current.filter((a) => a !== accessory)
      : [...current, accessory];
    updateFormData({ accessoriesNeeded: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="alreadyOwnedItems">
          Already Owned Items
        </Label>
        <Textarea
          id="alreadyOwnedItems"
          placeholder="List any clothing items or accessories you already own that you'd like to incorporate into your outfit..."
          className="min-h-[100px]"
          value={formData.alreadyOwnedItems}
          onChange={(e) =>
            updateFormData({ alreadyOwnedItems: e.target.value })
          }
        />
      </div>

      <div className="space-y-3">
        <Label>Accessories Needed</Label>
        <div className="flex flex-wrap gap-3">
          {accessoryOptions.map((acc) => {
            const isSelected = formData.accessoriesNeeded.includes(acc);
            return (
              <label
                key={acc}
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 cursor-pointer transition-all",
                  isSelected
                    ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleAccessory(acc)}
                />
                <span className="text-sm font-medium">{acc}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any other preferences, requirements, or special requests for your stylist..."
          className="min-h-[100px]"
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}

const stepComponents = [
  PersonalInfoStep,
  EventStep,
  StyleStep,
  ContextStep,
  ExtrasStep,
];

export default function StylistForm() {
  const {
    formData,
    currentStep,
    stepValidation,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    generateRecommendations,
  } = useStylist();

  const progressPercent =
    ((currentStep + 1) / stepValidation.totalSteps) * 100;

  const StepComponent = stepComponents[currentStep];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {FORM_STEPS.map((step, idx) => {
            const Icon = stepIcons[idx] || ClipboardList;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(idx)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-11 w-11 rounded-full border-2 transition-all",
                    isActive &&
                      "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black",
                    isCompleted &&
                      "border-neutral-900 bg-neutral-900/10 dark:border-white dark:bg-white/10",
                    !isActive &&
                      !isCompleted &&
                      "border-neutral-300 dark:border-neutral-600"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="h-4 w-4"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium hidden sm:block transition-colors",
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-400 dark:text-neutral-500"
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-neutral-900 dark:bg-white transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Titles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {FORM_STEPS[currentStep].title}
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Step {currentStep + 1} of {stepValidation.totalSteps}
        </p>
      </div>

      {/* Step Content with Animation */}
      <div className="relative min-h-[300px] md:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80 border border-white/20 dark:border-neutral-800/50 shadow-xl shadow-neutral-900/5">
              <CardContent className="p-6 md:p-8">
                <StepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={stepValidation.isFirstStep}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">
            {currentStep + 1} / {stepValidation.totalSteps}
          </span>
        </div>

        {stepValidation.isLastStep ? (
          <Button
            onClick={generateRecommendations}
            className="gap-2 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 dark:text-black shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            Generate Outfits
          </Button>
        ) : (
          <Button onClick={nextStep} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
