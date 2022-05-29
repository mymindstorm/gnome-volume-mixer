import commonjs from '@rollup/plugin-commonjs';

const prefsFooter = [
  'var init = prefs.init;',
  'var fillPreferencesWindow = prefs.fillPreferencesWindow;',
].join('\n')

export default [
  {
    input: 'src/extension.js',
    output: {
      file: `dist/extension.js`,
      format: 'iife',
      name: 'init',
      exports: 'default',
    },
    plugins: [
      commonjs()
    ],
  },
  {
    input: 'src/prefs.js',
    output: {
      file: `dist/prefs.js`,
      format: 'iife',
      name: 'prefs',
      exports: 'default',
      footer: prefsFooter,
    },
    plugins: [
      commonjs()
    ],
  },
];
