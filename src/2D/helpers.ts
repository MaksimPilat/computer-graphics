import { Orientation, Point } from '../types';

export function orientation(prev: Point, curr: Point, next: Point) {
  const value =
    (curr.y - prev.y) * (next.x - curr.x) -
    (curr.x - prev.x) * (next.y - curr.y);
  if (value === 0) return Orientation.COLLINEAR;
  return value > 0 ? Orientation.CLOCKWISE : Orientation.COUNTER_CLOCKWISE;
}

export function findLeftmost(points: Point[]) {
  let leftmost = points[0];

  for (const point of points) {
    if (point.x < leftmost.x) {
      leftmost = point;
    }
  }

  return leftmost;
}
