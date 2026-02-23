"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EntryInputProps {
  initialContent?: string;
  date: string;
  promptText?: string | null;
  onSave?: (content: string) => void;
  disabled?: boolean;
}

export function EntryInput({
  initialContent = "",
  date,
  promptText,
  onSave,
  disabled = false,
}: EntryInputProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, 48)}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [content, adjustHeight]);

  const saveEntry = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setIsSaving(true);
      setSaved(false);
      try {
        const res = await fetch(`/api/entries/${date}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, promptText }),
        });
        if (res.ok) {
          setSaved(true);
          onSave?.(text);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch {
        // Silently fail — user can retry
      } finally {
        setIsSaving(false);
      }
    },
    [date, promptText, onSave]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Auto-save with debounce
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveEntry(value);
    }, 1500);
  };

  const handleBlur = () => {
    if (content.trim() && content !== initialContent) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveEntry(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Allow shift+enter for new lines, but plain enter saves
      if (content.trim().split("\n").length <= 1) {
        e.preventDefault();
        saveEntry(content);
      }
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="One line about today..."
        rows={1}
        className={cn(
          "w-full resize-none overflow-hidden bg-transparent",
          "font-serif text-lg leading-relaxed",
          "border-0 border-b-2 border-border/40 focus:border-primary/50",
          "px-0 py-3 outline-none transition-colors",
          "placeholder:text-muted-foreground/40",
          "disabled:opacity-50"
        )}
      />
      <div className="flex items-center justify-end gap-2 mt-2 h-6">
        {isSaving && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Saving...
          </span>
        )}
        {saved && (
          <span className="text-xs text-primary/70">Saved</span>
        )}
        {content.trim() && !isSaving && !saved && content !== initialContent && (
          <button
            onClick={() => saveEntry(content)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
