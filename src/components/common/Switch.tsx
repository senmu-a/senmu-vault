import { Moon, Sun } from 'lucide-react';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

const Switch = ({ checked, onChange }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-all duration-200 ease-in-out focus:outline-none
        hover:scale-105 hover:ring-2 hover:ring-offset-1 cursor-pointer
        ${checked ? 'bg-gray-800 hover:ring-gray-400/50' : 'bg-gray-200 hover:ring-amber-400/50'}
      `}
    >
      <span className="sr-only">切换主题模式</span>

      {/* 滑块和图标 */}
      <span
        className={`
          inline-flex h-5 w-5 transform items-center justify-center
          rounded-full bg-white shadow-sm
          transition-all duration-200 ease-in-out
          hover:shadow-md
          ${checked ? 'translate-x-6' : 'translate-x-0.5'}
        `}
      >
        {checked ? (
          <Moon
            className="h-3 w-3 text-gray-800 transition-transform hover:scale-110"
            strokeWidth={2.5}
          />
        ) : (
          <Sun
            className="h-3 w-3 text-amber-500 transition-transform hover:scale-110"
            strokeWidth={2.5}
          />
        )}
      </span>
    </button>
  );
};

export default Switch;
