import { LineBuilder } from './LineBuilder';
import { Edge, Orientation, Point } from '../types';
import { findLeftmost, orientation } from './helpers';

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
        if (
          next === current ||
          orientation(current, point, next) === Orientation.COUNTER_CLOCKWISE
        ) {
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
        if (
          orientation(points[p], points[i], points[q]) ===
          Orientation.COUNTER_CLOCKWISE
        ) {
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

  static fillPolygon(polygon: Point[]) {
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
          slopeInverse:
            (startPoint.x - endPoint.x) / (startPoint.y - endPoint.y),
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
}
