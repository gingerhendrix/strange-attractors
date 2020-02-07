import React, {useMemo, useRef, useEffect} from 'react';
import {intensityMap} from './algorithm';
import chroma from 'chroma-js';

const Canvas: React.FC<({
  width?: number,
  height?: number,
  padding?: number,
  points: Array<[number, number]>,
  maxX: number,
  maxY: number,
  minX: number,
  minY: number
})> = ({
  width = 1800,
  height = 1200,
  padding = 50,
  points,
  maxX,
  maxY,
  minX,
  minY
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current
    if(canvas === null) { return; }

    const ctx = canvas.getContext('2d');
    if(ctx === null) { return; }

    ctx.clearRect(0, 0, width, height);

    const map = intensityMap({width, height, points, maxX, maxY, minX, minY});

    const colorScale = chroma.scale('YlGnBu');
    const scaleTransform = 0.4; //Vary between 0 and 1 to tweak color scale
    map.forEach(
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
