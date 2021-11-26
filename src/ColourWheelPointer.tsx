// Customised pointer class for UIW colour wheel, based on
// https://github.com/uiwjs/react-color/blob/main/packages/color-wheel/src/Pointer.tsx

import React, { useMemo } from 'react';

export interface PointerProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  top?: string;
  left: string;
  color?: string;
}

export const Pointer = ({ className, color, left, top, style, prefixCls }: PointerProps): JSX.Element => {
  const styleWarp: React.CSSProperties = {
    ...style,
    position: 'absolute',
    top,
    left,
  };
  return useMemo(
    () => (
      <div className={`${prefixCls}-pointer ${className || ''}`} style={styleWarp}>
        <div
          className={`${prefixCls}-fill`}
          style={{
            width: 20,
            height: 20,
            transform: 'translate(-10px, -10px)',
            borderRadius: '50%',
            backgroundColor: '#222',
          }}
        >
          <div
            style={{
              inset: 3,
              borderRadius: '50%',
              position: 'absolute',
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    ),
    [top, left, color, className, prefixCls],
  );
};
