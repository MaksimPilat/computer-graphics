import { Point } from '../types';

export class LineBuilder {
  static buildDDALine(start: Point, end: Point) {
    const points: Point[] = [];

    let currentX = start.x;
    let currentY = start.y;

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    for (let i = 0; i <= steps; i++) {
      points.push({ x: Math.round(currentX), y: Math.round(currentY) });
      currentX += xIncrement;
      currentY += yIncrement;
    }

    return points;
  }

  static buildBresenhamLine(start: Point, end: Point) {
    const points: Point[] = [];

    let dx = Math.abs(end.x - start.x);
    let dy = Math.abs(end.y - start.y);
    let sx = start.x < end.x ? 1 : -1;
    let sy = start.y < end.y ? 1 : -1;
    let err = dx - dy;

    while (start.x !== end.x || start.y !== end.y) {
      points.push({ x: start.x, y: start.y });
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        start.x += sx;
      }
      if (e2 < dx) {
        err += dx;
        start.y += sy;
      }
    }
    points.push({ x: start.x, y: start.y });

    return points;
  }

  static buildWuLine(start: Point, end: Point) {
    const fpart = (x: number) => x - Math.floor(x);

    const points = [];

    if (end.x < start.x) {
      [start.x, end.x] = [end.x, start.x];
      [start.y, end.y] = [end.y, start.y];
    }

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const gradient = dy / dx;

    let xend = Math.round(start.x);
    let yend = start.y + gradient * (xend - start.x);
    let xgap = 1 - fpart(start.x + 0.5);
    let xpxl1 = xend;
    let ypxl1 = Math.floor(yend);
    points.push({ x: xpxl1, y: ypxl1, intensity: 1 - fpart(yend) * xgap });
    points.push({ x: xpxl1, y: ypxl1 + 1, intensity: fpart(yend) * xgap });
    let intery = yend + gradient;

    xend = Math.round(end.x);
    yend = end.y + gradient * (xend - end.x);
    xgap = fpart(end.x + 0.5);
    let xpxl2 = xend;
    let ypxl2 = Math.floor(yend);
    points.push({ x: xpxl2, y: ypxl2, intensity: 1 - fpart(yend) * xgap });
    points.push({ x: xpxl2, y: ypxl2 + 1, intensity: fpart(yend) * xgap });

    for (let x = xpxl1 + 1; x < xpxl2; x++) {
      points.push({
        x: x,
        y: Math.floor(intery),
        intensity: 1 - fpart(intery),
      });
      points.push({
        x: x,
        y: Math.floor(intery) + 1,
        intensity: fpart(intery),
      });
      intery += gradient;
    }

    return points;
  }

  static buildChain(point: Point[]) {
    const chain: Point[] = [];

    for (let i = 0; i < point.length - 1; i++) {
      const line = LineBuilder.buildDDALine(point[i], point[i + 1]);
      line.pop();
      chain.push(...line);
    }

    return chain;
  }
}
