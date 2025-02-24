import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Wallet, Home, Wallet2, Sun, Moon } from 'lucide-react';
import { useWallet } from '@hooks/useWallet';
import Switch from './Switch';
import { WalletDropdown } from './WalletDropdown';

const Header = () => {
  const {
    isActive: active,
    isActivating,
    connect,
    disconnect,
    account,
    formatAddress,
    chainId,
  } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 初始化主题
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 处理钱包连接
  const handleWallet = async () => {
    if (active) {
      disconnect();
    } else {
      try {
        await connect();
      } catch (err) {
        console.error('Failed to connect:', err);
      }
    }
  };

  // 切换主题
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '钱包', href: '/dapp', icon: Wallet2 },
  ];

  return (
    <header className="border-b border-gray-300 dark:border-gray-600 transition-colors duration-200 ease-in">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo 区域 */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              {/* <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Logo"
              /> */}
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-200">
                Senmu Vault
              </span>
            </NavLink>
          </div>

          {/* 桌面端导航菜单 */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(item => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `relative inline-flex items-center text-base font-medium transition-colors duration-200
                  ${
                    isActive
                      ? 'text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* 右侧功能区 */}
          <div className="hidden md:flex items-center space-x-4">
            <Switch checked={isDark} onChange={toggleTheme} />
            {active ? (
              <WalletDropdown
                account={account || ''}
                disconnect={disconnect}
                formatAddress={formatAddress}
                chainId={chainId}
              />
            ) : (
              <button
                onClick={handleWallet}
                disabled={isActivating}
                className="inline-flex items-center px-4 py-2 rounded-lg
                   bg-primary text-white hover:opacity-90
                   transition-opacity duration-200 cursor-pointer
                   disabled:opacity-50"
              >
                <Wallet className="w-5 h-5 mr-2" />
                {isActivating ? '连接中...' : '连接钱包'}
              </button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2
                         rounded-md text-gray-700 dark:text-gray-50 hover:text-primary
                         hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="space-y-2">
              {navigation.map(item => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-base font-medium inline-flex items-center
                    ${
                      isActive
                        ? 'text-primary bg-primary/10 border-l-4 border-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </NavLink>
              ))}
              <div className="flex items-center justify-between mt-2">
                {active ? (
                  <WalletDropdown
                    account={account || ''}
                    disconnect={disconnect}
                    formatAddress={formatAddress}
                    chainId={chainId}
                  />
                ) : (
                  <button
                    onClick={handleWallet}
                    disabled={isActivating}
                    className="flex-1 inline-flex items-center justify-center
                  px-4 py-2 rounded-lg bg-primary text-white
                  hover:opacity-90 transition-opacity duration-200
                  disabled:opacity-50"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    {isActivating ? '连接中...' : '连接钱包'}
                  </button>
                )}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 hover:text-primary 
                              hover:bg-gray-100 dark:text-gray-400 
                              dark:hover:bg-gray-800 transition-colors"
                  aria-label="切换主题"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
