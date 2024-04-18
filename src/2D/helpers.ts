import { Orientation, Point } from '../types';

export function orientation(p: Point, q: Point, r: Point) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return Orientation.COLLINEAR;
  return val > 0 ? Orientation.CLOCKWISE : Orientation.COUNTER_CLOCKWISE;
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
