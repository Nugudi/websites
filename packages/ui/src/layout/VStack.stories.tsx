import "@nugudi/react-components-layout/style.css";
import {
  VStack as _VStack,
  Box,
  HStack,
} from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _VStack> = {
  title: "Components/Layout/VStack",
  component: _VStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["stretch", "center", "start", "end", "baseline"],
    },
    basis: {
      control: "select",
      options: ["auto", "content", "fit-content", "max-content", "min-content"],
    },
    grow: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    justify: {
      control: "select",
      options: ["start", "end", "center", "between", "around", "evenly"],
    },
    shrink: {
      control: "select",
      options: Object.keys(vars.box.spacing).map(Number),
    },
    wrap: {
      control: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
    },
    gap: {
      control: { type: "range", min: 0, max: 24, step: 1 },
    },
    color: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
    },
    background: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
    },
  },
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    gap: 8,
  },
  render: (args) => (
    <_VStack {...args}>
      <Box background="main" p="3">
        VStack Item 1
      </Box>
      <Box background="blackAlpha" p="3">
        VStack Item 2
      </Box>
      <Box background="main" p="3">
        VStack Item 3
      </Box>
    </_VStack>
  ),
};

export const WithColor: Story = {
  args: {
    color: "main",
    gap: 8,
  },
  render: (args) => (
    <_VStack {...args}>
      <Box background="main" p="2">
        Item 1
      </Box>
      <Box background="blackAlpha" p="2">
        Item 2
      </Box>
    </_VStack>
  ),
};

export const WithGap: Story = {
  args: {
    gap: 16,
  },
  render: (args) => (
    <_VStack {...args}>
      <Box background="main" p="2">
        Item 1
      </Box>
      <Box background="blackAlpha" p="2">
        Item 2
      </Box>
      <Box background="main" p="2">
        Item 3
      </Box>
    </_VStack>
  ),
};

export const AlignmentVariations: Story = {
  args: {
    gap: 8,
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <div style={{ width: "150px" }}>
        <h4>align: stretch</h4>
        <_VStack
          {...args}
          align="stretch"
          style={{ background: "#f0f0f0", padding: "10px", width: "100%" }}
        >
          <Box background="main" p="2">
            Short
          </Box>
          <Box background="main" p="2">
            Medium Content
          </Box>
          <Box background="main" p="2">
            Very Long Content Here
          </Box>
        </_VStack>
      </div>

      <div style={{ width: "150px" }}>
        <h4>align: center</h4>
        <_VStack
          {...args}
          align="center"
          style={{ background: "#f0f0f0", padding: "10px", width: "100%" }}
        >
          <Box background="main" p="2">
            Short
          </Box>
          <Box background="main" p="2">
            Medium Content
          </Box>
          <Box background="main" p="2">
            Very Long Content Here
          </Box>
        </_VStack>
      </div>

      <div style={{ width: "150px" }}>
        <h4>align: start</h4>
        <_VStack
          {...args}
          align="start"
          style={{ background: "#f0f0f0", padding: "10px", width: "100%" }}
        >
          <Box background="main" p="2">
            Short
          </Box>
          <Box background="main" p="2">
            Medium Content
          </Box>
          <Box background="main" p="2">
            Very Long Content Here
          </Box>
        </_VStack>
      </div>

      <div style={{ width: "150px" }}>
        <h4>align: end</h4>
        <_VStack
          {...args}
          align="end"
          style={{ background: "#f0f0f0", padding: "10px", width: "100%" }}
        >
          <Box background="main" p="2">
            Short
          </Box>
          <Box background="main" p="2">
            Medium Content
          </Box>
          <Box background="main" p="2">
            Very Long Content Here
          </Box>
        </_VStack>
      </div>
    </div>
  ),
};

