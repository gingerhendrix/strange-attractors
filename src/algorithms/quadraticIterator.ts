import {TwoDMap, TwoDIterator, QuadraticCoefficients} from './types';

const buildTwoDMap = (cs: QuadraticCoefficients): TwoDMap =>
  (x_n, y_n) => cs[0] + (cs[1] * x_n) + (cs[2] * x_n * x_n) + (cs[3] * x_n * y_n) + (cs[4] * y_n ) + (cs[5] * y_n * y_n);

export const buildIterators: (xcs: QuadraticCoefficients, ycs: QuadraticCoefficients) => TwoDIterator = (xcs, ycs) =>  [
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

export const randomIterator = () : {label: String, iterator: TwoDIterator} => {
  const cs = [randomCoefficients(), randomCoefficients()];
  const label = coefficientsLabel(cs[0], cs[1]);
  const iterator = buildIterators(cs[0], cs[1]);
  return {label, iterator};
}

export const iteratorFromLabel = (label: string) => {
  const cs = labelToCoefficients(label);
  return buildIterators(cs[0], cs[1]);
}

