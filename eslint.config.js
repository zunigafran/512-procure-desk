// eslint.config.js
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  globalIgnores(["dist/*", ".expo/*", "example/*"]),
  expoConfig,

  // your code: strict
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // nothing may import a route file
            {
              target: ["./src/components", "./src/lib", "./src/constants"],
              from: "./src/app",
            },
            // helpers stay free of UI
            {
              target: ["./src/lib", "./src/constants"],
              from: ["./src/app", "./src/components"],
            },
            // index.tsx is only a doorway to the home screen
            {
              target: "./src/app/index.tsx",
              from: "./src",
              except: ["./app/0_home"],
              message: "index.tsx may only import from ./0_home",
            },
          ],
        },
      ],
    },
  },

  // index.tsx may not pull in packages either
  {
    files: ["src/app/index.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // anything whose import path does not start with "./0_home/"
              regex: "^(?!\\./0_home/)",
              message: "index.tsx may only import from ./0_home",
            },
          ],
        },
      ],
    },
  },

  // vendored kit: report, don't block
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]);
