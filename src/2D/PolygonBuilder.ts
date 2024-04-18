import { LineBuilder } from './LineBuilder';
import { Orientation, Point } from '../types';
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

  static scanLinesFill(polygon: Point[]) {
    console.log('sscanLinesFill');

    return polygon;
  }

  static scanLinesWithActiveEdgesFill(polygon: Point[]) {
    console.log('scanLinesAndActiveEdgesFill');

    return polygon;
  }

  static floodFill(polygon: Point[]) {
    console.log('floodFill');

    return polygon;
  }

  static scanLinesFloodFill(polygon: Point[]) {
    console.log('scanLinesFloodFill');

    return polygon;
  }
}
