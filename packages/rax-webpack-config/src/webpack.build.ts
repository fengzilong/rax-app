import isWebpack4 from './isWebpack4';

export default (config) => {
  // disable devtool of mode prod build
  config.devtool(false);

  let TerserPlugin;
  let terserPluginOptions = {
    parallel: true,
    extractComments: false,
    terserOptions: {
      output: {
        ascii_only: true,
        comments: 'some',
        beautify: false,
      },
      mangle: true,
    },
  };

  let safeParser;
  let CssMinimizerPlugin;

  if (isWebpack4) {
    TerserPlugin = require('terser-webpack-plugin');
    terserPluginOptions = {
      ...terserPluginOptions,
      // @ts-ignore
      sourceMap: false,
      cache: true,
    };
    // Safe parser
    safeParser = require('@builder/rax-pack/deps/postcss-safe-parser');
    // css minimizer plugin
    CssMinimizerPlugin = require('@builder/rax-pack/deps/css-minimizer-webpack-plugin');
  } else {
    TerserPlugin = require('@builder/pack/deps/terser-webpack-plugin');
    // Safe parser
    safeParser = require('@builder/pack/deps/postcss-safe-parser');
    // css minimizer plugin
    CssMinimizerPlugin = require('@builder/rax-pack/deps/css-minimizer-webpack-plugin');
  }

  // uglify js file
  config.optimization
    .minimizer('TerserPlugin')
    .use(TerserPlugin, [terserPluginOptions]);

  // optimize css file
  config.optimization
    .minimizer('CssMinimizerPlugin')
    .use(CssMinimizerPlugin, [{
      parallel: false,
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
        processorOptions: {
          parser: safeParser,
        },
      },
    }]);
};
