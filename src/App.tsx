import React, {useMemo, useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {makePoints} from './algorithm';

const App = ({width = 1200, height = 1200, padding = 50}) => {
  const {points, maxX, maxY, minX, minY} = useMemo(makePoints, [])

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current
    if(canvas === null) { return; }

    const ctx = canvas.getContext('2d');
    if(ctx === null) { return; }

    ctx.clearRect(0, 0, 1200, 1200);

    const transformX = (x: number) => padding + (x - minX)*width/(maxX - minX)
    const transformY = (x: number) => padding + (x - minY)*height/(maxY - minY)

    points.forEach(([x, y]) => ctx.fillRect(transformX(x), transformY(y), 1, 1))
  });

  return (
    <div className="App">
       <br />
       <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

export default App;
