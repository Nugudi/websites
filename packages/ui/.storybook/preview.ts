import type { Preview } from "@storybook/react-vite";
import "@/app.css";
import "@/button/button.css";
import "@/typography/typography.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#000000",
        },
        {
          name: "dark",
          value: "#121212",
        },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light Theme" },
          { value: "dark", icon: "moon", title: "Dark Theme" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";

      // Remove existing theme classes and apply current theme to body
      document.body.classList.remove("theme-light", "theme-dark");
      document.body.classList.add(`theme-${theme}`);

      // Set Storybook background color based on theme
      const storybook = document.querySelector(".sb-show-main") as HTMLElement;
      if (storybook) {
        storybook.style.backgroundColor =
          theme === "light" ? "#000000" : "#ffffff";
      }

      // Also set iframe background
      const iframe = document.querySelector(
        "#storybook-preview-iframe",
      ) as HTMLIFrameElement;
      if (iframe?.contentDocument) {
        iframe.contentDocument.body.style.backgroundColor =
          theme === "light" ? "#000000" : "#ffffff";
      }

      return Story();
    },
  ],
};

export default preview;
