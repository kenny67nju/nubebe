
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light', withText = true }) => {
  const textColor = variant === 'light' ? 'white' : '#0f172a';
  const brandGreen = '#10b981'; // 品牌绿
  
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* NUBEBE "NT" 箭头矢量图标 */}
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* N 的左侧垂直线 */}
        <rect x="15" y="40" width="6" height="45" fill={brandGreen} />
        {/* N 的斜线 */}
        <path d="M21 40L60 85H52L15 42V40H21Z" fill={brandGreen} />
        {/* T 的顶部横杠 (分两段) */}
        <rect x="15" y="32" width="28" height="6" fill={brandGreen} />
        <rect x="58" y="32" width="27" height="6" fill={brandGreen} />
        {/* T 的主体：向上箭头 */}
        <path d="M52 35V85H60V35H52Z" fill={brandGreen} />
        <path d="M56 12L78 45H68L56 27L44 45H34L56 12Z" fill={brandGreen} />
      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center leading-none">
          <span 
            className="text-2xl font-black tracking-tight uppercase"
            style={{ color: textColor, fontFamily: "'Inter', sans-serif" }}
          >
            NUBEBE
          </span>
          <span 
            className="text-2xl font-bold mt-1 tracking-wider"
            style={{ color: textColor, fontFamily: "'Noto Sans SC', sans-serif" }}
          >
            牛倍贝
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
