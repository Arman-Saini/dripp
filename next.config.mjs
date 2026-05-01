import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  devIndicators: false,
  outputFileTracingRoot: projectRoot,
  webpack(config) {
    config.cache = false;
    return config;
  }
};

export default nextConfig;
