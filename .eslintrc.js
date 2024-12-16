module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
<<<<<<< HEAD
  plugins: ['@typescript-eslint'],
=======
  plugins: ['@typescript-eslint/eslint-plugin'],
>>>>>>> 08bc9a4 (feat: docker compose, db, prettier, ts config set up)
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
<<<<<<< HEAD
  ignorePatterns: ['.eslintrc.js', '**/*.d.ts', '**/*.spec.ts'],
=======
  ignorePatterns: ['.eslintrc.js'],
>>>>>>> 08bc9a4 (feat: docker compose, db, prettier, ts config set up)
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
<<<<<<< HEAD
    '@typescript-eslint/no-unused-vars': 'warn',
=======
>>>>>>> 08bc9a4 (feat: docker compose, db, prettier, ts config set up)
  },
};
