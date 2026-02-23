"use client";

import { useEffect, useRef, useState } from "react";

interface PromptDisplayProps {
  onPromptLoaded?: (text: string) => void;
}

export function PromptDisplay({ onPromptLoaded }: PromptDisplayProps) {
  const [prompt, setPrompt] = useState<string | null>(null);
  const onPromptLoadedRef = useRef(onPromptLoaded);
  onPromptLoadedRef.current = onPromptLoaded;

  useEffect(() => {
    fetch("/api/prompts/today")
      .then((res) => res.json())
      .then((data) => {
        if (data?.text) {
          setPrompt(data.text);
          onPromptLoadedRef.current?.(data.text);
        }
      })
      .catch(() => {
        setPrompt("What's on your mind?");
        onPromptLoadedRef.current?.("What's on your mind?");
      });
  }, []);

  if (!prompt) return null;

  return (
    <p className="text-sm font-sans text-muted-foreground/60 italic mb-4">
      {prompt}
    </p>
  );
}
