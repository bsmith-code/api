module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['prettier'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'import/no-unresolved': 0,
    'camelcase': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'array-callback-return': 0
  }
}