export const JustifyContent: Story = {
  args: {
    gap: 8,
    align: "stretch",
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h4>justify: start</h4>
        <_VStack
          {...args}
          justify="start"
          style={{
            background: "#f0f0f0",
            padding: "10px",
            height: "200px",
            width: "150px",
          }}
        >
          <Box background="main" p="2">
            Item 1
          </Box>
          <Box background="main" p="2">
            Item 2
          </Box>
          <Box background="main" p="2">
            Item 3
          </Box>
        </_VStack>
      </div>

      <div>
        <h4>justify: center</h4>
        <_VStack
          {...args}
          justify="center"
          style={{
            background: "#f0f0f0",
            padding: "10px",
            height: "200px",
            width: "150px",
          }}
        >
          <Box background="main" p="2">
            Item 1
          </Box>
          <Box background="main" p="2">
            Item 2
          </Box>
          <Box background="main" p="2">
            Item 3
          </Box>
        </_VStack>
      </div>

      <div>
        <h4>justify: end</h4>
        <_VStack
          {...args}
          justify="end"
          style={{
            background: "#f0f0f0",
            padding: "10px",
            height: "200px",
            width: "150px",
          }}
        >
          <Box background="main" p="2">
            Item 1
          </Box>
          <Box background="main" p="2">
            Item 2
          </Box>
          <Box background="main" p="2">
            Item 3
          </Box>
        </_VStack>
      </div>

      <div>
        <h4>justify: between</h4>
        <_VStack
          {...args}
          justify="between"
          style={{
            background: "#f0f0f0",
            padding: "10px",
            height: "200px",
            width: "150px",
          }}
        >
          <Box background="main" p="2">
            Item 1
          </Box>
          <Box background="main" p="2">
            Item 2
          </Box>
          <Box background="main" p="2">
            Item 3
          </Box>
        </_VStack>
      </div>

      <div>
        <h4>justify: around</h4>
        <_VStack
          {...args}
          justify="around"
          style={{
            background: "#f0f0f0",
            padding: "10px",
            height: "200px",
            width: "150px",
          }}
        >
          <Box background="main" p="2">
            Item 1
          </Box>
          <Box background="main" p="2">
            Item 2
          </Box>
          <Box background="main" p="2">
            Item 3
          </Box>
        </_VStack>
      </div>

      <div>
        <h4>justify: evenly</h4>
        <_VStack
          {...args}
          justify="evenly"
          style={{
            background: "#f0f0f0",
            padding: "10px",
            height: "200px",
            width: "150px",
          }}
        >
          <Box background="main" p="2">
            Item 1
          </Box>
          <Box background="main" p="2">
            Item 2
          </Box>
          <Box background="main" p="2">
            Item 3
          </Box>
        </_VStack>
      </div>
    </div>
  ),
};

