import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Color foundations for the Nugudi design system.
 * These colors are used throughout the UI components and follow the design system guidelines.
 */
const ColorFoundations = () => {
  const colorGroups = {
    "Brand Colors": [
      { name: "Primary", class: "bg-blue-600", value: "#2563eb" },
      { name: "Primary Light", class: "bg-blue-400", value: "#60a5fa" },
      { name: "Primary Dark", class: "bg-blue-800", value: "#1e40af" },
    ],
    "Neutral Colors": [
      {
        name: "White",
        class: "bg-white border border-gray-200",
        value: "#ffffff",
      },
      { name: "Gray 50", class: "bg-gray-50", value: "#f9fafb" },
      { name: "Gray 100", class: "bg-gray-100", value: "#f3f4f6" },
      { name: "Gray 200", class: "bg-gray-200", value: "#e5e7eb" },
      { name: "Gray 300", class: "bg-gray-300", value: "#d1d5db" },
      { name: "Gray 400", class: "bg-gray-400", value: "#9ca3af" },
      { name: "Gray 500", class: "bg-gray-500", value: "#6b7280" },
      { name: "Gray 600", class: "bg-gray-600", value: "#4b5563" },
      { name: "Gray 700", class: "bg-gray-700", value: "#374151" },
      { name: "Gray 800", class: "bg-gray-800", value: "#1f2937" },
      { name: "Gray 900", class: "bg-gray-900", value: "#111827" },
      { name: "Black", class: "bg-black", value: "#000000" },
    ],
    "Semantic Colors": [
      { name: "Success", class: "bg-green-600", value: "#16a34a" },
      { name: "Warning", class: "bg-yellow-500", value: "#eab308" },
      { name: "Error", class: "bg-red-600", value: "#dc2626" },
      { name: "Info", class: "bg-blue-500", value: "#3b82f6" },
    ],
  };

  return (
    <div className="space-y-8">
      {Object.entries(colorGroups).map(([groupName, colors]) => (
        <div key={groupName}>
          <h3 className="mb-4 font-semibold text-lg">{groupName}</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {colors.map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className={`mx-auto mb-2 h-20 w-20 rounded-lg ${color.class}`}
                />
                <div className="font-medium text-sm">{color.name}</div>
                <div className="text-gray-500 text-xs">{color.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const meta: Meta<typeof ColorFoundations> = {
  title: "Foundations/Colors",
  component: ColorFoundations,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Color palette and foundations for the Nugudi design system.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ColorFoundations>;

export const Default: Story = {};
