
export type QuadraticCoefficients = [number, number, number, number, number, number];

type TwoDMap = (x: number, y: number) => number;
type TwoDIterator = [TwoDMap, TwoDMap];

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

export const makePoints = (coefficients: [QuadraticCoefficients, QuadraticCoefficients]) => {
  // const coefficients = samples[2];
  const iterator = buildIterators(coefficients[0], coefficients[1]);

  let [x, y] = [0.05, 0.05]

  console.log({coefficients});
  for(let i=0; i< 5000; i++) {
    [x, y] = [iterator[0](x, y), iterator[1](x, y)]
    if(Math.abs(x) + Math.abs(y) > 100000) { //Unstable
      break;
    }
  }
  let points: [number, number][] = [];
  let minX = x;
  let minY = y;
  let maxX = x;
  let maxY = y;

  for(let i=0; i< 100000; i++) {
    [x, y] = [iterator[0](x, y), iterator[1](x, y)]
    points.push([x, y]);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    if(Math.abs(x) + Math.abs(y) > 100000) { //Unstable
      break;
    }
  }
  return {points, minX, minY, maxX, maxY};
}

export type Attractor = ReturnType<typeof makePoints>;
interface IntensityMapInput extends Attractor {
    width: number,
    height: number,
}


export const intensityMap: (input: IntensityMapInput) => Array<Array<number>> = ({points, width, height, minX, minY, maxX, maxY}) => {
  let maxIntensity = 1;

  const map = Array(height).fill(0).map(() => Array(width).fill(0));
  if(maxX === minX || maxY === minY) {
    return map;
  }
  const xDiff = maxX - minX
  const yDiff = maxY - minY
  const transformX = (x: number) => Math.floor((x - minX)*(width - 1)/xDiff)
  const transformY = (x: number) => Math.floor((x - minY)*(height - 1)/yDiff)

  points.forEach(([x, y]) => {
    const [ym, xm] = [transformY(y), transformX(x)]
    const intensity = map[ym][xm]++
    maxIntensity = Math.max(maxIntensity, intensity);
  });

  const linearScale = (i: number) => Math.round(i * 255/maxIntensity)
  const logScale = (i: number) => Math.round(Math.log(i) * 255/Math.log(maxIntensity))
  const squareRootScale = (i: number) => Math.round(Math.sqrt(i) * 255/(Math.sqrt(maxIntensity)))

  const scaledMap = map.map((row, y) => row.map(squareRootScale));

  return scaledMap;
}


