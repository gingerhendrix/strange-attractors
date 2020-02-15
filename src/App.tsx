import React, {useState, useEffect, useRef} from 'react';
import StrangeAttractor from './algorithms/StrangeAttractor';
import IntensityMap from './algorithms/IntensityMap';
import {
  iteratorFromLabel, 
  randomCoefficients, 
  coefficientsLabel
} from './algorithms/quadraticIterator';
import IntensityCanvas from './IntensityCanvas';

const App = () => {
  const attractorRef = useRef<StrangeAttractor | null>(null);
  const intensityMapRef = useRef<IntensityMap | null>(null);

  const [coefficientInput, setCoefficientInput] = useState<string>("LTTKPFXOKOGH")
  const [coefficient, setCoefficient] = useState<string>(coefficientInput)

  const [iterationFactor, setIterationFactor] = useState<number>(15)
  const [intensities, setIntensities] = useState<number[][]>([])

  const width = 1200;
  const height = 1200;


  const newIterator = () => {
    const iterator = iteratorFromLabel(coefficientInput);
    const attractor = new StrangeAttractor(iterator);
    attractorRef.current = attractor;
    attractor.initialize();

    if(attractor.divergent) {
      intensityMapRef.current = null;
      setIntensities([]);
      return;
    }

    const points = attractor.iterate()
    const {maxX, maxY, minX, minY} = attractor;

    const intensityMap = new IntensityMap({width, height, maxX, maxY, minX, minY})
    intensityMapRef.current = intensityMap;
    intensityMap.update(points);
    setIntensities(intensityMap.scaled());
  }

  useEffect(newIterator, [coefficient]);

  const onRandom = () => {
    const newCoefficients = [randomCoefficients(), randomCoefficients()]
    const label = coefficientsLabel(newCoefficients[0], newCoefficients[1])
    setCoefficientInput(label);
    setCoefficient(label);
  }

  const onNewCoefficient = () => {
    setCoefficient(coefficientInput);
  }

  const onMorePoints = () => {
    if(!attractorRef.current || !intensityMapRef.current) { return } 

    intensityMapRef.current.update(attractorRef.current.iterate());
    setIntensities(intensityMapRef.current.scaled());
  }

  return (
      <div>
        <div>
        <button onClick={onRandom}>Random</button>
        <input
          value={coefficientInput}
          onChange={(e) => setCoefficientInput(e.target.value)}
          onBlur={() => onNewCoefficient()}
        />

        <button onClick={onMorePoints}>+</button>
        </div>
        <div style={{padding: 50}}>
         {intensities && <IntensityCanvas intensities={intensities} width={width} height={height} />}
        </div>
      </div>
      );
  }

export default App;
