import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
import autoprefixer from 'autoprefixer';
import commonjs from '@rollup/plugin-commonjs';
import swc from '@rollup/plugin-swc';
import image from '@rollup/plugin-image';

import path from 'path';
import appRoot from 'app-root-path';

const postCSSParams = {
  extract: 'tmp/css/main.css',
  minimize: true,
  use: {
    sass: {
      silenceDeprecations: ["legacy-js-api"]
    }
  },
  plugins: [
    autoprefixer(),
    url({
      url: "inline",
      maxSize: 10,
      fallback: "copy",
    }),
  ],
}

export const bPlugins = (type = 'development') => {
  return [
    replace({
      preventAssignment: true,
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(type)
    }),
    resolve({
      extensions: ['.js', '.jsx'],
      browser: true,
    }),
    image(),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(appRoot.path, 'src'),
        },
      ]
    }),
    postcss(postCSSParams),
    commonjs(),
    swc({
      swc: {
        minify: false,
        jsc: {
          target: "es2020",
          parser: {
            syntax: "ecmascript",
            jsx: true,
            numericSeparator: false,
            classPrivateProperty: false,
            privateMethod: false,
            classProperty: false,
            functionBind: false,
            decorators: false,
            decoratorsBeforeExport: false
          },
          transform: {
            react: {
              pragma: "React.createElement",
              pragmaFrag: "React.Fragment",
              throwIfNamespace: true,
              development: false,
              useBuiltins: false
            },
            optimizer: {
              globals: {
                vars: {
                  "__DEBUG__": "true"
                }
              }
            }
          },
          minify: {
            compress: {
              unused: true,
              drop_console: false,
            },
            mangle: true,
            format: {
              braces: true,
              comments: false,
            }
          }
        }
      }
    }),
  ]
}