module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard-with-typescript'],
  overrides: [
    {
      files: '*.ts'
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './example/tsconfig.json']
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 0
  }
}