export const LoginForm: Story = {
  render: () => (
    <_VStack
      gap="16"
      align="stretch"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "24px",
        width: "320px",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <_VStack gap="4" align="center">
        <h2 style={{ margin: 0 }}>Welcome Back</h2>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          Sign in to your account
        </p>
      </_VStack>

      <_VStack gap="12">
        <_VStack gap="4">
          <label
            htmlFor="email"
            style={{ fontSize: "14px", fontWeight: "500" }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </_VStack>

        <_VStack gap="4">
          <label
            htmlFor="password"
            style={{ fontSize: "14px", fontWeight: "500" }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </_VStack>

        <HStack justify="between" align="center">
          <label
            style={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <input type="checkbox" />
            Remember me
          </label>
          <a
            href="https://www.google.com"
            style={{
              fontSize: "14px",
              color: "#007bff",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </a>
        </HStack>
      </_VStack>

      <_VStack gap="8">
        <Box
          background="main"
          p="3"
          style={{
            borderRadius: "4px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Sign In
        </Box>
        <Box
          background="blackAlpha"
          p="3"
          style={{
            borderRadius: "4px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </Box>
      </_VStack>

      <div style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
        Don't have an account?{" "}
        <a
          href="https://www.google.com"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          Sign up
        </a>
      </div>
    </_VStack>
  ),
};

export const Card: Story = {
  render: () => (
    <_VStack
      gap="16"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        width: "300px",
        background: "white",
      }}
    >
      <Box
        background="main"
        p="8"
        style={{ borderRadius: "4px", textAlign: "center" }}
      >
        Image Placeholder
      </Box>

      <_VStack gap="8">
        <h3 style={{ margin: 0 }}>Product Title</h3>
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          This is a description of the product. It provides details about
          features and benefits.
        </p>
      </_VStack>

      <HStack justify="between" align="center">
        <span style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          $99.99
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "#666",
            textDecoration: "line-through",
          }}
        >
          $149.99
        </span>
      </HStack>

      <_VStack gap="8">
        <Box
          background="main"
          p="3"
          style={{
            borderRadius: "4px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </Box>
        <Box
          background="blackAlpha"
          p="3"
          style={{
            borderRadius: "4px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Add to Wishlist
        </Box>
      </_VStack>
    </_VStack>
  ),
};

export const Sidebar: Story = {
  render: () => (
    <_VStack
      gap="4"
      style={{
        background: "#f8f9fa",
        padding: "16px",
        width: "250px",
        height: "500px",
        borderRight: "1px solid #dee2e6",
      }}
    >
      <_VStack gap="8" style={{ marginBottom: "16px" }}>
        <h3 style={{ margin: 0, padding: "0 8px" }}>Dashboard</h3>
      </_VStack>

      <_VStack gap="2">
        {[
          { icon: "🏠", label: "Home", active: true },
          { icon: "📊", label: "Analytics", active: false },
          { icon: "👤", label: "Users", active: false },
          { icon: "💼", label: "Projects", active: false },
          { icon: "💬", label: "Messages", active: false, badge: "3" },
          { icon: "⚙️", label: "Settings", active: false },
        ].map((item) => (
          <HStack
            key={item.label}
            gap="12"
            align="center"
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              background: item.active ? "#e9ecef" : "transparent",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: item.active ? "600" : "400",
              }}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "#dc3545",
                  color: "white",
                  borderRadius: "10px",
                  padding: "2px 6px",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {item.badge}
              </span>
            )}
          </HStack>
        ))}
      </_VStack>

      <div style={{ flex: 1 }} />

      <_VStack
        gap="8"
        style={{ borderTop: "1px solid #dee2e6", paddingTop: "16px" }}
      >
        <HStack gap="12" align="center" style={{ padding: "0 12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#6c757d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            JD
          </div>
          <_VStack gap="0">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              John Doe
            </span>
            <span style={{ fontSize: "12px", color: "#6c757d" }}>
              john@example.com
            </span>
          </_VStack>
        </HStack>
      </_VStack>
    </_VStack>
  ),
};

export const Timeline: Story = {
  render: () => (
    <_VStack gap="0" style={{ padding: "20px", width: "400px" }}>
      {[
        {
          time: "10:30 AM",
          title: "Meeting with Team",
          description: "Discuss Q4 goals",
          color: "#007bff",
        },
        {
          time: "12:00 PM",
          title: "Lunch Break",
          description: "Team lunch at nearby restaurant",
          color: "#28a745",
        },
        {
          time: "2:00 PM",
          title: "Client Presentation",
          description: "Present new design concepts",
          color: "#ffc107",
        },
        {
          time: "4:00 PM",
          title: "Code Review",
          description: "Review pull requests",
          color: "#dc3545",
        },
        {
          time: "5:30 PM",
          title: "Daily Standup",
          description: "Team sync meeting",
          color: "#6c757d",
        },
      ].map((event, index) => (
        <HStack
          key={event.time}
          gap="16"
          align="start"
          style={{ position: "relative", paddingBottom: "24px" }}
        >
          <_VStack align="center" style={{ position: "relative" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: event.color,
                border: "3px solid white",
                boxShadow: `0 0 0 1px ${event.color}`,
                zIndex: 1,
              }}
            />
            {index < 4 && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  width: "2px",
                  height: "calc(100% + 24px)",
                  background: "#dee2e6",
                }}
              />
            )}
          </_VStack>

          <_VStack gap="4" style={{ flex: 1, paddingBottom: "8px" }}>
            <span
              style={{ fontSize: "12px", color: "#6c757d", fontWeight: "600" }}
            >
              {event.time}
            </span>
            <h4 style={{ margin: 0, fontSize: "16px" }}>{event.title}</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>
              {event.description}
            </p>
          </_VStack>
        </HStack>
      ))}
    </_VStack>
  ),
};

export const NotificationList: Story = {
  render: () => (
    <_VStack
      gap="2"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "8px",
        width: "350px",
        background: "white",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <h4 style={{ margin: 0, padding: "8px 12px" }}>Notifications</h4>

      {[
        {
          type: "success",
          title: "Payment Received",
          message: "Your payment of $299 has been processed",
          time: "2 min ago",
        },
        {
          type: "warning",
          title: "Storage Warning",
          message: "You're using 90% of your storage space",
          time: "1 hour ago",
        },
        {
          type: "info",
          title: "New Feature",
          message: "Check out our new dashboard features",
          time: "3 hours ago",
        },
        {
          type: "error",
          title: "Sync Failed",
          message: "Unable to sync your recent changes",
          time: "5 hours ago",
        },
        {
          type: "info",
          title: "Team Invitation",
          message: "You've been invited to join the Design team",
          time: "1 day ago",
        },
      ].map((notification, _) => (
        <HStack
          key={notification.title}
          gap="12"
          align="start"
          style={{
            padding: "12px",
            borderRadius: "6px",
            background: "#f8f9fa",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              marginTop: "4px",
              background:
                notification.type === "success"
                  ? "#28a745"
                  : notification.type === "warning"
                    ? "#ffc107"
                    : notification.type === "error"
                      ? "#dc3545"
                      : "#007bff",
            }}
          />

          <_VStack gap="4" style={{ flex: 1 }}>
            <HStack justify="between" align="start">
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {notification.title}
              </span>
              <span style={{ fontSize: "12px", color: "#6c757d" }}>
                {notification.time}
              </span>
            </HStack>
            <p style={{ margin: 0, fontSize: "13px", color: "#495057" }}>
              {notification.message}
            </p>
          </_VStack>
        </HStack>
      ))}
    </_VStack>
  ),
};

export const PricingCard: Story = {
  render: () => (
    <_VStack
      gap="24"
      align="stretch"
      style={{
        border: "2px solid #007bff",
        borderRadius: "12px",
        padding: "32px",
        width: "320px",
        background: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#007bff",
          color: "white",
          padding: "4px 16px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        MOST POPULAR
      </div>

      <_VStack gap="8" align="center">
        <h3 style={{ margin: 0, fontSize: "24px" }}>Professional</h3>
        <p
          style={{
            margin: 0,
            color: "#6c757d",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Perfect for growing businesses
        </p>
      </_VStack>

      <_VStack gap="4" align="center">
        <span style={{ fontSize: "16px", color: "#6c757d" }}>Starting at</span>
        <HStack align="baseline" gap="4">
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>$</span>
          <span style={{ fontSize: "48px", fontWeight: "bold" }}>49</span>
          <span style={{ fontSize: "16px", color: "#6c757d" }}>/month</span>
        </HStack>
      </_VStack>

      <_VStack gap="12">
        {[
          "Up to 10 users",
          "100GB storage",
          "Priority support",
          "Advanced analytics",
          "Custom integrations",
          "API access",
        ].map((feature) => (
          <HStack key={feature} gap="8" align="center">
            <span style={{ color: "#28a745", fontSize: "16px" }}></span>
            <span style={{ fontSize: "14px" }}>{feature}</span>
          </HStack>
        ))}
      </_VStack>

      <_VStack gap="8">
        <Box
          background="main"
          p="3"
          style={{
            borderRadius: "6px",
            textAlign: "center",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Start Free Trial
        </Box>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#6c757d",
            textAlign: "center",
          }}
        >
          No credit card required
        </p>
      </_VStack>
    </_VStack>
  ),
};

export const CommentSection: Story = {
  render: () => (
    <_VStack gap="16" style={{ width: "500px", padding: "20px" }}>
      <h3 style={{ margin: 0 }}>Comments (4)</h3>

      <_VStack gap="16">
        {[
          {
            author: "Alice Johnson",
            time: "2 hours ago",
            comment:
              "Great article! This really helped me understand the concept better.",
            likes: 12,
            replies: 2,
          },
          {
            author: "Bob Smith",
            time: "5 hours ago",
            comment:
              "I have a question about the implementation details. Could you provide more examples?",
            likes: 5,
            replies: 1,
          },
          {
            author: "Carol White",
            time: "1 day ago",
            comment:
              "Thanks for sharing this. I've been looking for something like this for weeks!",
            likes: 8,
            replies: 0,
          },
          {
            author: "David Lee",
            time: "2 days ago",
            comment:
              "Excellent explanation. The diagrams really made the difference.",
            likes: 15,
            replies: 3,
          },
        ].map((comment) => (
          <_VStack
            key={comment.author}
            gap="12"
            style={{ borderBottom: "1px solid #e9ecef", paddingBottom: "16px" }}
          >
            <HStack gap="12" align="start">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#6c757d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {comment.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <_VStack gap="8" style={{ flex: 1 }}>
                <HStack justify="between" align="center">
                  <HStack gap="8" align="center">
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {comment.author}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6c757d" }}>
                      {comment.time}
                    </span>
                  </HStack>
                  <span style={{ fontSize: "20px", cursor: "pointer" }}>
                    👍
                  </span>
                </HStack>

                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                  {comment.comment}
                </p>

                <HStack gap="16">
                  <HStack gap="4" align="center" style={{ cursor: "pointer" }}>
                    <span style={{ fontSize: "14px" }}>👍</span>
                    <span style={{ fontSize: "13px", color: "#6c757d" }}>
                      {comment.likes}
                    </span>
                  </HStack>
                  <HStack gap="4" align="center" style={{ cursor: "pointer" }}>
                    <span style={{ fontSize: "14px" }}>💬</span>
                    <span style={{ fontSize: "13px", color: "#6c757d" }}>
                      Reply {comment.replies > 0 && `(${comment.replies})`}
                    </span>
                  </HStack>
                </HStack>
              </_VStack>
            </HStack>
          </_VStack>
        ))}
      </_VStack>

      <_VStack gap="8">
        <textarea
          placeholder="Write a comment..."
          style={{
            padding: "12px",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical",
            minHeight: "80px",
          }}
        />
        <HStack justify="end" gap="8">
          <Box
            background="blackAlpha"
            p="2"
            style={{ borderRadius: "4px", cursor: "pointer" }}
          >
            Cancel
          </Box>
          <Box
            background="main"
            p="2"
            style={{ borderRadius: "4px", cursor: "pointer" }}
          >
            Post Comment
          </Box>
        </HStack>
      </_VStack>
    </_VStack>
  ),
};
