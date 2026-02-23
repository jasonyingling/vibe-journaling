"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Pillar {
  id?: number;
  name: string;
  description?: string | null;
}

interface PillarFormProps {
  pillar?: Pillar;
  onSave: (pillar: { name: string; description?: string }) => void;
  onCancel?: () => void;
  className?: string;
}

export function PillarForm({ pillar, onSave, onCancel, className }: PillarFormProps) {
  const [name, setName] = useState(pillar?.name || "");
  const [description, setDescription] = useState(pillar?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim() || undefined });
    if (!pillar) {
      setName("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pillar name"
          className={cn(
            "w-full bg-transparent border-0 border-b border-border/40",
            "px-0 py-2 text-sm font-sans outline-none",
            "focus:border-primary/50 transition-colors",
            "placeholder:text-muted-foreground/40"
          )}
        />
      </div>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (optional)"
          className={cn(
            "w-full bg-transparent border-0 border-b border-border/40",
            "px-0 py-2 text-xs font-sans outline-none",
            "focus:border-primary/50 transition-colors",
            "placeholder:text-muted-foreground/40"
          )}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className={cn(
            "px-4 py-1.5 text-xs font-sans rounded-md",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          {pillar ? "Update" : "Add"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
