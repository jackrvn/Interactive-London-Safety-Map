import React from 'react';
import type { Color } from '@deck.gl/core';

type ColorKeyProps = {
  colorRange: Color[];
  style?: React.CSSProperties;
};

export const ColorKey: React.FC<ColorKeyProps> = ({ colorRange, style }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "24px",
        left: "24px",
        background: "rgba(0, 0, 0, 0.8)",
        padding: "12px",
        borderRadius: "4px",
        color: "white",
        ...style,
      }}
    >
      <div style={{ marginBottom: "8px", fontSize: "12px" }}>Crime Density</div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "10px",
          }}
        >
          <span>Low</span>
          <div
            style={{
              width: "50px",
              height: "12px",
              background: `linear-gradient(to right, ${colorRange
                .map(
                  (color) =>
                    `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
                      color[3] / 255
                    })`
                )
                .join(", ")})`,
            }}
          />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};