import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/extension.ts',
    output: {
      file: `dist/extension.js`,
      format: 'iife',
      name: 'init',
      exports: 'default',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      commonjs()
    ],
  }
];
