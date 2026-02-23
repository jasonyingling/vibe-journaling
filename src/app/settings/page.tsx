"use client";

import { useEffect, useState } from "react";
import { PillarForm } from "@/components/pillar-form";
import { cn } from "@/lib/utils";

interface Pillar {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number | null;
}

export default function SettingsPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchPillars = async () => {
    try {
      const res = await fetch("/api/pillars");
      const data = await res.json();
      setPillars(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPillars();
  }, []);

  const handleAdd = async (pillar: { name: string; description?: string }) => {
    try {
      await fetch("/api/pillars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pillar,
          sortOrder: pillars.length,
        }),
      });
      setShowAdd(false);
      fetchPillars();
    } catch {
      // fail silently
    }
  };

  const handleUpdate = async (
    id: number,
    pillar: { name: string; description?: string }
  ) => {
    try {
      await fetch(`/api/pillars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pillar),
      });
      setEditingId(null);
      fetchPillars();
    } catch {
      // fail silently
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/pillars/${id}`, { method: "DELETE" });
      fetchPillars();
    } catch {
      // fail silently
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newPillars = [...pillars];
    [newPillars[index - 1], newPillars[index]] = [
      newPillars[index],
      newPillars[index - 1],
    ];
    // Update sort orders
    for (let i = 0; i < newPillars.length; i++) {
      await fetch(`/api/pillars/${newPillars[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPillars[i].name,
          sortOrder: i,
        }),
      });
    }
    fetchPillars();
  };

  const moveDown = async (index: number) => {
    if (index === pillars.length - 1) return;
    const newPillars = [...pillars];
    [newPillars[index], newPillars[index + 1]] = [
      newPillars[index + 1],
      newPillars[index],
    ];
    for (let i = 0; i < newPillars.length; i++) {
      await fetch(`/api/pillars/${newPillars[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPillars[i].name,
          sortOrder: i,
        }),
      });
    }
    fetchPillars();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-serif font-semibold text-foreground/90">
          Settings
        </h1>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          Manage your pillars and preferences
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-sans text-muted-foreground/50 uppercase tracking-wider">
            Pillars
          </h2>
          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="text-xs font-sans text-primary hover:text-primary/80 transition-colors"
            >
              + Add pillar
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.id}
                className="rounded-lg border border-border/50 bg-card/50 p-4"
              >
                {editingId === pillar.id ? (
                  <PillarForm
                    pillar={pillar}
                    onSave={(updated) => handleUpdate(pillar.id, updated)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-sans font-medium text-foreground/80">
                        {pillar.name}
                      </h3>
                      {pillar.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pillar.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 transition-colors"
                        aria-label="Move up"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M8 4L4 8H12L8 4Z" fill="currentColor" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === pillars.length - 1}
                        className="p-1 text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 transition-colors"
                        aria-label="Move down"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12L12 8H4L8 12Z" fill="currentColor" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditingId(pillar.id)}
                        className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        aria-label="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(pillar.id)}
                        className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                        aria-label="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showAdd && (
          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <PillarForm
              onSave={handleAdd}
              onCancel={() => setShowAdd(false)}
            />
          </div>
        )}
      </section>
    </div>
  );
}
