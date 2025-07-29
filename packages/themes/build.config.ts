import { mkdirSync, writeFileSync } from "node:fs";
import { build } from "esbuild";
import * as themes from "./src/index.js";

// Ensure dist directory exists
mkdirSync("dist", { recursive: true });

// Build JavaScript/TypeScript
async function buildJS() {
  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    format: "esm",
    platform: "neutral",
    target: "es2020",
  });

  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.cjs",
    format: "cjs",
    platform: "neutral",
    target: "es2020",
  });
}

// Enhanced CSS generation with better naming
function generateCSS() {
  const toCssProperty = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };

  const cssVariables: string[] = [];
  const cssClasses: string[] = [];

  // Type assertion for themes.vars
  const vars = themes.vars as Record<string, any>;

  // Generate CSS variables
  Object.entries(vars).forEach(([key, value]) => {
    if (key === "colors" && value.$static) {
      const colorStatic = value.$static as Record<
        string,
        Record<string, Record<string, string>>
      >;
      Object.entries(colorStatic).forEach(([theme, colors]) => {
        const selector =
          theme === "light"
            ? ":root"
            : `:root[data-theme="${theme}"], :root .theme-${theme}`;
        const variables = Object.entries(colors)
          .map(([colorGroup, colorValues]) =>
            Object.entries(colorValues)
              .map(
                ([shade, colorValue]) =>
                  `  --${toCssProperty(colorGroup)}-${toCssProperty(shade)}: ${colorValue};`,
              )
              .join("\n"),
          )
          .join("\n");

        cssVariables.push(`${selector} {\n${variables}\n}`);
      });
    } else if (typeof value === "object" && value !== null) {
      const selector = ":root";
      const variables = Object.entries(
        value as Record<string, Record<string, string>>,
      )
        .map(([group, groupValues]) =>
          Object.entries(groupValues)
            .map(
              ([property, propertyValue]) =>
                `  --${toCssProperty(group)}-${toCssProperty(property)}: ${propertyValue};`,
            )
            .join("\n"),
        )
        .join("\n");

      if (variables) {
        cssVariables.push(`${selector} {\n${variables}\n}`);
      }
    }
  });

  // Type assertion for themes.classes
  const classes = themes.classes as Record<
    string,
    Record<string, Record<string, Record<string, string>>>
  >;

  // Generate CSS classes
  Object.entries(classes).forEach(([, value]) => {
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([category, categoryValues]) => {
        if (typeof categoryValues === "object" && categoryValues !== null) {
          Object.entries(categoryValues).forEach(([variant, styles]) => {
            if (typeof styles === "object" && styles !== null) {
              const className = `.${toCssProperty(category)}-${toCssProperty(variant)}`;
              const properties = Object.entries(styles)
                .map(([prop, val]) => `  ${toCssProperty(prop)}: ${val};`)
                .join("\n");

              if (properties) {
                cssClasses.push(`${className} {\n${properties}\n}`);
              }
            }
          });
        }
      });
    }
  });

  const css = [...cssVariables, ...cssClasses].join("\n\n");
  writeFileSync("dist/themes.css", css);
}

async function main() {
  try {
    await buildJS();
    generateCSS();
    console.log("✅ Themes build completed successfully");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
