import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import path from "node:path";

const nextConfig = (phase: string): NextConfig => ({
  outputFileTracingRoot: path.resolve(process.cwd()),
  // Keep dev and production files isolated so a build cannot remove chunks
  // that a running dev server is still serving.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-wedding-dev" : ".next-wedding-prod",
});

export default nextConfig;
