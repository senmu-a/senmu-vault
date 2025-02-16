const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
module.exports = {
  output: {
    publicPath: '/',
    // JS 文件输出配置
    filename: 'scripts/[name].bundle.js',
    // chunk 文件输出配置
    chunkFilename: 'scripts/[name].chunk.js',
    // 图片、字体等资源文件输出配置
    assetModuleFilename: 'assets/[type]/[name][ext]'
  },
   plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        favicon: './public/favicon.ico',
        template: resolve(__dirname, '../src/index-prod.html'),
      }),
      // new BundleAnalyzerPlugin(),
    ],
};
