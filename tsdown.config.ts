import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['es', 'cjs'],
  platform: 'neutral',
  dts: true,
  sourcemap: true,
  exports: false,
  outExtensions: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.js',
  }),
});
