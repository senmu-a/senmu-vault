//开启JS多线程的压缩
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { resolve } = require('path');
module.exports = {
  output: {
    publicPath: '/',
    // JS 文件输出配置
    filename: 'scripts/[name].[contenthash:5].bundle.js',
    // chunk 文件输出配置
    chunkFilename: 'scripts/[name].chunk.js',
    // 图片、字体等资源文件输出配置
    assetModuleFilename: 'assets/[type]/[name].[contenthash:5][ext]'
  },
  performance: {
    maxAssetSize: 250000, // 最大资源大小250KB
    maxEntrypointSize: 250000, // 最大入口资源大小250KB
    hints: 'warning', // 超出限制时只给出警告
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
      }),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Senmu-Vault',
      filename: 'index.html',
      favicon: './public/favicon.ico',
      template: resolve(__dirname, '../src/index-prod.html'),
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
