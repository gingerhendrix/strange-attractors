
export type QuadraticCoefficients = [number, number, number, number, number, number];

type TwoDMap = (x: number, y: number) => number;
type TwoDIterator = [TwoDMap, TwoDMap];
type PointArray = Array<[number, number]>

export interface Iteration {
  points: PointArray,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
}

export interface Attractor {
  iterator?: TwoDIterator,
  iteration: Iteration
}

const buildTwoDMap = (cs: QuadraticCoefficients): TwoDMap => 
  (x_n, y_n) => cs[0] + (cs[1] * x_n) + (cs[2] * x_n * x_n) + (cs[3] * x_n * y_n) + (cs[4] * y_n ) + (cs[5] * y_n * y_n);

const buildIterators: (xcs: QuadraticCoefficients, ycs: QuadraticCoefficients) => TwoDIterator = (xcs, ycs) =>  [
  buildTwoDMap(xcs), buildTwoDMap(ycs)
]

export const randomCoefficients: () => QuadraticCoefficients = () => Array(6).fill(0).map(a => (Math.round((Math.random()*24) - 12)/10)) as QuadraticCoefficients

const coeffLabel = (i: number) => String.fromCharCode(65 + 12 + Math.round(i * 10))
const labelCoeff = (s: string) => (s.charCodeAt(0) - (65 + 12))/10
export const labelToCoefficients = (s: string): [QuadraticCoefficients, QuadraticCoefficients] => [
  s.slice(0, 6).split('').map(labelCoeff) as QuadraticCoefficients,
  s.slice(6, 12).split('').map(labelCoeff) as QuadraticCoefficients,
]

export const coefficientsLabel = (xcs: QuadraticCoefficients, ycs: QuadraticCoefficients): string => [...xcs, ...ycs].map(coeffLabel).join('')

// BQVRVSECCUIM
// LTTKPFXOKOGH
// JLSCHWYPIJQN

export const initializePoints = (coefficients: [QuadraticCoefficients, QuadraticCoefficients]) => {
  // const coefficients = samples[2];
  const iterator = buildIterators(coefficients[0], coefficients[1]);

  let [x, y] = [0.05, 0.05]
  let divergent = false;

  for(let i=0; i< 5000; i++) {
    [x, y] = [iterator[0](x, y), iterator[1](x, y)]
    if(Math.abs(x) + Math.abs(y) > 100000) { //Unstable
      divergent = true;
      break;
    }
  }
  return {iterator, x, y, divergent}
}

export const makePoints = (coefficients: [QuadraticCoefficients, QuadraticCoefficients]) : Attractor => {
  const {iterator, x, y} = initializePoints(coefficients)
  const iteration = iterate({numIterations: 100000, iterator, iteration: { x, y, minX: x, maxX: x, minY: y, maxY: y}})
  return {iterator, iteration};
}

interface IterateInput {
  iterator: TwoDIterator,
  iteration: {
    x: number,
    y: number,
    maxX: number,
    maxY: number,
    minX: number,
    minY: number,
  }
  numIterations: number
}

export const iterate = ({iterator, iteration: {x, y, minX, minY, maxX, maxY}, numIterations = 10000}: IterateInput) : Iteration => {
  if(!iterator) { return  {points: [[x, y]], minX, minY, maxX, maxY} }

  const newPoints: Array<[number, number]> = [];

  for(let i=0; i< numIterations; i++) {
    [x, y] = [iterator[0](x, y), iterator[1](x, y)]
    newPoints.push([x, y]);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    if(Math.abs(x) + Math.abs(y) > 100000) { //Unstable
      break;
    }
  }
  return {points: newPoints, minX, minY, maxX, maxY};
}

interface IntensityMapInput extends Iteration {
    width: number,
    height: number,
}

export class IntensityMap {
  public map: Array<Array<number>>
  public width: number
  public height: number
  private maxIntensity: number
  private transformX: (x: number) => number
  private transformY: (y: number) => number

  constructor({width, height, minX, minY, maxX, maxY}: {width:number, height: number, minX: number, minY: number, maxX:number, maxY:number}) {
    this.width = width
    this.height = height
    this.map = Array(height).fill(0).map(() => Array(width).fill(0));
    this.maxIntensity = 1
    const xDiff = maxX - minX
    const yDiff = maxY - minY
    this.transformX = (x) => Math.floor((x - minX)*(width - 1)/xDiff)
    this.transformY = (y) => Math.floor((y - minY)*(height - 1)/yDiff)
  }

  update(points: PointArray) {
    points.forEach(([x, y]) => {
      const [ym, xm] = [this.transformY(y), this.transformX(x)]
      if (this.map[ym] === undefined || this.map[ym][xm] === undefined) {
        console.log("out of bounds", {xm, ym});
        return;
      }
      const intensity = this.map[ym][xm]++
      this.maxIntensity = Math.max(this.maxIntensity, intensity);
    })
  }

  scaled() {
    const linearScale = (i: number) => i/this.maxIntensity
    return this.map.map((row, y) => row.map(linearScale));
  }
}

