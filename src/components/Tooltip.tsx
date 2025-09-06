import React, { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-3 py-1 shadow-lg z-50 whitespace-nowrap">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 mt-[-2px]"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
