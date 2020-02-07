import React, {useMemo, useRef, useEffect} from 'react';
import {intensityMap} from './algorithm';

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

    map.forEach(
      (col, y) => col.forEach((i, x) => {
        if(i > 0) {
          const color = `rgba(${255 - i}, ${255 - i}, ${255 - i}, 1)`;
          ctx.fillStyle =  color
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
