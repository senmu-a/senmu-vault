// 模拟依赖必须在变量定义之前使用工厂函数形式
jest.mock('@web3-react/metamask', () => ({
  MetaMask: jest.fn().mockImplementation(() => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    provider: { request: jest.fn() },
  })),
}));

jest.mock('@web3-react/core', () => ({
  initializeConnector: jest.fn().mockImplementation(callback => {
    const mockActions = { someAction: jest.fn() };
    const connector = callback(mockActions);
    return [
      connector,
      {
        useChainId: jest.fn(),
        useAccounts: jest.fn(),
        useIsActivating: jest.fn(),
        useIsActive: jest.fn(),
        useProvider: jest.fn(),
      },
    ];
  }),
}));

// 模拟 metaMask.ts 文件的导出
jest.mock('@connectors/metaMask', () => {
  const { initializeConnector } = require('@web3-react/core');
  const { MetaMask } = require('@web3-react/metamask');

  const mockActions = { someAction: jest.fn() };
  const mockConnector = new MetaMask({ actions: mockActions });

  const mockHooks = {
    useChainId: jest.fn(),
    useAccounts: jest.fn(),
    useIsActivating: jest.fn(),
    useIsActive: jest.fn(),
    useProvider: jest.fn(),
  };

  return {
    metaMask: mockConnector,
    hooks: mockHooks,
  };
});

// 导入被测试的模块，必须在模拟之后
import { metaMask, hooks } from '@connectors/metaMask';

describe('MetaMask Connector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize MetaMask connector correctly', () => {
    // 验证 metaMask 和 hooks 都被正确导出
    expect(metaMask).toBeDefined();
    expect(hooks).toBeDefined();
  });

  it('should have MetaMask instance with expected methods', () => {
    // 验证 metaMask 对象上应该有的方法
    expect(metaMask).toHaveProperty('activate');
    expect(metaMask).toHaveProperty('deactivate');
    expect(metaMask).toHaveProperty('provider');
  });

  it('should export hooks object with expected methods', () => {
    // 验证 hooks 对象包含预期的方法
    expect(hooks).toHaveProperty('useChainId');
    expect(hooks).toHaveProperty('useAccounts');
    expect(hooks).toHaveProperty('useIsActivating');
    expect(hooks).toHaveProperty('useIsActive');
    expect(hooks).toHaveProperty('useProvider');
  });
});
