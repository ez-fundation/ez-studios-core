import React from "react";

interface IconProps {
  /**
   * Name of the icon as defined in the UI sprite sheet.
   * Example values: "brain", "grid", "speed", "settings".
   */
  name: string;
  /** Size in pixels (width & height). Defaults to 24. */
  size?: number;
  /** Additional Tailwind or custom classes. */
  className?: string;
}

// Mapping of icon names to background-position values.
// Adjust the offsets according to the actual sprite sheet layout.
const ICON_POSITIONS: Record<string, string> = {
  brain: "0px 0px",
  grid: "-24px 0px",
  speed: "-48px 0px",
  settings: "-72px 0px",
  // Add more icons as needed.
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const position = ICON_POSITIONS[name] ?? ICON_POSITIONS["brain"];
  const style: React.CSSProperties = {
    width: size,
    height: size,
    backgroundImage: "url('/assets/ez_studios_ui_sheet_1768485695495.png')",
    backgroundPosition: position,
    backgroundRepeat: "no-repeat",
    // The sprite sheet is designed for 24px icons; adjust if your sheet differs.
    backgroundSize: "auto",
  };

  return <div className={className} style={style} aria-label={name} />;
};
