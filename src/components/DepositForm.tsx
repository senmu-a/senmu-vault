import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Wallet } from 'lucide-react';
import { parseUnits, parseEther } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useWallet } from '@hooks/useWallet';
import { useDepositContract } from '@hooks/useDepositContract';
import { useSMToken } from '@hooks/useSMToken';
import { ETradeType, ETokens } from '../types/depositForm';

// 按钮组件
const ActionButton = ({
  onClick,
  disabled,
  children,
  variant = 'primary',
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) => {
  const baseClass = 'flex-1 px-4 py-2 text-white rounded-md disabled:opacity-50';
  const variants = {
    primary: 'bg-[#48e59b] hover:bg-[#48e59b]/90',
    secondary: 'bg-gray-800 hover:bg-gray-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
};

// 令牌选择组件
const TokenSelector = ({
  activeToken,
  setActiveToken,
}: {
  activeToken: ETokens;
  setActiveToken: (token: ETokens) => void;
}) => (
  <div className="flex space-x-2 mb-4">
    {([ETokens.ETH, ETokens.SM] as const).map(token => (
      <button
        key={token}
        onClick={() => setActiveToken(token)}
        className={`px-4 py-2 cursor-pointer rounded ${
          activeToken === token ? 'bg-[#48e59b] text-white' : 'bg-gray-100'
        }`}
      >
        {token === ETokens.SM ? 'SM Token' : token}
      </button>
    ))}
  </div>
);

// 钱包连接界面
const ConnectWallet = ({
  handleConnect,
  isActivating,
}: {
  handleConnect: () => Promise<void>;
  isActivating: boolean;
}) => (
  <div className="text-center p-8">
    <button
      onClick={handleConnect}
      disabled={isActivating}
      className="inline-flex items-center px-6 py-3 rounded-lg
               bg-[#48e59b] text-white hover:bg-[#48e59b]/90
               disabled:opacity-50 transition-colors cursor-pointer"
    >
      <Wallet className="w-5 h-5 mr-2" />
      {isActivating ? '连接中...' : '连接钱包'}
    </button>
  </div>
);

export const DepositForm = () => {
  const { isActive, isActivating, connect, account } = useWallet();
  const {
    ethBalance,
    smBalance,
    nativeBalance,
    deposit,
    withdraw,
    depositSM,
    withdrawSM,
    isLoading,
    updateBalances,
  } = useDepositContract();
  const { balance: smTokenBalance, approve, updateBalance: updateSmBalance } = useSMToken();
  const [amount, setAmount] = useState('');
  const [activeToken, setActiveToken] = useState<ETokens>(ETokens.ETH);

  const handleConnect = async () => {
    try {
      await toast.promise(connect(), {
        loading: '连接钱包中...',
        success: '钱包连接成功',
        error: '连接失败',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (type: ETradeType) => {
    if (!amount || isLoading) return;

    try {
      // 输入验证 - 使用 parseFloat 仅作为格式验证
      if (parseFloat(amount) <= 0) {
        toast.error('请输入有效金额');
        return;
      }

      // 使用 ethers 处理金额
      let inputAmountBN: BigNumber;
      try {
        // 假设SM代币和ETH都是18位小数
        const decimals = 18;
        inputAmountBN =
          activeToken === ETokens.ETH ? parseEther(amount) : parseUnits(amount, decimals);
      } catch (err) {
        toast.error('无效的金额格式');
        return;
      }

      // 余额验证 - 使用 BigNumber 比较
      if (type === ETradeType.WITHDRAW) {
        try {
          const balanceBN =
            activeToken === ETokens.ETH ? parseEther(ethBalance) : parseUnits(smBalance, 18);

          if (inputAmountBN.gt(balanceBN)) {
            toast.error('余额不足');
            return;
          }
        } catch (err) {
          toast.error('余额验证失败');
          return;
        }
      } else if (activeToken === ETokens.SM) {
        try {
          const smBalanceBN = parseUnits(smTokenBalance, 18);
          if (inputAmountBN.gt(smBalanceBN)) {
            toast.error('SM代币余额不足');
            return;
          }

          // SM代币授权
          await toast.promise(approve(amount), {
            loading: '授权中...',
            success: '授权成功',
            error: '授权失败',
          });
        } catch (err) {
          toast.error('SM代币余额验证失败');
          return;
        }
      }

      // 根据选择的代币和操作类型确定处理方法
      const handler =
        activeToken === ETokens.ETH
          ? type === ETradeType.DEPOSIT
            ? deposit
            : withdraw
          : type === ETradeType.DEPOSIT
            ? depositSM
            : withdrawSM;

      // 执行操作
      await toast.promise(handler(amount), {
        loading: `${type === ETradeType.DEPOSIT ? '存入' : '提取'}中...`,
        success: `${type === ETradeType.DEPOSIT ? '存入' : '提取'}成功`,
        error: err => {
          const message = err?.message || '操作失败';
          if (message.includes('user rejected')) return '用户取消交易';
          if (message.includes('insufficient funds')) return '余额不足';
          return '操作失败: ' + message;
        },
      });

      // 更新所有相关余额
      await updateBalances();
      await updateSmBalance();
      setAmount('');
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // 如果钱包未连接，显示连接页面
  if (!isActive) {
    return <ConnectWallet handleConnect={handleConnect} isActivating={isActivating} />;
  }

  const isFormActionDisabled = isLoading || !amount || amount === '0';

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 余额显示区域 */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{activeToken} 存款</h2>
          <span className="text-sm text-gray-500">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold text-[#48e59b]">
          {activeToken === ETokens.ETH ? ethBalance : smBalance} {activeToken}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          钱包余额:{' '}
          {activeToken === ETokens.ETH
            ? `${Number(nativeBalance).toFixed(4)} ETH`
            : `${smTokenBalance} SM`}
        </p>
      </div>

      <div className="space-y-4">
        {/* 代币选择器 */}
        <TokenSelector activeToken={activeToken} setActiveToken={setActiveToken} />

        {/* 金额输入框 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">金额 ({activeToken})</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={`请输入${activeToken}金额`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                     shadow-sm focus:ring-[#48e59b] focus:border-[#48e59b]"
            min="0"
            step={activeToken === ETokens.ETH ? '0.001' : '1'}
            disabled={isLoading}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4">
          <ActionButton
            onClick={() => handleSubmit(ETradeType.DEPOSIT)}
            disabled={isFormActionDisabled}
            variant="primary"
          >
            存入
          </ActionButton>
          <ActionButton
            onClick={() => handleSubmit(ETradeType.WITHDRAW)}
            disabled={isFormActionDisabled}
            variant="secondary"
          >
            提取
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
