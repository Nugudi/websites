import { writeFileSync } from "node:fs";
import { build } from "esbuild";
import * as themes from "./src/index.js";

// Build JavaScript/TypeScript
async function buildJS() {
  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    format: "esm",
    platform: "neutral",
    target: "es2020",
    external: ["@vanilla-extract/css"],
  });

  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.cjs",
    format: "cjs",
    platform: "neutral",
    target: "es2020",
    external: ["@vanilla-extract/css"],
  });
}

// Enhanced CSS generation with better naming
function generateCSS() {
  const toCssProperty = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };

  const cssVariables: string[] = [];
  const cssClasses: string[] = [];

  // Generate CSS variables
  Object.entries(themes.vars).forEach(([key, value]) => {
    if (key === "colors") {
      Object.entries(value.$static).forEach(([theme, colors]) => {
        const selector = theme === "light" ? ":root" : ":root .theme-dark";
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
    } else {
      const selector = ":root";
      const variables = Object.entries(value)
        .map(([group, groupValues]) =>
          Object.entries(groupValues)
            .map(
              ([property, propertyValue]) =>
                `  --${toCssProperty(group)}-${toCssProperty(property)}: ${propertyValue};`,
            )
            .join("\n"),
        )
        .join("\n");

      cssVariables.push(`${selector} {\n${variables}\n}`);
    }
  });

  // Generate CSS classes
  Object.entries(themes.classes).forEach(([, value]) => {
    Object.entries(value).forEach(([category, categoryValues]) => {
      Object.entries(categoryValues).forEach(([variant, styles]) => {
        const className = `.${toCssProperty(category)}-${toCssProperty(variant)}`;
        const properties = Object.entries(styles)
          .map(([prop, val]) => `  ${toCssProperty(prop)}: ${val};`)
          .join("\n");

        cssClasses.push(`${className} {\n${properties}\n}`);
      });
    });
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
