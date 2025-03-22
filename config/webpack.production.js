//开启JS多线程的压缩
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const { resolve } = require('path');
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  output: {
    publicPath: '/',
    // JS 文件输出配置
    filename: 'scripts/[name].[contenthash:5].bundle.js',
    // chunk 文件输出配置
    chunkFilename: 'scripts/[name].chunk.js',
    // 图片、字体等资源文件输出配置
    assetModuleFilename: 'assets/[type]/[name].[contenthash:5][ext]',
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
      scriptLoading: 'defer',
      inject: true,
      minify: true,
      templateParameters: (compilation, assets, options) => {
        const files = assets.js || [];
        const vendorFile = files.find(file => file.includes('react-vendor')) || '';
        
        return {
          htmlWebpackPlugin: {
            tags: assets,
            options: options
          },
          files,
          vendorFile,
          options
        };
      },
      template: resolve(__dirname, '../src/index-prod.html'),
    }),
    new GenerateSW({
      // 不允许遗留任何旧的 Service Workers
      cleanupOutdatedCaches: true,
      // 工作模式
      clientsClaim: true,
      skipWaiting: true,
      // 不包含 workbox 运行时代码
      excludeChunks: ['workbox-runtime', 'runtime'],
      // 导航预加载
      navigateFallback: '/index.html',
      // 静态资源缓存
      runtimeCaching: [
        {
          // 匹配所有的图片请求
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
            },
          },
        },
        {
          // API 请求缓存策略
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60, // 5 分钟
            },
          },
        },
        {
          // 字体文件缓存策略
          urlPattern: /\.(?:eot|ttf|woff|woff2)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1 年
            },
          },
        },
      ],
    }),
    // 添加 Gzip 压缩插件
    // new CompressionPlugin({
    //   algorithm: 'brotliCompress',
    //   test: /\.(js|css|html|svg)$/,
    //   filename: "[path][base].br",
    //   threshold: 10240, // 只有大于 10KB 的资源才会被压缩
    //   minRatio: 0.8, // 只有压缩率小于 0.8 的资源才会被压缩
    // }),
    // 使用 InlineChunkHtmlPlugin 替代
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    // new BundleAnalyzerPlugin(),
  ],
};
