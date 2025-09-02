import type { CSSProperties } from "react";

/**
 * CSS value types that can be used as-is
 */
const CSS_VALUE_KEYWORDS = [
  "auto",
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
  "normal",
  "none",
  "hidden",
  "visible",
  "scroll",
  "clip",
  "fixed",
  "absolute",
  "relative",
  "sticky",
  "static",
  "flex",
  "grid",
  "block",
  "inline",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "contents",
  "flow-root",
  "table",
  "table-cell",
  "table-row",
  "list-item",
  "run-in",
] as const;

/**
 * Converts a value to a CSS-compatible string
 * - Numbers are treated as pixels (e.g., 10 -> "10px")
 * - Strings starting with numbers are treated as pixels (e.g., "10" -> "10px")
 * - Percentages are preserved (e.g., "50%" -> "50%")
 * - CSS units are preserved (e.g., "2rem" -> "2rem")
 * - Keywords are preserved (e.g., "auto" -> "auto")
 * - Special values are converted (e.g., "full" -> "100%")
 */
export function toCSSValue(
  value: string | number | undefined,
  type: "size" | "spacing" | "gap" = "spacing",
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  // Handle numbers - always treat as pixels
  if (typeof value === "number") {
    return `${value}px`;
  }

  // Handle string values
  const stringValue = String(value).trim();

  // Handle special size keywords
  if (type === "size") {
    switch (stringValue) {
      case "full":
        return "100%";
      case "screen":
        return "100vw";
      case "min":
      case "min-content":
        return "min-content";
      case "max":
      case "max-content":
        return "max-content";
      case "fit":
      case "fit-content":
        return "fit-content";
    }
  }

  // Check if it's a CSS keyword
  if (
    CSS_VALUE_KEYWORDS.includes(
      stringValue as (typeof CSS_VALUE_KEYWORDS)[number],
    )
  ) {
    return stringValue;
  }

  // Check if it already has a CSS unit
  if (
    /^-?\d+\.?\d*(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|svh|svw|lvh|lvw|dvh|dvw)$/i.test(
      stringValue,
    )
  ) {
    return stringValue;
  }

  // Check if it's a calc() or var() or other CSS function
  if (/^(calc|var|min|max|clamp|minmax)\(/.test(stringValue)) {
    return stringValue;
  }

  // Check if it's just a number as string - treat as pixels
  if (/^-?\d+\.?\d*$/.test(stringValue)) {
    return `${stringValue}px`;
  }

  // Return as-is for any other value
  return stringValue;
}

/**
 * Converts spacing values (margin, padding, gap)
 * Accepts numbers, strings, or arrays for directional values
 */
export function toSpacingValue(
  value: string | number | undefined,
): string | undefined {
  return toCSSValue(value, "spacing");
}

/**
 * Converts size values (width, height)
 * Accepts numbers, strings, or special keywords
 */
export function toSizeValue(
  value: string | number | undefined,
): string | undefined {
  return toCSSValue(value, "size");
}

/**
 * Type guard to check if a value is a valid CSS value
 */
export function isValidCSSValue(value: unknown): value is string | number {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "number") {
    return true;
  }

  if (typeof value === "string") {
    return true;
  }

  return false;
}

/**
 * Process style props to convert numeric values to pixels
 */
export function processStyleProps(
  props: Record<string, unknown>,
): CSSProperties {
  const processed: Record<string, string | number | undefined> = {};

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;

    // Handle spacing properties
    if (key.match(/^(margin|padding|gap|top|right|bottom|left|inset)/i)) {
      processed[key] = toSpacingValue(value as string | number);
    }
    // Handle size properties
    else if (key.match(/^(width|height|min|max)/i)) {
      processed[key] = toSizeValue(value as string | number);
    }
    // Pass through other values
    else if (typeof value === "string" || typeof value === "number") {
      processed[key] = value;
    }
  }

  return processed as CSSProperties;
}
