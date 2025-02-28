module.exports = {
  // 指定测试文件的匹配模式，会匹配所有以 .spec.ts、.test.ts、.spec.tsx 或 .test.tsx 结尾的文件
  testMatch: ['**/?(*.)(spec|test).ts?(x)'],

  // 指定在每个测试文件执行前要运行的设置文件
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],

  // 项目根目录，这里设置为空字符串，表示使用当前目录
  rootDir: '',

  // 转换器配置，使用 @swc/jest 转换 .ts 和 .tsx 文件
  // transform: {
  //   '.(ts|tsx)': '@swc/jest',
  // },

  transform: {
    '.(ts|tsx)': [
      '@swc/jest',
      {
        // 增加 SWC 的配置选项
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
        module: {
          type: 'commonjs', // 或 'es6'，取决于你的项目配置
        },
      },
    ],
  },

  // 模块名称映射，可以使用 @utils 作为路径别名访问 src/utils 目录
  moduleNameMapper: {
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@connectors(.*)$': '<rootDir>/src/connectors$1',
  },

  // 测试覆盖率阈值，当覆盖率低于设定值时会导致测试失败
  // coverageThreshold: {
  //   global: {
  //     branches: 50, // 分支覆盖率至少 50%
  //     functions: 95, // 函数覆盖率至少 95%
  //     lines: 95, // 行覆盖率至少 95%
  //     statements: 95, // 语句覆盖率至少 95%
  //   },
  // },

  // 关闭监听所有文件变化
  watchAll: false,

  // 启用代码覆盖率收集
  // collectCoverage: true,

  // 指定生成覆盖率报告的目录
  // coverageDirectory: './docs/jest-coverage',

  // 排除特定路径不进行覆盖率统计
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],

  // 指定模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
};
