import type { Preview } from "@storybook/react-vite";
import "@nugudi/themes/themes.css";

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
          value: "#ffffff",
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

      // Apply theme class to html element
      document.documentElement.classList.remove("theme-light", "theme-dark");
      document.documentElement.classList.add(`theme-${theme}`);

      // Apply theme class to body
      document.body.classList.remove("theme-light", "theme-dark");
      document.body.classList.add(`theme-${theme}`);

      // Set Storybook background color based on theme
      const storybook = document.querySelector(".sb-show-main") as HTMLElement;
      if (storybook) {
        storybook.style.backgroundColor =
          theme === "light" ? "#ffffff" : "#121212";
      }

      return Story();
    },
  ],
};

export default preview;
