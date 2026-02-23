"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SUGGESTED_PILLARS = [
  { name: "Health & Fitness", description: "Physical wellness and movement" },
  { name: "Career Growth", description: "Professional development and goals" },
  { name: "Relationships", description: "Connection with people who matter" },
  { name: "Creative Projects", description: "Making and building things" },
  { name: "Financial Goals", description: "Money, savings, and investments" },
  { name: "Mindfulness", description: "Inner peace and self-awareness" },
  { name: "Learning", description: "New skills and knowledge" },
  { name: "Parenting", description: "Growing alongside your kids" },
];

interface Pillar {
  name: string;
  description: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"welcome" | "pillars">("welcome");
  const [selectedPillars, setSelectedPillars] = useState<Pillar[]>([]);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSuggested = (pillar: Pillar) => {
    setSelectedPillars((prev) => {
      const exists = prev.find((p) => p.name === pillar.name);
      if (exists) return prev.filter((p) => p.name !== pillar.name);
      if (prev.length >= 5) return prev;
      return [...prev, pillar];
    });
  };

  const addCustom = () => {
    if (!customName.trim()) return;
    if (selectedPillars.length >= 5) return;
    setSelectedPillars((prev) => [
      ...prev,
      { name: customName.trim(), description: customDesc.trim() },
    ]);
    setCustomName("");
    setCustomDesc("");
  };

  const removePillar = (name: string) => {
    setSelectedPillars((prev) => prev.filter((p) => p.name !== name));
  };

  const handleFinish = async () => {
    if (selectedPillars.length === 0) return;
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillars: selectedPillars }),
      });
      router.push("/");
    } catch {
      setSaving(false);
    }
  };

  if (step === "welcome") {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-semibold text-foreground/90">
            Vibe Journal
          </h1>
          <p className="text-base font-serif text-foreground/70 leading-relaxed">
            A quiet space for one thought a day. Not a diary, not a to-do list
            — just a line about what&apos;s on your mind.
          </p>
          <p className="text-sm font-sans text-muted-foreground leading-relaxed">
            Over time, patterns emerge. You&apos;ll start to see what matters most,
            what shifts, and where your energy goes.
          </p>
        </div>
        <button
          onClick={() => setStep("pillars")}
          className={cn(
            "w-full py-3 rounded-lg font-sans text-sm",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors"
          )}
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-serif font-semibold text-foreground/90">
          What&apos;s on your mind these days?
        </h1>
        <p className="text-sm font-sans text-muted-foreground">
          Choose 3–5 themes or intentions you&apos;re thinking about.
          These are your &ldquo;pillars&rdquo; — they&apos;ll help guide your reflections.
        </p>
      </div>

      {/* Selected pillars */}
      {selectedPillars.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-sans text-muted-foreground/50 uppercase tracking-wider">
            Your pillars ({selectedPillars.length}/5)
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedPillars.map((p) => (
              <button
                key={p.name}
                onClick={() => removePillar(p.name)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-sans",
                  "bg-primary/10 text-primary border border-primary/20",
                  "hover:bg-primary/20 transition-colors"
                )}
              >
                {p.name}
                <span className="text-primary/60">&times;</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="space-y-3">
        <h3 className="text-xs font-sans text-muted-foreground/50 uppercase tracking-wider">
          Suggestions
        </h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PILLARS.map((p) => {
            const isSelected = selectedPillars.some((sp) => sp.name === p.name);
            return (
              <button
                key={p.name}
                onClick={() => toggleSuggested(p)}
                disabled={!isSelected && selectedPillars.length >= 5}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-sans border transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-border",
                  !isSelected && selectedPillars.length >= 5 && "opacity-30 cursor-not-allowed"
                )}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom pillar */}
      <div className="space-y-3">
        <h3 className="text-xs font-sans text-muted-foreground/50 uppercase tracking-wider">
          Add your own
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Custom pillar name"
            className={cn(
              "flex-1 bg-transparent border-0 border-b border-border/40",
              "px-0 py-2 text-sm font-sans outline-none",
              "focus:border-primary/50 transition-colors",
              "placeholder:text-muted-foreground/40"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustom();
            }}
          />
          <button
            onClick={addCustom}
            disabled={!customName.trim() || selectedPillars.length >= 5}
            className={cn(
              "px-3 py-1 text-sm font-sans text-primary",
              "hover:text-primary/80 transition-colors",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            Add
          </button>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={handleFinish}
        disabled={selectedPillars.length === 0 || saving}
        className={cn(
          "w-full py-3 rounded-lg font-sans text-sm",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {saving ? "Setting up..." : `Continue with ${selectedPillars.length} pillar${selectedPillars.length !== 1 ? "s" : ""}`}
      </button>
    </div>
  );
}
