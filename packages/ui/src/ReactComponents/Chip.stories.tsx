import { Chip as _Chip } from "@nugudi/react-components-chip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import "@nugudi/react-components-chip/style.css";
import { FillHeartIcon, HeartIcon } from "@nugudi/assets-icons";

const meta: Meta<typeof _Chip> = {
  title: "Components/Chip",
  component: _Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md"],
      control: "select",
      defaultValue: "md",
    },
    variant: {
      options: ["default", "primary"],
      control: "select",
      defaultValue: "default",
    },
    label: {
      control: "text",
      defaultValue: "Chip Label",
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultChip: Story = {
  args: {
    label: "Chip Label",
    size: "md",
    variant: "default",
  },
};

export const PrimaryChip: Story = {
  args: {
    label: "primary chip",
    size: "md",
    variant: "primary",
  },
};

export const PrimaryChipWithIcon: Story = {
  args: {
    label: "맛있어요",
    size: "md",
    variant: "primary",
    icon: <FillHeartIcon />,
  },
};

export const DisabledChip: Story = {
  args: {
    label: "disabled chip",
    size: "md",
    variant: "default",
    disabled: true,
  },
};

export const ChipSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <_Chip label="Small" size="sm" variant="default" />
      <_Chip label="Medium" size="md" variant="default" />
    </div>
  ),
};

export const InteractiveChip: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);

    return (
      <_Chip
        label="클릭하세요"
        variant={isSelected ? "primary" : "default"}
        icon={isSelected ? <FillHeartIcon /> : <HeartIcon />}
        onClick={() => setIsSelected(!isSelected)}
      />
    );
  },
};
