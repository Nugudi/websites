import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "h1",
        "t1",
        "t2",
        "t3",
        "b1",
        "b2",
        "b3",
        "b3b",
        "b4",
        "b4b",
        "e1",
        "e2",
        "l1",
      ],
      color: [
        "main-500",
        "main-800",
        "zinc-50",
        "zinc-100",
        "zinc-200",
        "zinc-300",
        "zinc-400",
        "zinc-500",
        "zinc-600",
        "zinc-700",
        "zinc-800",
        "error",
        "white",
        "black",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
