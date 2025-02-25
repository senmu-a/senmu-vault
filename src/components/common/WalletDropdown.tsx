import { useRef, useState, useEffect, memo } from 'react';
import { ChevronDown, LogOut, Loader2 } from 'lucide-react';
import { useWalletBalances } from '@hooks/useWalletBalances';
import Jazzicon from 'react-jazzicon';
import { metaMask } from '@connectors/metaMask';

interface WalletDropdownProps {
  account: string;
  disconnect: () => void;
  chainId?: number;
  formatAddress: (address: string) => string;
}

export const WalletDropdown = memo(
  ({ account, disconnect, formatAddress, chainId: _chainId }: WalletDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [switchingChainId, setSwitchingChainId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const networks = useWalletBalances();

    // 生成以太坊地址的头像
    const generateSeed = (address: string) => {
      return parseInt(address.slice(2, 10), 16);
    };

    // 处理链切换
    const handleSwitchChain = async (chainId: number) => {
      if (chainId === _chainId) return;

      try {
        setSwitchingChainId(chainId);
        await metaMask.activate(chainId);
        setIsOpen(false);
      } catch (err) {
        console.error('Failed to switch chain:', err);
      } finally {
        setSwitchingChainId(null);
      }
    };

    // 获取首字母
    const getInitials = (name: string) => {
      return name.charAt(0).toUpperCase();
    };

    // 点击外部关闭下拉菜单
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-4 py-2 rounded-lg
                   bg-primary text-white hover:opacity-90
                   transition-opacity duration-200 cursor-pointer"
        >
          <Jazzicon diameter={24} seed={generateSeed(account!)} />
          <span className="mx-2">{formatAddress(account!)}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg py-2">
            {/* 钱包信息头部 */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Jazzicon diameter={40} seed={generateSeed(account!)} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatAddress(account!)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">已连接</p>
                </div>
              </div>
            </div>

            {/* 网络列表 */}
            <div className="px-2 py-2">
              {networks.map(network => (
                <button
                  key={network.chainId}
                  onClick={() => handleSwitchChain(network.chainId)}
                  disabled={switchingChainId !== null}
                  className={`w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                      rounded-md transition-colors duration-200 cursor-pointer
                      disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {network.icon ? (
                        <img
                          src={network.icon}
                          alt={network.name}
                          className="w-6 h-6 rounded-full"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium 
                            ${network.icon ? 'hidden' : ''} 
                            ${network.chainId === _chainId ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {getInitials(network.name)}
                      </div>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {network.name}
                      </span>
                    </div>
                    {network.chainId === _chainId ? (
                      <span className="text-xs text-primary">当前网络</span>
                    ) : switchingChainId === network.chainId ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>

            {/* 断开连接按钮 */}
            <div className="px-2 pt-2 pb-1 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={disconnect}
                className="w-full px-3 py-2 text-sm text-left text-red-600 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md
                       transition-colors duration-200 flex items-center cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                断开连接
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);
