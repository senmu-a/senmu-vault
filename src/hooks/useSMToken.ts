import { useCallback, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { parseEther, formatEther } from '@ethersproject/units';
import contractConfig from '@/config/abi.json';
import { useWallet } from './useWallet';
import type { ContractConfig } from '@/types/contract';

export const useSMToken = () => {
  const { provider, account } = useWallet();
  const [balance, setBalance] = useState('0');
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const config = contractConfig as ContractConfig;

  useEffect(() => {
    if (!provider) return;
    const contractInstance = new Contract(
      config.smToken.address,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.smToken.abi as any,
      provider.getSigner(),
    );
    setContract(contractInstance);
  }, [provider, config]);

  const updateBalance = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const balanceInstance = await contract.balanceOf(account);
      setBalance(formatEther(balanceInstance));
    } catch (err) {
      console.error('Failed to fetch SM token balance:', err);
    }
  }, [contract, account]);

  useEffect(() => {
    updateBalance();
    // 每10秒更新一次余额
    const interval = setInterval(updateBalance, 10000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  const approve = useCallback(
    async (amount: string) => {
      if (!contract || !account) throw new Error('Contract not initialized');
      setIsLoading(true);
      try {
        const tx = await contract.approve(config.depositContract.address, parseEther(amount));
        await tx.wait();
        await updateBalance();
      } finally {
        setIsLoading(false);
      }
    },
    [contract, account, config, updateBalance],
  );

  return {
    balance,
    approve,
    updateBalance,
    isLoading,
  };
};
