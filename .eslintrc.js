module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'plugin:prettier/recommended',
      ],
      settings: {
        'import/resolver': {
          typescript: true,
          node: true
        }
      },
      rules: {
        'import/extensions': 'off',
        // Floating promises in useEffects
        'no-void': 'off',
        // Too restrictive: https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'off',
        // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'off',
        // Use function hoisting to improve code readability
        'no-use-before-define': [
          'error',
          { functions: false, classes: true, variables: true },
        ],
        // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          { functions: false, classes: true, variables: true, typedefs: true },
        ],
        // Common abbreviations are known and readable
        'unicorn/prevent-abbreviations': 'off',
        // Airbnb prefers forEach
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-null': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-node-protocol': 'off',
        'unicorn/explicit-length-check': 'off',
        'consistent-return': 'off',
        'no-param-reassign': ['error', { props: false }],
        'array-callback-return': 'off',
        'no-extra-boolean-cast': 'off',
        'prefer-destructuring': 'off',
        'jest/no-mocks-import': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'unicorn/no-array-reduce': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: ['*.spec.js'],
      rules: {
        'no-undef': 'off',
      },
    }
  ]
}
