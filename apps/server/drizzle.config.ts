import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/**/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: <무조건 있음>
    url: process.env.DATABASE_URL!,
  },
});
