module.exports = {
  // Basic Settings
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  // Overrides
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 4 // Adjust tab width for JSON files
      }
    }
  ]
};
