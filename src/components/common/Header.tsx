import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Wallet, Home, Wallet2 } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '钱包', href: '/dapp', icon: Wallet2 },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
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
              <span className="ml-2 text-xl font-bold text-gray-900">
                Senmu Vault
              </span>
            </NavLink>
          </div>

          {/* 桌面端导航菜单 */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `relative inline-flex items-center text-base font-medium transition-colors duration-200
                  ${isActive 
                    ? 'text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-primary' 
                    : 'text-gray-700 hover:text-primary'
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
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg
                         bg-primary text-white hover:opacity-90
                         transition-opacity duration-200"
            >
              <Wallet className="w-5 h-5 mr-2" />
              连接钱包
            </button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2
                         rounded-md text-gray-700 hover:text-primary
                         hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium inline-flex items-center
                    ${isActive
                      ? 'text-primary bg-primary/10 border-l-4 border-primary'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </NavLink>
              ))}
              <button
                className="w-full mt-4 inline-flex items-center justify-center
                           px-4 py-2 rounded-lg bg-primary text-white
                           hover:opacity-90 transition-opacity duration-200"
              >
                <Wallet className="w-5 h-5 mr-2" />
                连接钱包
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
