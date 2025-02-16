import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useWallet } from '@/hooks/useWallet';
import { useDepositContract } from '@/hooks/useDepositContract';
import { Wallet } from 'lucide-react';
import { useSMToken } from '@/hooks/useSMToken';

export const DepositForm = () => {
  const { isActive, isActivating, connect, account } = useWallet();
  const { ethBalance, smBalance, nativeBalance, deposit, withdraw, depositSM, withdrawSM, isLoading, updateBalances } = useDepositContract();
  const { balance: smTokenBalance, approve, updateBalance: updateSmBalance } = useSMToken();
  const [amount, setAmount] = useState('');
  const [activeToken, setActiveToken] = useState<'ETH' | 'SM'>('ETH');

  const handleConnect = async () => {
    try {
      await toast.promise(connect(), {
        loading: '连接钱包中...',
        success: '钱包连接成功',
        error: '连接失败'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (type: 'deposit' | 'withdraw') => {
    if (!amount || isLoading) return;
    
    try {
      const inputAmount = parseFloat(amount);
      if (isNaN(inputAmount) || inputAmount <= 0) {
        toast.error('请输入有效金额');
        return;
      }

      if (type === 'withdraw') {
        const balance = activeToken === 'ETH' ? ethBalance : smBalance;
        if (inputAmount > parseFloat(balance)) {
          toast.error('余额不足');
          return;
        }
      }

      if (activeToken === 'SM' && type === 'deposit') {
        if (parseFloat(amount) > parseFloat(smTokenBalance)) {
          toast.error('SM代币余额不足');
          return;
        }
        
        await toast.promise(approve(amount), {
          loading: '授权中...',
          success: '授权成功',
          error: '授权失败'
        });
      }

      const handler = activeToken === 'ETH' 
        ? (type === 'deposit' ? deposit : withdraw)
        : (type === 'deposit' ? depositSM : withdrawSM);

      await toast.promise(handler(amount), {
        loading: `${type === 'deposit' ? '存入' : '提取'}中...`,
        success: `${type === 'deposit' ? '存入' : '提取'}成功`,
        error: (err) => {
          const message = err?.message || '操作失败';
          if (message.includes('user rejected')) return '用户取消交易';
          if (message.includes('insufficient funds')) return '余额不足';
          return '操作失败: ' + message;
        }
      });
      
      // 更新所有相关余额
      await updateBalances();
      await updateSmBalance();
      setAmount('');
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <button
          onClick={handleConnect}
          disabled={isActivating}
          className="inline-flex items-center px-6 py-3 rounded-lg
                   bg-[#48e59b] text-white hover:bg-[#48e59b]/90
                   disabled:opacity-50 transition-colors"
        >
          <Wallet className="w-5 h-5 mr-2" />
          {isActivating ? '连接中...' : '连接钱包'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {activeToken === 'ETH' ? 'ETH' : 'SM'} 存款
          </h2>
          <span className="text-sm text-gray-500">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold text-[#48e59b]">
          {activeToken === 'ETH' ? ethBalance : smBalance} {activeToken}
        </p>
        {activeToken === 'SM' && (
          <p className="mt-1 text-sm text-gray-500">
            钱包余额: {smTokenBalance} SM
          </p>
        )}
        {activeToken === 'ETH' && (
          <p className="mt-1 text-sm text-gray-500">
            钱包余额: {Number(nativeBalance).toFixed(4)} ETH
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveToken('ETH')}
            className={`px-4 py-2 rounded ${
              activeToken === 'ETH' 
                ? 'bg-[#48e59b] text-white' 
                : 'bg-gray-100'
            }`}
          >
            ETH
          </button>
          <button
            onClick={() => setActiveToken('SM')}
            className={`px-4 py-2 rounded ${
              activeToken === 'SM' 
                ? 'bg-[#48e59b] text-white' 
                : 'bg-gray-100'
            }`}
          >
            SM Token
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            金额 (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="输入ETH数量"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                     shadow-sm focus:ring-[#48e59b] focus:border-[#48e59b]"
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleSubmit('deposit')}
            disabled={isLoading || !amount}
            className="flex-1 px-4 py-2 bg-[#48e59b] text-white rounded-md 
                     hover:bg-[#48e59b]/90 disabled:opacity-50"
          >
            存入
          </button>
          <button
            onClick={() => handleSubmit('withdraw')}
            disabled={isLoading || !amount}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md 
                     hover:bg-gray-700 disabled:opacity-50"
          >
            提取
          </button>
        </div>
      </div>
    </div>
  );
};
