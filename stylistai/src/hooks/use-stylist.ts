"use client";

import { useState, useCallback } from "react";
import type { StylistFormData, OutfitRecommendation } from "@/types";
import { generateRecommendations as generateRecs } from "@/services/recommendation-engine";

export const FORM_STEPS = [
  {
    id: "personal",
    title: "Personal Info",
    fields: ["gender", "age", "country", "city"] as const,
  },
  {
    id: "event",
    title: "Event Details",
    fields: ["event", "dressCode", "budget"] as const,
  },
  {
    id: "style",
    title: "Style Preferences",
    fields: ["preferredStyle", "preferredColors", "bodyType", "height"] as const,
  },
  {
    id: "context",
    title: "Weather & Brands",
    fields: ["weather", "preferredBrands", "avoidBrands"] as const,
  },
  {
    id: "extras",
    title: "Final Details",
    fields: ["alreadyOwnedItems", "accessoriesNeeded", "notes"] as const,
  },
] as const;

const DEFAULT_FORM_DATA: StylistFormData = {
  gender: "",
  age: "",
  country: "",
  city: "",
  event: "",
  dressCode: "",
  budget: 500,
  preferredStyle: [],
  preferredColors: [],
  bodyType: "",
  height: "",
  weather: "",
  preferredBrands: [],
  avoidBrands: [],
  alreadyOwnedItems: "",
  accessoriesNeeded: [],
  notes: "",
};

export function useStylist() {
  const [formData, setFormData] = useState<StylistFormData>(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<OutfitRecommendation[] | null>(null);
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);

  const updateFormData = useCallback(
    (updates: Partial<StylistFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, FORM_STEPS.length - 1)));
  }, []);

  const generate = useCallback(async () => {
    setIsLoading(true);
    try {
      const recs = await generateRecs(formData);
      setResults(recs);
      setSelectedOutfitIndex(0);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStep(0);
    setIsLoading(false);
    setResults(null);
    setSelectedOutfitIndex(0);
  }, []);

  const currentStepData = FORM_STEPS[currentStep];

  const currentStepFields = currentStepData
    ? (currentStepData.fields as readonly string[])
    : [];

  const stepValidation = {
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === FORM_STEPS.length - 1,
    totalSteps: FORM_STEPS.length,
    currentStep: currentStep + 1,
  };

  const selectedOutfit =
    results && results.length > selectedOutfitIndex
      ? results[selectedOutfitIndex]
      : null;

  return {
    formData,
    currentStep,
    isLoading,
    results,
    selectedOutfitIndex,
    selectedOutfit,
    currentStepData,
    currentStepFields,
    stepValidation,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    generateRecommendations: generate,
    resetForm,
    setSelectedOutfitIndex,
  };
}
