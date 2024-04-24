module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  settings: {
    "react": {
      version: "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"]
      }
    }
  },
  extends: [
    "plugin:@next/next/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:tailwind/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "react",
    "react-hooks",
    "import",
    "tailwindcss",
    "@typescript-eslint"
  ],
  rules: {
    "react/display-name": "off",
    "prettier/prettier": ["off", { singleQuote: true }],
    "react/no-unescaped-entities": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",
    "@next/next/no-img-element": "off",
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "lines-around-comment": [
      "off",
      {
        beforeLineComment: true,
        beforeBlockComment: true,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        allowArrayStart: true
      }
    ],
    "newline-before-return": "off",
    "import/newline-after-import": [
      "off",
      {
        count: 1
      }
    ],
    "@typescript-eslint/ban-types": [
      "off",
      {
        extendDefaults: true,
        types: {
          "{}": false
        }
      }
    ],
    "tailwindcss/classnames-order": "off",
    "tailwindcss/enforces-negative-arbitrary-values": "off",
    "tailwindcss/enforces-shorthand": "off",
    "tailwindcss/migration-from-tailwind-2": "off",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-contradicting-classname": "off",
    "padding-line-between-statements": [
      "off",
      {
        blankLine: "always",
        prev: "*",
        next: [
          "return",
          "block-like",
          "multiline-block-like",
          "expression",
          "multiline-expression"
        ]
      }
    ],
    "react/jsx-newline": [
      "off",
      {
        prevent: false
      }
    ]
  }
}
