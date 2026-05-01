import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: projectRoot
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**"]
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;
