import React, {useMemo, useRef, useEffect} from 'react';
import {IntensityMap} from './algorithm';
import chroma from 'chroma-js';

const Canvas: React.FC<({
  map: IntensityMap,
})> = ({
  map,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current
    if(canvas === null) { return; }

    const ctx = canvas.getContext('2d');
    if(ctx === null) { return; }

    ctx.clearRect(0, 0, map.width, map.height);

    const colorScale = chroma.scale('BuPu');
    const scaleTransform = 0.4; //Vary between 0 and 1 to tweak color scale
    map.scaled().forEach(
      (col, y) => col.forEach((i, x) => {
        if(i > 0) {
          ctx.fillStyle = colorScale(Math.pow(i, scaleTransform)).toString();
          ctx.fillRect(x, y, 1, 1)
        }
      })
    )
  });

  return (
    <div className="App">
       <br />
       <canvas ref={canvasRef} width={map.width} height={map.height} />
    </div>
  );
}

export default Canvas;
