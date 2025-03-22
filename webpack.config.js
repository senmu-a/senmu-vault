const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));
const { resolve } = require('path');
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _modeflag = _mode === 'production' ? true : false;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { ThemedProgressPlugin } = require('themed-progress-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const webpackBaseConfig = {
  entry: {
    main: resolve('src/main.tsx'),
  },
  output: {
    path: resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: 'swc-loader',
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        include: [resolve(__dirname, 'src'), resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          chunks: 'all',
          name: 'chunk-common',
          minChunks: 2,
          maxInitialRequests: 5,
          priority: 1,
          enforce: true,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
        uiComponent: {
          name: 'chunk-components',
          // 这个是大的 UI 库，先注释，暂时不需要
          // test: /([\\/]node_modules[\\/]@mui[\\/].+\w)|(src[\\/]components[\\/]common)|([\\/]node_modules[\\/]@yideng[\\/]components)/,
          test: /([\\/]node_modules[\\/](lucide-react|goober|mersenne-twister|react-.+))/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        ethersSDK: {
          name: 'chunk-web3-sdk',
          test: /[\\/]node_modules[\\/](bn.js|bech32|hash.js|js-sha3|ethers*\w|@ethersproject*\w|@web3-react*\w)/,
          chunks: 'all',
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
        reactLibs: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'chunk-react-vendor',
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        routerLibs: {
          test: /[\\/]node_modules[\\/](zustand|use-sync-external-store|react-router-dom|react-router|@remix-run[\\/]router)[\\/]/,
          name: 'chunk-router-vendor',
          chunks: 'all',
          priority: 6,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('src/'),
      '@components': resolve('src/components'),
      '@hooks': resolve('src/hooks'),
      '@pages': resolve('src/pages'),
      '@layouts': resolve('src/layouts'),
      '@assets': resolve('src/assets'),
      '@states': resolve('src/states'),
      '@service': resolve('src/service'),
      '@utils': resolve('src/utils'),
      '@lib': resolve('src/lib'),
      '@constants': resolve('src/constants'),
      '@connectors': resolve('src/connectors'),
      '@abis': resolve('src/abis'),
      '@types': resolve('src/types'),
      '@routes': resolve('src/routes'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
    fallback: {
      // stream: require.resolve('stream-browserify'),
    },
  },
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM',
  //   'react-router-dom': 'ReactRouterDOM',
  // },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      ignoreOrder: false,
    }),
    new ThemedProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: '' }],
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
    }),
    // 删除 runtime 文件
    {
      apply(compiler) {
        compiler.hooks.emit.tapAsync('RemoveRuntimeFiles', (compilation, callback) => {
          // 查找所有输出文件
          Object.keys(compilation.assets).forEach(assetName => {
            // 如果文件名包含 runtime，删除该资源
            if (assetName.includes('runtime')) {
              console.log(`Removing asset: ${assetName}`);
              delete compilation.assets[assetName];
            }
          });
          callback();
        });
      }
    },
  ],
};
module.exports = merge.default(webpackBaseConfig, _mergeConfig);
