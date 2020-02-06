import React, {useMemo, useRef, useEffect} from 'react';

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

    const transformX = (x: number) => padding + (x - minX)*(width - 2*padding)/(maxX - minX)
    const transformY = (x: number) => padding + (x - minY)*(height - 2*padding)/(maxY - minY)

    points.forEach(([x, y]) => ctx.fillRect(transformX(x), transformY(y), 1, 1))
  });

  return (
    <div className="App">
       <br />
       <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

export default Canvas;
