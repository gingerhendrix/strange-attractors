import { TwoDIterator, PointArray } from "./types";

class StrangeAttractor {
  private iterator: TwoDIterator;
  public minX: number;
  public minY: number;
  public maxX: number;
  public maxY: number;
  public x: number;
  public y: number;
  public lyapunov?: number;
  public divergent: boolean = false;

  constructor(iterator: TwoDIterator, x: number = 0.05, y: number = 0.05) {
    this.iterator = iterator;
    this.x = this.minX = this.maxX = x;
    this.y = this.minY = this.maxY = y;
  }

  public initialize() {
    this.iterate(5000);
    if (this.divergent) {
      return;
    }
    this.maxX = this.minX = this.x;
    this.maxY = this.minY = this.y;
  }

  public iterate(numIterations: number = 100000): PointArray {
    const newPoints: PointArray = [];
    let lSum = 0;

    for (let i = 0; i < numIterations; i++) {
      const [newX, newY] = [
        this.iterator[0](this.x, this.y),
        this.iterator[1](this.x, this.y),
      ];

      const xDiff = newX - this.x;
      const yDiff = newY - this.y;
      const dl2 = (xDiff*xDiff) + (yDiff*yDiff);
      if(dl2 > 0) {
        lSum += Math.log(dl2);
      }

      this.x = newX;
      this.y = newY;
      newPoints.push([this.x, this.y]);

      this.minX = Math.min(this.minX, this.x);
      this.minY = Math.min(this.minY, this.y);
      this.maxX = Math.max(this.maxX, this.x);
      this.maxY = Math.max(this.maxY, this.y);

      if (Math.abs(this.x) + Math.abs(this.y) > 100000) {
        //Unstable
        this.divergent = true;
        break;
      }
    }
    this.lyapunov = 0.721347 * lSum/newPoints.length;
    console.log("Lyapunov", this.lyapunov, this.divergent);

    return newPoints;
  }
}

export default StrangeAttractor;
