import { useMemo } from 'react';
import { CHAINS } from '@utils/chains';

export interface NetworkInfo {
  name: string;
  chainId: number;
  icon: string;
}

export function useWalletBalances() {
  return useMemo(() => {
    return Object.entries(CHAINS).map(([id, chain]) => ({
      name: chain.name,
      chainId: Number(id),
      icon: `/icons/${chain.name.toLowerCase()}.svg`,
    }));
  }, []);
}
