import { readFileSync } from "node:fs";
import { build } from "esbuild";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

async function run() {
  try {
    await build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      outfile: "dist/index.js",
      format: "esm",
      platform: "node",
      target: "node18",
      external: Object.keys(pkg.dependencies || {}),
    });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

run();
