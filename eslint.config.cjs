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
        ecmaVersion: 2015,
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
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
