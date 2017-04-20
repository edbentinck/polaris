import {resolve} from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';

import styles from './plugins/styles';
import image from './plugins/image';
import icon from './plugins/icon';

import getClassName from './classname';

const project = resolve(__dirname, '../..');
const buildRoot = resolve(project, './build-intermediate');
const styleRoot = resolve(buildRoot, './styles');

const PACKAGES = [
  'react',
  'react-dom',
  'babel-runtime',
  'tslib',
  'lodash',
  'core-js',
  'hoist-non-react-statics',
  '@shopify/javascript-utilities',
  '@shopify/react-utilities',
];

export default function createRollupConfig({entry, outputCSS}) {
  return {
    entry,
    external(id) {
      return PACKAGES.some((aPackage) => id.startsWith(aPackage));
    },
    plugins: [
      json(),
      nodeResolve({
        module: true,
        jsnext: true,
        main: true,
      }),
      commonjs(),
      styles({
        output: outputCSS,
        includePaths: [styleRoot],
        generateScopedName: getClassName,
      }),
      icon({
        include: '**/icons/*.svg',
        exclude: 'node_modules/**',
      }),
      image({
        exclude: [
          'node_modules/**',
          '**/icons/*.svg',
        ],
      }),
      babel({
        include: '**/*.js',
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
    ],
  };
}