/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@next/next/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
  root: true,
  ignorePatterns: ['node_modules/*', '.next/*', 'prisma/*', 'components/*', 'lib/*', 'styles/*'],
      rules: {
        "indent": 'off',
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "error",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
        ]
  }
};
