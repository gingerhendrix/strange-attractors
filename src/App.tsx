import React, {useState, useEffect} from 'react';
import {makePoints, Locus} from './algorithm';
import Canvas from './Canvas';

const App = () => {
  const [{points, maxX, maxY, minX, minY}, setLocus] = useState<Locus>({
    points: [],
    maxX: 1,
    maxY: 1,
    minX: 1,
    minY: 1,
  })
  useEffect(() => setLocus(makePoints()), [])
  const onRefresh = () => setLocus(makePoints())
  return (
      <div >
      <div>
      <button onClick={onRefresh}>Refresh</button>
      </div>
      <Canvas points={points} maxX={maxX} maxY={maxY} minX={minX} minY={minY}/>
      </div>
      );
  }

export default App;
