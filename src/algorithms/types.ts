export type PointArray = Array<[number, number]>

export type QuadraticCoefficients = [number, number, number, number, number, number];

export type TwoDMap = (x: number, y: number) => number;
export type TwoDIterator = [TwoDMap, TwoDMap];

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

