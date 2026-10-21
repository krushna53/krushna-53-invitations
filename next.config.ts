import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import path from "node:path";

const nextConfig = (phase: string): NextConfig => ({
  output: "export",
  outputFileTracingRoot: path.resolve(process.cwd()),
  // Keep development files separate; production writes the static site to /out.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-wedding-dev" : "out",
});

export default nextConfig;
