import React, {useMemo, useRef, useEffect} from 'react';
import chroma from 'chroma-js';

const Canvas: React.FC<({
  intensities: number[][],
  width: number,
  height: number,
})> = ({
  intensities,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current
    if(canvas === null) { return; }

    const ctx = canvas.getContext('2d');
    if(ctx === null) { return; }

    ctx.clearRect(0, 0, width, height);

    const colorScale = chroma.scale('BuPu');
    const scaleTransform = 0.4; //Vary between 0 and 1 to tweak color scale
    intensities.forEach(
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
       <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

export default Canvas;
