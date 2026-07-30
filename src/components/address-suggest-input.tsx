"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import {
  DEBOUNCE_MS,
  MIN_QUERY_LENGTH,
  addressSuggestEnabled,
  fetchAddressSuggestions,
  highlightSegments,
  type AddressSuggestion,
} from "@/lib/address-suggest";

export function AddressSuggestInput({
  id,
  value,
  onChange,
  onSelect,
  inputRef,
  className,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  className: string;
  placeholder: string;
  invalid: boolean;
  describedBy?: string;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextQuery = useRef(false);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    if (!addressSuggestEnabled) {
      return;
    }

    if (skipNextQuery.current) {
      skipNextQuery.current = false;
      return;
    }

    // Short queries are cleared in handleChange, where the keystroke actually happens.
    if (value.trim().length < MIN_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const results = await fetchAddressSuggestions(value, controller.signal);

        setSuggestions(results);
        setActiveIndex(-1);
        setIsOpen(results.length > 0);
      } catch {
        // Suggestions are a convenience. A Places outage, a bad key, or a spent
        // quota must never stop someone from typing their address by hand.
        if (controller.signal.aborted) {
          return;
        }

        setSuggestions([]);
        setIsOpen(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function handleChange(next: string) {
    onChange(next);

    if (next.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setActiveIndex(-1);
      setIsOpen(false);
    }
  }

  function selectSuggestion(suggestion: AddressSuggestion) {
    skipNextQuery.current = true;
    onChange(suggestion.value);
    setSuggestions([]);
    setActiveIndex(-1);
    setIsOpen(false);
    // Hand the value over directly — the onChange above has not landed in state yet.
    onSelect?.(suggestion.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + suggestions.length) % suggestions.length,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      // Only intercept Enter when a row is highlighted, so plain Enter still submits.
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]!);
      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const isExpanded = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <MapPin
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 size-5 -translate-y-1/2 text-[var(--muted)]"
        strokeWidth={1.8}
      />
      <input
        ref={inputRef}
        id={id}
        name="propertyAddress"
        type="text"
        inputMode="text"
        autoComplete="street-address"
        required
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isExpanded}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          isExpanded && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        }
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={className}
        placeholder={placeholder}
      />

      {isExpanded ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto border-2 border-[var(--ink)] bg-[var(--panel)] shadow-[6px_6px_0_var(--ink)]"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.placeId}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectSuggestion(suggestion)}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 text-sm leading-5 ${
                index === activeIndex
                  ? "bg-[var(--ink)] text-[var(--panel)]"
                  : "text-[var(--ink)]"
              }`}
            >
              <MapPin
                aria-hidden
                className="mt-0.5 size-4 shrink-0 opacity-60"
                strokeWidth={1.8}
              />
              <span>
                {highlightSegments(suggestion.main, suggestion.mainMatches).map(
                  (segment, segmentIndex) => (
                    <span
                      key={segmentIndex}
                      className={segment.match ? "font-bold" : "font-medium"}
                    >
                      {segment.text}
                    </span>
                  ),
                )}
                {suggestion.secondary ? (
                  <span
                    className={
                      index === activeIndex
                        ? "opacity-70"
                        : "text-[var(--muted)]"
                    }
                  >
                    {" "}
                    {suggestion.secondary}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
