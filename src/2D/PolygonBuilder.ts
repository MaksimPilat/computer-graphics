import { LineBuilder } from "./LineBuilder";
import { Edge, Orientation, Point, Triangle } from "../types";
import { findLeftmost, orientation } from "./helpers";

export class PolygonBuilder {
  static buildGrahamPolygon(points: Point[]) {
    if (points.length < 3) return points;

    const keyPoints: Point[] = [];

    let leftmost = findLeftmost(points);
    let current = leftmost;

    do {
      keyPoints.push(current);
      let next = points[0];

      for (const point of points) {
        if (next === current || orientation(current, point, next) === Orientation.COUNTER_CLOCKWISE) {
          next = point;
        }
      }

      current = next;
    } while (current !== leftmost);

    keyPoints.push(keyPoints[0]);

    const polygon = LineBuilder.buildChain(keyPoints);

    return polygon;
  }

  static buildJarvisPolygon(points: Point[]) {
    if (points.length < 3) return [];

    let leftmost = findLeftmost(points);

    let p = points.indexOf(leftmost);
    const keyPoints: Point[] = [];

    keyPoints.push(leftmost);

    let q;

    do {
      q = (p + 1) % points.length;

      for (let i = 0; i < points.length; i++) {
        if (orientation(points[p], points[i], points[q]) === Orientation.COUNTER_CLOCKWISE) {
          q = i;
        }
      }

      p = q;

      keyPoints.push(points[p]);
    } while (p !== points.indexOf(leftmost));

    keyPoints[keyPoints.length - 1] = keyPoints[0];

    const polygon = LineBuilder.buildChain(keyPoints);

    return polygon;
  }

  static isInsidePolygon = (x: number, y: number, polygon: Point[]) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  };

  static scanLinesFill(polygon: Point[]) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of polygon) {
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }

    const edges: Edge[] = [];

    for (let i = 0; i < polygon.length; i++) {
      const startPoint = polygon[i];
      const endPoint = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];
      if (startPoint.y !== endPoint.y) {
        const edge: Edge = {
          startY: Math.min(startPoint.y, endPoint.y),
          endY: Math.max(startPoint.y, endPoint.y),
          xAtMinY: startPoint.y < endPoint.y ? startPoint.x : endPoint.x,
          slopeInverse: (startPoint.x - endPoint.x) / (startPoint.y - endPoint.y),
        };
        edges.push(edge);
      }
    }

    const filledPolygon: Point[] = [];

    for (let y = minY; y <= maxY; y++) {
      const intersections: number[] = [];
      for (const edge of edges) {
        if (y >= edge.startY && y < edge.endY) {
          const x = edge.xAtMinY + edge.slopeInverse * (y - edge.startY);
          intersections.push(x);
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i < intersections.length; i += 2) {
        const startX = Math.ceil(intersections[i]);
        const endX = Math.floor(intersections[i + 1]);
        for (let x = startX; x <= endX; x++) {
          filledPolygon.push({ x, y });
        }
      }
    }

    return filledPolygon;
  }

  static scanLinesWithActiveEdgesFill(polygon: Point[]): Point[] {
    if (!polygon || polygon.length === 0) {
      return [];
    }

    const filledPixels: Point[] = [];

    const minY = Math.min(...polygon.map((point) => point.y));
    const maxY = Math.max(...polygon.map((point) => point.y));

    const scanlineX: number[] = new Array(maxY - minY + 1).fill(Number.MAX_SAFE_INTEGER);
    const numVertices = polygon.length;

    const filledPolygon = this.scanLinesFill(polygon);

    for (let y = minY; y <= maxY; y++) {
      for (let i = 0, j = numVertices - 1; i < numVertices; j = i++) {
        const vi = polygon[i];
        const vj = polygon[j];
        if (vi.y > y !== vj.y > y && (y - vi.y) * (vj.x - vi.x) > (vi.y - vj.y) * (vi.x - y)) {
          scanlineX[y - minY] = Math.min(
            scanlineX[y - minY],
            Math.floor(vi.x + ((y - vi.y) / (vj.y - vi.y)) * (vj.x - vi.x))
          );
        }
      }

      for (let x = scanlineX[y - minY]; x < polygon.length; x++) {
        filledPixels.push({ x, y });
      }
    }

    return filledPolygon;
  }

  static isPointInsidePolygon(x: number, y: number, polygon: Point[]): boolean {
    const numVertices = polygon.length;
    let intersections = 0;

    for (let i = 0; i < numVertices; i++) {
      const { x: x1, y: y1 } = polygon[i];
      const { x: x2, y: y2 } = polygon[(i + 1) % numVertices];

      if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) {
        if (x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
          intersections++;
        }
      }
    }

    return intersections % 2 !== 0;
  }

  static isPointInsideAnyPolygon(x: number, y: number, polygons: Point[][]): boolean {
    for (const polygon of polygons) {
      if (this.isPointInsidePolygon(x, y, polygon)) {
        return true;
      }
    }
    return false;
  }

  static floodFill(polygon: Point[]) {
    const filledPolygon: Point[] = [];
    const stack: [number, number][] = [];

    polygon.forEach((point) => {
      stack.push([point.x, point.y]);
    });

    const paintedPixels: Set<string> = new Set();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      if (!paintedPixels.has(key) && this.isPointInsideAnyPolygon(x, y, [polygon])) {
        filledPolygon.push({ x, y });
        paintedPixels.add(key);
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    return filledPolygon;
  }

  static scanLinesFloodFill(polygon: Point[]) {
    const filledPixels: Point[] = [];
    const stack: [number, number][] = [];

    polygon.forEach((point) => {
      const xCenter = Math.floor(point.x / 10) * 10 + 5;
      const yCenter = Math.floor(point.y / 10) * 10 + 5;
      stack.push([xCenter, yCenter]);
    });

    const paintedPixels: Set<string> = new Set();

    const filledPolygon = this.scanLinesFill(polygon);

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      if (!paintedPixels.has(key)) {
        let left = x;
        let right = x;

        while (left > 0 && !paintedPixels.has(`${left - 10},${y}`)) {
          left -= 10;
        }

        while (right < 790 && !paintedPixels.has(`${right + 10},${y}`)) {
          right += 10;
        }

        let i = left;
        while (i <= right) {
          filledPixels.push({ x: i, y });
          paintedPixels.add(`${i},${y}`);
          if (y > 0 && !paintedPixels.has(`${i},${y - 10}`)) {
            stack.push([i, y - 10]);
          }
          if (y < 590 && !paintedPixels.has(`${i},${y + 10}`)) {
            stack.push([i, y + 10]);
          }
          i += 10;
        }
      }
    }

    return filledPolygon;
  }

  static buildDelaunayTriangulation(points: Point[]) {
    return points;
  }
}
