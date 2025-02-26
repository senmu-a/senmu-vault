import { useCallback, useEffect } from 'react';
import { hooks, metaMask } from '@connectors/metaMask';

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks;

export function useWallet() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask');
    });
  }, []);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const connect = async () => {
    const resetWalletState = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ethereum = (window as any).ethereum;

        // 先尝试直接处理掉待处理的请求
        if (ethereum?.request) {
          try {
            // 直接请求账户，这会清除之前的待处理请求
            await ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            });
          } catch (permError) {
            console.debug('Permission request failed:', permError);
          }
        }

        // 清理所有监听器
        if (provider?.removeAllListeners) {
          provider.removeAllListeners();
        }

        if (ethereum?.removeAllListeners) {
          ethereum.removeAllListeners('connect');
          ethereum.removeAllListeners('accountsChanged');
          ethereum.removeAllListeners('chainChanged');
          ethereum.removeAllListeners('disconnect');
        }
        // 给 MetaMask 一点时间处理完所有请求
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.debug('Reset state failed:', error);
      }
    };

    const tryConnect = async () => {
      try {
        await metaMask.activate();
      } catch (err: unknown) {
        console.debug('MetaMask connection attempt failed:', (err as Error)?.message);

        if ((err as Error)?.message.includes('Already processing eth_requestAccounts')) {
          await resetWalletState();
        }
        throw err;
      }
    };

    return tryConnect();
  };

  const disconnect = () => {
    if (metaMask?.deactivate) {
      void metaMask.deactivate();
    } else {
      void metaMask.resetState();
    }
  };

  return {
    isActive,
    isActivating,
    connect,
    disconnect,
    account: accounts?.[0],
    chainId,
    provider,
    formatAddress,
  };
}
