import { bPlugins } from './config/ssr.config.js';
import external from './config/external.js';

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
    ...bPlugins()
  ]
};