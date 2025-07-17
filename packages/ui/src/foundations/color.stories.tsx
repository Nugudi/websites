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
];

const bgMap: Record<string, string> = {
  white: "bg-zinc-800",
  "zinc-50": "bg-zinc-700",
  "zinc-100": "bg-zinc-700",
  "zinc-200": "bg-zinc-700",
  black: "bg-zinc-100",
  "main-500": "bg-white",
  "main-800": "bg-zinc-50",
  error: "bg-white",
};

export default {
  title: "Foundations/Color",
  parameters: {
    layout: "centered",
  },
};

export const Color = () => (
  <div className="grid grid-cols-3 gap-4 p-8 md:grid-cols-4 lg:grid-cols-5">
    {colors.map((color) => {
      const bg =
        bgMap[color] ||
        (color.startsWith("zinc-") && parseInt(color.split("-")[1], 10) > 400
          ? "bg-zinc-100"
          : "bg-white");
      return (
        <div
          key={color}
          className={`flex items-center gap-4 ${bg} rounded-md border p-3`}
        >
          <span className="w-20 font-mono text-main-500 text-xs">{color}</span>
          <span className={`b1 text-${color} font-semibold`}>Aa</span>
        </div>
      );
    })}
  </div>
);
