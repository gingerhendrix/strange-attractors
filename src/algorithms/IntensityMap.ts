import { PointArray } from "./types";

class IntensityMap {
  public map: Array<Array<number>>;
  public width: number;
  public height: number;
  public pointsApplied: number;
  private maxIntensity: number;
  private transformX: (x: number) => number;
  private transformY: (y: number) => number;

  constructor({
    width,
    height,
    minX,
    minY,
    maxX,
    maxY,
  }: {
    width: number;
    height: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }) {
    this.width = width;
    this.height = height;
    this.map = Array(height)
      .fill(0)
      .map(() => Array(width).fill(0));
    this.maxIntensity = 1;
    const xDiff = maxX - minX;
    const yDiff = maxY - minY;
    this.transformX = x => Math.floor(((x - minX) * (width - 1)) / xDiff);
    this.transformY = y => Math.floor(((y - minY) * (height - 1)) / yDiff);
    this.pointsApplied = 0;
  }

  update(points: PointArray) {
    points.forEach(([x, y]) => {
      const [ym, xm] = [this.transformY(y), this.transformX(x)];
      if (this.map[ym] === undefined || this.map[ym][xm] === undefined) {
        // console.log("out of bounds", { xm, ym });
        return;
      }
      const intensity = this.map[ym][xm]++;
      this.maxIntensity = Math.max(this.maxIntensity, intensity);
    });
    this.pointsApplied += points.length;
  }

  scaled() {
    const linearScale = (i: number) => i / this.maxIntensity;
    return this.map.map((row, y) => row.map(linearScale));
  }
}

export default IntensityMap;
