module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'react-app'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        assert: 'either',
        depth: 3,
      },
    ],
    'operator-linebreak': [
      'error',
      'after',
      { overrides: { '?': 'before', ':': 'before' } },
    ],
    'comma-dangle': [
      'error',
      {
        imports: 'always-multiline',
        exports: 'always-multiline',
        arrays: 'always-multiline',
        objects: 'always-multiline',
        functions: 'never',
      },
    ],
    'function-paren-newline': 0,
    'object-curly-newline': 0,
    'react/jsx-curly-newline': 0,
    'react/prop-types': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'implicit-arrow-linebreak': 0,
    'react/jsx-one-expression-per-line': 0,
  },
};
