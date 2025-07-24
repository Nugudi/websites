import { colorTokens } from "./color.css";

const colors = [
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
] as const;

export default {
  title: "Foundations/Color",
  parameters: {
    layout: "centered",
  },
};

export const Color = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "40px",
      padding: "32px",
    }}
  >
    {colors.map((color) => {
      return (
        <div
          key={color}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderRadius: "6px",
            border: "1px solid #fafafa",
            padding: "8px",
          }}
        >
          <div
            className={colorTokens[color]}
            style={{
              height: "80px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #fafafa",
            }}
          />
          <span
            style={{
              width: "80px",
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#374151",
            }}
          >
            {color}
          </span>
        </div>
      );
    })}
  </div>
);
