import { useMemo } from 'react';
import { CHAINS } from '@utils/chains';

export interface NetworkInfo {
  name: string;
  chainId: number;
  icon: string;
}

interface WalletBalancesProps {
  chainId?: number;
}

// TODO: 处理钱包余额
export function useWalletBalances({ chainId }: WalletBalancesProps) {
  console.log(chainId);
  return useMemo(() => {
    return Object.entries(CHAINS).map(([id, chain]) => ({
      name: chain.name,
      chainId: Number(id),
      icon: `/icons/${chain.name.toLowerCase()}.svg`,
    }));
  }, []);
}
