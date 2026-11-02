// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const angularRules = {
  '@angular-eslint/component-class-suffix': 'off',
  '@angular-eslint/directive-class-suffix': 'off',
  '@angular-eslint/prefer-on-push-component-change-detection': 'error',
  '@angular-eslint/use-component-view-encapsulation': 'error',
  '@angular-eslint/prefer-host-metadata-property': 'error',
  '@angular-eslint/prefer-output-readonly': 'error',
  '@angular-eslint/prefer-signals': 'error',
  '@angular-eslint/prefer-inject': 'error',
  // Inputs named `disabled` are aliases of `disabledInput`, so `disabled` can be the merged forms state.
  '@angular-eslint/no-input-rename': 'off',
  'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
};

const templateRules = {
  '@angular-eslint/template/prefer-control-flow': 'error',
  '@angular-eslint/template/prefer-class-binding': 'error',
  '@angular-eslint/template/prefer-style-binding': 'error',
  '@angular-eslint/template/no-any': 'error',
  '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
};

function selectorRules(prefix) {
  return {
    '@angular-eslint/component-selector': [
      'error',
      [
        { type: 'element', prefix, style: 'kebab-case' },
        { type: 'attribute', prefix, style: 'camelCase' },
      ],
    ],
    '@angular-eslint/directive-selector': [
      'error',
      [
        { type: 'attribute', prefix, style: 'camelCase' },
        { type: 'element', prefix, style: 'kebab-case' },
      ],
    ],
  };
}

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'out-tsc/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.angular/**',
      'public/**',
      '**/*.generated.ts',
      'libs/ashen-ui/schematics/**/files/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: angularRules,
  },
  {
    files: ['libs/ashen-ui/src/**/*.ts'],
    rules: selectorRules('sn'),
  },
  {
    files: ['src/**/*.ts'],
    rules: selectorRules(['app', 'doc']),
  },
  {
    files: ['**/*.spec.ts', 'e2e/**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: templateRules,
  },
  {
    files: ['libs/ashen-ui/src/**/*.html'],
    rules: { '@angular-eslint/template/no-inline-styles': ['error', { allowBindToStyle: true }] },
  },
  {
    files: ['**/*.spec.ts/**/*.html'],
    rules: { '@angular-eslint/template/no-inline-styles': 'off' },
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly', require: 'readonly', module: 'writable', __dirname: 'readonly' },
    },
  },
);
