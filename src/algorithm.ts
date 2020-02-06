
type QuadraticCoefficients = [number, number, number, number, number, number];

type TwoDMap = (x: number, y: number) => number;
type TwoDIterator = [TwoDMap, TwoDMap];


const buildTwoDMap = (cs: QuadraticCoefficients): TwoDMap => 
  (x_n, y_n) => cs[0] + (cs[1] * x_n) + (cs[2] * y_n) + (cs[3] * x_n * y_n) + (cs[4] * x_n * x_n) + (cs[5] * y_n * y_n);

const buildIterators: (xcs: QuadraticCoefficients, ycs: QuadraticCoefficients) => TwoDIterator = (xcs, ycs) =>  [
  buildTwoDMap(xcs), buildTwoDMap(ycs)
]

export const randomCoefficients: () => QuadraticCoefficients = () => Array(6).fill(0).map(a => -1.2 + Math.random()*2.4) as QuadraticCoefficients

export const samples: [QuadraticCoefficients, QuadraticCoefficients][] = [
  [
    [-0.34411135288876404,0.4650718735597541,-0.8577699262806004,0.8369969267751152,0.45798691784515233,1.1671581989730349],
    [-0.33026559906790054,1.066746230555825,-0.6839144892990413,0.6155070387414572,0.9777706491303839,-0.13790635691717146]
  ],
  [
    [1.1706493744193198, -0.1258859561509582, -0.18331464278017195, 0.5832886586063841, -0.9591900453921637, 0.2990876829223237],
    [0.5868937173756177, -0.33134379629190547, -0.12017510409301702, -0.7009657560997734, -0.16976961947255664, -0.6024735249002985]
  ],
  [
    [-0.08344127857548012, -0.9283808040150625, 0.7872527272620751, 0.5723752342773634, -0.2692062224425028, -1.180317060246151],
    [-0.31274950510217925, -1.0579569835847027, 0.7343669770067514, 0.6030120862248576, 0.8351903457941086, 0.9349762860646498] 
  ],
]
export const makePoints = () => {
  const coefficients = [randomCoefficients(), randomCoefficients()]
  // const coefficients = samples[2];
  const iterator = buildIterators(coefficients[0], coefficients[1]);

  let [x, y] = [0.05, 0.05]

  console.log({coefficients});
  for(let i=0; i< 100; i++) {
    [x, y] = [iterator[0](x, y), iterator[1](x, y)]
    console.log({x, y});
    if(Math.abs(x) + Math.abs(y) > 100000) { //Unstable
      break;
    }
  }
  let points: [number, number][] = [];
  let minX = 99999999999;
  let minY = 99999999999;
  let maxX = -minY;
  let maxY = -minY;

  for(let i=0; i< 100000; i++) {
    [x, y] = [iterator[0](x, y), iterator[1](x, y)]
    points.push([x, y]);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, x);
    if(Math.abs(x) + Math.abs(y) > 100000) { //Unstable
      break;
    }
  }
  return {points, minX, minY, maxX, maxY};
}


export type Locus = ReturnType<typeof makePoints>;
