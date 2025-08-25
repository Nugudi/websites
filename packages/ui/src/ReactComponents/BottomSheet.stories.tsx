import "@nugudi/react-components-bottom-sheet/style.css";
import { BottomSheet as _BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { Button } from "@nugudi/react-components-button";
import { Body, Title } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof _BottomSheet> = {
  title: "Components/BottomSheet",
  component: _BottomSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    showHandle: {
      control: "boolean",
      defaultValue: true,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
        category: "Appearance",
      },
    },
    closeOnOverlayClick: {
      control: "boolean",
      defaultValue: true,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
        category: "Behavior",
      },
    },
    closeOnEscape: {
      control: "boolean",
      defaultValue: true,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
        category: "Behavior",
      },
    },
    snapPoints: {
      control: "object",
      defaultValue: [50, 100],
      table: {
        type: { summary: "number[]" },
        defaultValue: { summary: "[50, 100]" },
        category: "Behavior",
      },
    },
    defaultSnapPoint: {
      control: "number",
      defaultValue: 0,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
        category: "Behavior",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Basic Example
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open Bottom Sheet</Button>

        <_BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          snapPoints={[50, 100]}
        >
          <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
            Bottom Sheet Title
          </Title>
          <Body fontSize="b2">
            This is a bottom sheet component with snap points functionality. You
            can drag it to different snap points or close it by dragging down.
          </Body>
        </_BottomSheet>
      </div>
    );
  },
};

// Multiple Snap Points
export const MultipleSnapPoints: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open with 3 Snap Points</Button>

        <_BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          snapPoints={[25, 50, 90]}
          defaultSnapPoint={1}
        >
          <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
            Multiple Snap Points
          </Title>
          <Body fontSize="b2" style={{ marginBottom: "1rem" }}>
            This bottom sheet has three snap points: 25%, 50%, and 90% of the
            screen height.
          </Body>
          <Body fontSize="b3">
            Try dragging the handle to move between different heights.
          </Body>
        </_BottomSheet>
      </div>
    );
  },
};

// Without Handle
export const WithoutHandle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open without Handle</Button>

        <_BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showHandle={false}
          snapPoints={[70]}
        >
          <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
            No Handle
          </Title>
          <Body fontSize="b2">
            This bottom sheet doesn't have a drag handle. You can still close it
            by clicking the overlay or pressing Escape.
          </Body>
        </_BottomSheet>
      </div>
    );
  },
};

// No Overlay Click Close
export const NoOverlayClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open (No Overlay Close)</Button>

        <_BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnOverlayClick={false}
          snapPoints={[60]}
        >
          <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
            Overlay Click Disabled
          </Title>
          <Body fontSize="b2" style={{ marginBottom: "1.5rem" }}>
            Clicking the overlay won't close this bottom sheet. Use the button
            below or drag down to close.
          </Body>
          <Button onClick={() => setIsOpen(false)}>Close Bottom Sheet</Button>
        </_BottomSheet>
      </div>
    );
  },
};

// Content With List
export const ContentWithList: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const items = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open List</Button>

        <_BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          snapPoints={[50, 90]}
        >
          <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
            Select an Option
          </Title>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {items.map((item) => (
              <Button
                key={item}
                variant="neutral"
                onClick={() => {
                  console.log(`Selected: ${item}`);
                  setIsOpen(false);
                }}
                style={{ width: "100%", justifyContent: "flex-start" }}
              >
                {item}
              </Button>
            ))}
          </div>
        </_BottomSheet>
      </div>
    );
  },
};

// Interactive Form
export const InteractiveForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open Form</Button>

        <_BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          snapPoints={[75]}
        >
          <Title as="h2" fontSize="t2" style={{ marginBottom: "1.5rem" }}>
            Contact Form
          </Title>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <Body fontSize="b3" style={{ marginBottom: "0.5rem" }}>
                Name
              </Body>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e5e5",
                }}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <Body fontSize="b3" style={{ marginBottom: "0.5rem" }}>
                Email
              </Body>
              <input
                type="email"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e5e5",
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Body fontSize="b3" style={{ marginBottom: "0.5rem" }}>
                Message
              </Body>
              <textarea
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e5e5",
                  minHeight: "100px",
                  resize: "vertical",
                }}
                placeholder="Enter your message"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button style={{ flex: 1 }} onClick={() => setIsOpen(false)}>
                Submit
              </Button>
              <Button
                variant="neutral"
                style={{ flex: 1 }}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </_BottomSheet>
      </div>
    );
  },
};
