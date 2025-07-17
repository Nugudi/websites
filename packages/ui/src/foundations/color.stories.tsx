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

export default {
  title: "Foundations/Color",
  parameters: {
    layout: "centered",
  },
};

export const Color = () => (
  <div className="grid grid-cols-3 gap-10 p-8 md:grid-cols-4 lg:grid-cols-5">
    {colors.map((color) => {
      return (
        <div
          key={color}
          className={`flex flex-col gap-2 rounded-md border border-zinc-50 p-2`}
        >
          <div
            className={`bg-${color} h-20 w-full rounded-md border border-zinc-50`}
          />
          <span className="w-20 font-mono text-xs text-zinc-700">{color}</span>
        </div>
      );
    })}
  </div>
);
