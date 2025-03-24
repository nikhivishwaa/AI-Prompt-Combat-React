import React from 'react';

const RenderSvg = ({ svgName, style }) => {
  return (
    <div style={{ pointerEvents: 'none', ...style }}>
      {svgName}
    </div>
  );
};

export default RenderSvg;