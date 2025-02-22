import { useCallback, useMemo, useState, useEffect } from 'react';
import { parseEther, formatEther } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';
import contractConfig from '@/config/abi.json';
import { useWallet } from './useWallet';
import type { ContractConfig } from '@/types/contract';

// ETH的特殊标识地址（零地址）
const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
// SM代币合约地址
const SM_TOKEN_ADDRESS = contractConfig.smToken.address;

export function useDepositContract() {
  const { provider, account } = useWallet();
  const config = contractConfig as ContractConfig;
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [smBalance, setSmBalance] = useState('0');
  const [nativeBalance, setNativeBalance] = useState('0'); // 新增：ETH钱包余额

  const contract = useMemo(() => {
    if (!provider) return null;
    return new Contract(
      config.depositContract.address,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.depositContract.abi as any,
      provider.getSigner(),
    );
  }, [provider, config]);

  const getBalance = useCallback(async () => {
    if (!contract || !account) return '0';
    try {
      const balanceInstance = await contract.getBalance(NATIVE_ETH_ADDRESS, account);
      const formattedBalance = formatEther(balanceInstance);
      setBalance(formattedBalance);
      return formattedBalance;
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      return '0';
    }
  }, [contract, account]);

  const getSmBalance = useCallback(async () => {
    if (!contract || !account) return '0';
    try {
      const balanceInstance = await contract.getBalance(SM_TOKEN_ADDRESS, account);
      const formattedBalance = formatEther(balanceInstance);
      setSmBalance(formattedBalance);
      return formattedBalance;
    } catch (err) {
      console.error('Failed to fetch SM balance:', err);
      return '0';
    }
  }, [contract, account]);

  const getNativeBalance = useCallback(async () => {
    if (!provider || !account) return '0';
    try {
      const balanceInstance = await provider.getBalance(account);
      const formattedBalance = formatEther(balanceInstance);
      setNativeBalance(formattedBalance);
      return formattedBalance;
    } catch (err) {
      console.error('Failed to fetch ETH balance:', err);
      return '0';
    }
  }, [provider, account]);

  const updateBalances = useCallback(async () => {
    await Promise.all([
      getBalance(),
      getSmBalance(),
      getNativeBalance(), // 新增：更新ETH余额
    ]);
  }, [getBalance, getSmBalance, getNativeBalance]);

  useEffect(() => {
    updateBalances();
    // 可选：设置定期更新余额
    const interval = setInterval(updateBalances, 10000); // 每10秒更新一次
    return () => clearInterval(interval);
  }, [updateBalances]);

  const deposit = useCallback(
    async (amount: string) => {
      if (!contract) throw new Error('No provider');
      setIsLoading(true);
      try {
        const tx = await contract.deposit({
          value: parseEther(amount),
        });
        await tx.wait();
        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [contract, updateBalances],
  );

  const withdraw = useCallback(
    async (amount: string) => {
      if (!contract) throw new Error('No provider');
      setIsLoading(true);
      try {
        const tx = await contract.withdraw(parseEther(amount));
        await tx.wait();
        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [contract, updateBalances],
  );

  const depositSM = useCallback(
    async (amount: string) => {
      if (!contract || !account) throw new Error('Contract not initialized');
      setIsLoading(true);
      try {
        const tx = await contract.depositToken(config.smToken.address, parseEther(amount));
        await tx.wait();
        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [contract, account, config, updateBalances],
  );

  const withdrawSM = useCallback(
    async (amount: string) => {
      if (!contract || !account) throw new Error('Contract not initialized');
      setIsLoading(true);
      try {
        const tx = await contract.withdrawToken(SM_TOKEN_ADDRESS, parseEther(amount));
        await tx.wait();
        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [contract, account, updateBalances],
  );

  return {
    ethBalance: balance,
    smBalance,
    nativeBalance, // 新增：返回ETH钱包余额
    deposit,
    withdraw,
    depositSM,
    withdrawSM,
    isLoading,
    updateBalances,
  };
}
