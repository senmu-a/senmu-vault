import { useEffect } from 'react';
import { hooks, metaMask } from '@/connectors/metaMask';

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider
} = hooks;

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

  const connect = async () => {
    try {
      await metaMask.activate();
    } catch (err) {
      console.error('Failed to connect to MetaMask:', err);
      throw err;
    }
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
    provider
  };
}
