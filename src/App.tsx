import React, {useState, useEffect} from 'react';
import {
  makePoints, 
  coefficientsLabel, 
  labelToCoefficients,
  randomCoefficients,
  Attractor, 
  QuadraticCoefficients
} from './algorithm';
import Canvas from './Canvas';
import IntensityCanvas from './IntensityCanvas';

const App = () => {
  const [coefficients, setCoefficients] = 
    useState<[QuadraticCoefficients, QuadraticCoefficients]>([[0,0,0,0,0,0], [0,0,0,0,0,0]]);
  const [coefficientInput, setCoefficientInput] = 
    useState<string>(coefficientsLabel(coefficients[0], coefficients[1]))

  const [{points, maxX, maxY, minX, minY}, setLocus] = useState<Attractor>({
    points: [],
    maxX: 1,
    maxY: 1,
    minX: 1,
    minY: 1,
  })
  useEffect(() => setLocus(makePoints(coefficients)), [coefficients])
  const onRefresh = () => {
    const newCoefficients = [randomCoefficients(), randomCoefficients()];
    setCoefficients([newCoefficients[0], newCoefficients[1]])
    setCoefficientInput(coefficientsLabel(newCoefficients[0], newCoefficients[1]))
  }
  return (
      <div>
        <div>
        <button onClick={onRefresh}>Refresh</button>
        <input
          value={coefficientInput}
          onChange={(e) => setCoefficientInput(e.target.value)}
          onBlur={() => setCoefficients(labelToCoefficients(coefficientInput))}
        />
        </div>
        <IntensityCanvas points={points} maxX={maxX} maxY={maxY} minX={minX} minY={minY}/>
      </div>
      );
  }

export default App;
