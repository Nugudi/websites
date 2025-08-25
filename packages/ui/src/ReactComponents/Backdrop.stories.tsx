import "@nugudi/react-components-backdrop/style.css";
import { Backdrop as _Backdrop } from "@nugudi/react-components-backdrop";
import { Button } from "@nugudi/react-components-button";
import { Body, Title } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof _Backdrop> = {
  title: "Components/Backdrop",
  component: _Backdrop,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onClick: {
      action: "clicked",
      table: {
        type: { summary: "() => void" },
        category: "Events",
      },
    },
    className: {
      control: "text",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    children: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Basic",
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
        <Button onClick={() => setIsOpen(true)}>Open Backdrop</Button>

        {isOpen && (
          <_Backdrop onClick={() => setIsOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "400px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                }
              }}
            >
              <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
                Modal Content
              </Title>
              <Body fontSize="b2" style={{ marginBottom: "1.5rem" }}>
                Click outside this modal to close the backdrop, or use the
                button below.
              </Body>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </_Backdrop>
        )}
      </div>
    );
  },
};

// With Alert
export const WithAlert: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open Alert Dialog</Button>

        {isOpen && (
          <_Backdrop onClick={() => alert("Backdrop clicked!")}>
            <div
              role="dialog"
              aria-modal="true"
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "400px",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
                Alert Dialog
              </Title>
              <Body fontSize="b2">
                Click the backdrop (dark area) to trigger an alert
              </Body>
            </div>
          </_Backdrop>
        )}
      </div>
    );
  },
};

// With Form
export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>

        {isOpen && (
          <_Backdrop onClick={() => setIsOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                minWidth: "400px",
                maxWidth: "500px",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                }
                e.stopPropagation();
              }}
            >
              <Title as="h2" fontSize="t2" style={{ marginBottom: "1.5rem" }}>
                Contact Form
              </Title>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
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

                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
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
            </div>
          </_Backdrop>
        )}
      </div>
    );
  },
};

// Non-closeable
export const NonCloseable: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Non-closeable Modal
        </Button>

        {isOpen && (
          <_Backdrop>
            <div
              role="dialog"
              aria-modal="true"
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "400px",
              }}
            >
              <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
                Non-closeable Modal
              </Title>
              <Body fontSize="b2" style={{ marginBottom: "1.5rem" }}>
                This modal can only be closed using the button below. Clicking
                the backdrop won't close it.
              </Body>
              <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
            </div>
          </_Backdrop>
        )}
      </div>
    );
  },
};

// Multiple Modals
export const MultipleModals: Story = {
  render: () => {
    const [firstOpen, setFirstOpen] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);

    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <Button onClick={() => setFirstOpen(true)}>Open First Modal</Button>

        {firstOpen && (
          <_Backdrop onClick={() => setFirstOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "400px",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setFirstOpen(false);
                }
                e.stopPropagation();
              }}
            >
              <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
                First Modal
              </Title>
              <Body fontSize="b2" style={{ marginBottom: "1.5rem" }}>
                This is the first modal. You can open another modal on top of
                this one.
              </Body>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button onClick={() => setSecondOpen(true)}>
                  Open Second Modal
                </Button>
                <Button variant="neutral" onClick={() => setFirstOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </_Backdrop>
        )}

        {secondOpen && (
          <_Backdrop onClick={() => setSecondOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "400px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSecondOpen(false);
                }
                e.stopPropagation();
              }}
            >
              <Title as="h2" fontSize="t2" style={{ marginBottom: "1rem" }}>
                Second Modal
              </Title>
              <Body fontSize="b2" style={{ marginBottom: "1.5rem" }}>
                This modal is displayed on top of the first one.
              </Body>
              <Button onClick={() => setSecondOpen(false)}>Close</Button>
            </div>
          </_Backdrop>
        )}
      </div>
    );
  },
};

// Simple Static
export const SimpleStatic: Story = {
  args: {
    children: (
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Static Content</h2>
        <p>This is a static backdrop example without interactivity.</p>
      </div>
    ),
  },
};
