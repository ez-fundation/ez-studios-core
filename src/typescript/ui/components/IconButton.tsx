import React from "react";
import { Icon } from "./Icon";

interface IconButtonProps {
  name: string; // icon name from sprite sheet
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({ name, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center
      ${active ? "bg-primary text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]" : "text-muted-foreground hover:text-white hover:bg-white/10"}`}
  >
    <Icon name={name} size={20} className={active ? "stroke-2" : "stroke-1"} />
    <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10 uppercase tracking-widest">
      {label}
    </div>
  </button>
);
