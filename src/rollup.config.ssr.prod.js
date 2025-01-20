import { bPlugins } from './config/ssr.config.js';
import external from './config/external.js';

import terser from '@rollup/plugin-terser';
import sizes from "rollup-plugin-sizes";
import { visualizer } from "rollup-plugin-visualizer";

export default {
  input: ['./src/server/requests/Main.jsx'],
  output: {
    file: './src/ssr-compiled/requests/main.js',
    name: 'main',
    format: 'es',
    chunkFileNames() {
      return 'common.js'
    }
  },
  external,
  plugins: [
    ...bPlugins('production'),
    terser({
      output: {
        comments: false,
      },
      compress: {
        drop_console: true,
      },
    }),
    sizes(),
    visualizer({
      emitFile: false,
      filename: "visualizations.html",
    }),
  ]
};