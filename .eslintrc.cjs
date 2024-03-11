/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:github/recommended', '@antfu', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'filenames/match-regex': 'off',

    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['warn', { allow: ['debug'] }]
        : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'antfu/if-newline': 'off',

    'i18n-text/no-en': 'off',

    'vue/prefer-separate-static-class': 'off',
  },
};
