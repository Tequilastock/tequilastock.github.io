const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['index.html', 'games/*.html']
  },
  js.configs.recommended,
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: globals.browser
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn']
    }
  }
];
