const babelParser = require("@babel/eslint-parser");
const reactPlugin = require("eslint-plugin-react");

module.exports = [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        sourceType: "module",
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      "no-undef": "off",
      "no-console": "warn",
      "no-unused-vars": "error",
      "react/jsx-uses-vars": "warn",
      "react/jsx-uses-react": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
