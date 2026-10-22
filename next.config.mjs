import path from "node:path";

const PHASE_DEVELOPMENT_SERVER = "phase-development-server";

const nextConfig = (phase) => ({
  output: "export",
  outputFileTracingRoot: path.resolve(process.cwd()),
  // Keep development files separate; production writes the static site to /out.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-wedding-dev" : "out",
});

export default nextConfig;
