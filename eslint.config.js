import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginTS from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: eslintPluginReact,
      '@typescript-eslint': eslintPluginTS
    },
    rules: {}
  }
]
