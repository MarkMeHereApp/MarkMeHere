module.exports = {
  // Basic Settings
  printWidth: 80, // Maximum line width
  tabWidth: 2, // Number of spaces per indentation level
  useTabs: false, // Use spaces instead of tabs
  semi: true, // Add semicolons at the end of statements
  singleQuote: true, // Use single quotes instead of double quotes
  trailingComma: 'es5', // Add trailing commas where valid in ES5
  bracketSpacing: true, // Add spaces between object literals within brackets
  arrowParens: 'avoid', // Omit parens when there's only one argument in arrow functions

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
