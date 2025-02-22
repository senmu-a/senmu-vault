const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve, join } = require('path');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const port = 3000;
module.exports = {
  devServer: {
    historyApiFallback: true,
    static: {
      directory: join(__dirname, '../dist'),
    },
    hot: true,
    port,
  },
  stats: 'errors-only',
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
      title: 'Senmu-Vault',
      filename: 'index.html',
      favicon: './public/favicon.ico',
      template: resolve(__dirname, '../src/index-dev.html'),
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:' + port],
        notes: ['💊 构建信息请及时关注窗口左下角'],
      },
      onErrors: function (severity, errors) {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        console.log(error);
        notifier.notify({
          title: '👒 Webpack Build Error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: join(__dirname, 'icon.png'),
        });
      },
      clearConsole: true,
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
