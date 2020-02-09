import React, {useState, useEffect} from 'react';
import {
  makePoints,
  coefficientsLabel,
  labelToCoefficients,
  randomCoefficients,
  Attractor,
  QuadraticCoefficients,
  iterate,
  IntensityMap,
} from './algorithm';
import Canvas from './Canvas';
import IntensityCanvas from './IntensityCanvas';

const App = () => {
  const [coefficients, setCoefficients] =
    useState<[QuadraticCoefficients, QuadraticCoefficients]>(labelToCoefficients("LTTKPFXOKOGH"))
  const [coefficientInput, setCoefficientInput] =
    useState<string>(coefficientsLabel(coefficients[0], coefficients[1]))

  const [iterationFactor, setIterationFactor] = useState<number>(15)

  const width = 1200;
  const height = 1200;

  const [intensityMap, setIntensityMap] = useState<IntensityMap | null>(null);

  const [{iterator, iteration}, setLocus] = useState<Attractor>({
    iteration: {
      points: [],
      maxX: 1,
      maxY: 1,
      minX: 1,
      minY: 1,
    }
  })

  useEffect(
    () => {
        const attractor = makePoints(coefficients)
        const {iteration: {points, maxX, maxY, minX, minY}} = attractor
        const newIntensityMap = new IntensityMap({width, height, maxX, maxY, minX, minY})
        newIntensityMap.update(points)
        setIntensityMap(newIntensityMap)
        setLocus(attractor)
    }, 
    [coefficients]
  )

  const onRefresh = () => {
    const newCoefficients = [randomCoefficients(), randomCoefficients()];
    setCoefficients([newCoefficients[0], newCoefficients[1]])
    const label = coefficientsLabel(newCoefficients[0], newCoefficients[1])
    console.log(label)
    setCoefficientInput(label)
    setIterationFactor(15)
  }

  const onMorePoints = () => {
    if(!iterator || !intensityMap) { return }

    const [x, y] = iteration.points[iteration.points.length - 1]
    const new_iteration = iterate({
      numIterations: Math.pow(2, iterationFactor), 
      iterator,
      iteration: {...iteration, x, y }
    })

    setIterationFactor(iterationFactor + 1)
    intensityMap.update(new_iteration.points)
    setIntensityMap(intensityMap)
  }

  /* const {points, maxX, maxY, minX, minY} = iteration; */
  /* console.log("Points", points.length); */
  return (
      <div>
        <div>
        <button onClick={onRefresh}>Refresh</button>
        <input
          value={coefficientInput}
          onChange={(e) => setCoefficientInput(e.target.value)}
          onBlur={() => setCoefficients(labelToCoefficients(coefficientInput))}
        />

        <button onClick={onMorePoints}>+</button>
        </div>
        <div style={{padding: 50}}>
         {intensityMap && <IntensityCanvas map={intensityMap} />}
        </div>
      </div>
      );
  }

export default App;
