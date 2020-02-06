import React, {useMemo} from 'react';
import logo from './logo.svg';
import './App.css';
import {makePoints} from './algorithm';



const App = () => {
  const {points, width, height, minX, minY} = useMemo(makePoints, [])

  return (
    <div className="App">
      <br />
      <svg width="1200" height="1200">
        {points.map(([x, y], i) =>  <circle key={i} cx={ 50 + (x - minX)*1150/width} cy={50 + (y - minY)*1150/height} r="0.5"/>)}
      </svg>
    </div>
  );
}

export default App;
