import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import typescriptParser from '@typescript-eslint/parser';

import enforceLibWrappers from './eslint-rules/enforceLibWrappers.js';
import enforceSingleObjectParam from './eslint-rules/enforceSingleObjectParam.js';

// Each library may only be imported in its wrapper file (enforce-lib-wrappers)

const LIB_WRAPPERS = {
  luxon: 'src/shared/utils/dateUtils.ts',
  '@iconify/react': 'src/@core/components/icon/index.tsx',
  axios: 'src/shared/utils/requests.ts',
  'jwt-decode': 'src/shared/utils/jwtUtils.ts',
  'react-hot-toast': 'src/shared/utils/toasts.tsx',
  'socket.io-client': 'src/shared/redux/slices/socket.ts',
  'chart.js': 'src/shared/utils/trendCharts.ts',
  'react-chartjs-2': 'src/shared/utils/trendCharts.ts',
  jspdf: 'src/shared/utils/dashboardExport.ts',
  'jspdf-autotable': 'src/shared/utils/dashboardExport.ts',
  'yet-another-react-lightbox':
    'src/shared/components/common/lightbox/index.tsx',
  'react-image-crop': 'src/shared/components/common/imageCropper/index.tsx',
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {rules: eslintConfigPrettier.rules},
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      'local-rules': {
        rules: {
          'enforce-single-object-param': enforceSingleObjectParam,
          'enforce-lib-wrappers': enforceLibWrappers,
        },
      },
      'unused-imports': unusedImports,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        1,
        {extensions: ['.js', '.jsx', '.tsx']},
      ],
      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      'import/no-anonymous-default-export': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-console': ['error', {allow: ['warn', 'error']}],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Avoid using ../ — use @/ alias instead',
            },
          ],
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {pattern: 'react', group: 'external', position: 'before'},
            {pattern: '@/**', group: 'internal'},
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'lines-around-comment': [
        'error',
        {
          beforeLineComment: true,
          beforeBlockComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      'newline-before-return': 'error',
      'import/newline-after-import': ['error', {count: 1}],
      'padding-line-between-statements': [
        'error',
        {blankLine: 'always', prev: ['export'], next: ['*']},
        {
          blankLine: 'always',
          prev: ['*'],
          next: ['multiline-const', 'multiline-let', 'multiline-var', 'export'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'unused-imports/no-unused-imports': 'error',

      'local-rules/enforce-single-object-param': ['error'],
      'local-rules/enforce-lib-wrappers': ['error', {wrappers: LIB_WRAPPERS}],
    },
  },

  // React component files stay small: split logic (index.tsx) from display (XxxUI.tsx)

  {
    files: ['**/*.tsx'],
    rules: {
      'max-lines': [
        'error',
        {max: 200, skipBlankLines: false, skipComments: false},
      ],
    },
  },

  // Disable enforce-single-object-param for proxy only

  {
    files: ['**/proxy.ts', '**/proxy/**/*.ts', '**/redux/**/*.ts'],
    rules: {
      'local-rules/enforce-single-object-param': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '.claude/**',
    ],
  },
];

export default eslintConfig;
