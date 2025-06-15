import React from 'react';
import type { Color } from '@deck.gl/core';

type ColorKeyProps = {
  colorRange: Color[];
  style?: React.CSSProperties;
};

export const ColorKey: React.FC<ColorKeyProps> = ({ colorRange, style }) => {
  const gradientStyle = {
    background: `linear-gradient(to right, ${colorRange
      .map(
        (color) =>
          `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`
      )
      .join(", ")})`
  };

  return (
    <div className="color-key" style={style}>
      <div className="color-key__title">Crime Density</div>
      <div className="color-key__container">
        <div className="color-key__scale">
          <span>Low</span>
          <div className="color-key__gradient" style={gradientStyle} />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};