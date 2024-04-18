import { Point } from '../types';

export class CurveBuilder {
  static buildCircle(center: Point, radius: number) {
    const points: Point[] = [];

    let x = radius;
    let y = 0;
    let radiusError = 1 - x;

    const addCirclePoints = (x: number, y: number) => {
      points.push({ x: center.x + x, y: center.y - y });
      points.push({ x: center.x + y, y: center.y - x });
      points.push({ x: center.x - y, y: center.y - x });
      points.push({ x: center.x - x, y: center.y - y });
      points.push({ x: center.x - x, y: center.y + y });
      points.push({ x: center.x - y, y: center.y + x });
      points.push({ x: center.x + y, y: center.y + x });
      points.push({ x: center.x + x, y: center.y + y });
    };

    while (x >= y) {
      addCirclePoints(x, y);
      y++;

      if (radiusError < 0) {
        radiusError += 2 * y + 1;
      } else {
        x--;
        radiusError += 2 * (y - x) + 1;
      }
    }

    return points;
  }

  static buildEllipse(center: Point, rx: number, ry: number) {
    const points: Point[] = [];

    const addEllipsePoints = (x: number, y: number) => {
      points.push({ x: center.x + x, y: center.y - y });
      points.push({ x: center.x - x, y: center.y - y });
      points.push({ x: center.x - x, y: center.y + y });
      points.push({ x: center.x + x, y: center.y + y });
    };

    let x = 0;
    let y = ry;
    let rxSquare = rx * rx;
    let rySquare = ry * ry;
    let twoRxSquare = 2 * rxSquare;
    let twoRySquare = 2 * rySquare;
    let p1 = Math.round(rySquare - rxSquare * ry + 0.25 * rxSquare);
    let dx = 0;
    let dy = twoRxSquare * y;

    addEllipsePoints(x, y);

    while (dx < dy) {
      x++;
      dx += twoRySquare;
      if (p1 < 0) {
        p1 += rySquare + dx;
      } else {
        y--;
        dy -= twoRxSquare;
        p1 += rySquare + dx - dy;
      }
      addEllipsePoints(x, y);
    }

    let p2 = Math.round(
      rySquare * (x + 0.5) * (x + 0.5) +
        rxSquare * (y - 1) * (y - 1) -
        rxSquare * rySquare
    );

    while (y > 0) {
      y--;
      dy -= twoRxSquare;
      if (p2 > 0) {
        p2 += rxSquare - dy;
      } else {
        x++;
        dx += twoRySquare;
        p2 += rxSquare - dy + dx;
      }
      addEllipsePoints(x, y);
    }

    return points;
  }

  static buildParabola(vertex: Point, width: number, density: number) {
    const points: Point[] = [];
    let i = -density;

    const addParabolaPoints = () => {
      if (i <= density) {
        points.push({ x: vertex.x + i * width, y: vertex.y - i ** 2 });
        i += 0.1;
        addParabolaPoints();
      }
    };
    addParabolaPoints();

    return points;
  }

  static buildHyperbola(
    vertex: Point,
    majorAxis: number,
    minorAxis: number,
    width: number,
    height: number
  ) {
    const points: Point[] = [];

    for (let x = 0; x < width; x++) {
      const xNormalized = (x - vertex.x) / majorAxis;
      const rootTerm = Math.sqrt(1 + xNormalized ** 2);

      const y1 = vertex.y + minorAxis * rootTerm;
      const y2 = vertex.y - minorAxis * rootTerm;

      if (y1 >= 0 && y1 < height) {
        points.push({ x, y: y1 });
      }

      if (y2 >= 0 && y2 < height) {
        points.push({ x, y: y2 });
      }
    }

    return points;
  }

  static buildHermiteCurve(
    p0: Point,
    p1: Point,
    m0: Point,
    m1: Point,
    numPoints: number
  ) {
    const points: Point[] = [];

    for (let t = 0; t <= 1; t += 1 / numPoints) {
      const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
      const h10 = t ** 3 - 2 * t ** 2 + t;
      const h01 = -2 * t ** 3 + 3 * t ** 2;
      const h11 = t ** 3 - t ** 2;

      const x = h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x;
      const y = h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y;

      points.push({ x, y });
    }

    return points;
  }

  static buildBezierCurve(
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    numPoints: number
  ) {
    const points: Point[] = [];

    for (let t = 0; t <= 1; t += 1 / numPoints) {
      const x =
        (1 - t) ** 3 * p0.x +
        3 * (1 - t) ** 2 * t * p1.x +
        3 * (1 - t) * t ** 2 * p2.x +
        t ** 3 * p3.x;
      const y =
        (1 - t) ** 3 * p0.y +
        3 * (1 - t) ** 2 * t * p1.y +
        3 * (1 - t) * t ** 2 * p2.y +
        t ** 3 * p3.y;

      points.push({ x, y });
    }

    return points;
  }

  static buildBSplineCurve(
    controlPoints: Point[],
    degree: number,
    numPoints: number
  ) {
    if (degree < 1 || degree > controlPoints.length - 1) {
      throw new Error('Invalid degree for B-spline curve');
    }

    const generateKnots = (n: number, degree: number) => {
      const knots: number[] = [];
      for (let i = 0; i <= n + degree + 1; i++) {
        knots.push(i);
      }
      return knots;
    };

    const basisFunction = (
      i: number,
      p: number,
      knots: number[],
      t: number
    ): number => {
      if (p === 0) {
        return knots[i] <= t && t < knots[i + 1] ? 1 : 0;
      }

      const numerator1 = t - knots[i];
      const denominator1 = knots[i + p] - knots[i];

      const term1 =
        denominator1 !== 0
          ? (numerator1 / denominator1) * basisFunction(i, p - 1, knots, t)
          : 0;

      const numerator2 = knots[i + p + 1] - t;
      const denominator2 = knots[i + p + 1] - knots[i + 1];

      const term2 =
        denominator2 !== 0
          ? (numerator2 / denominator2) * basisFunction(i + 1, p - 1, knots, t)
          : 0;

      return term1 + term2;
    };

    const calculateBSplinePoint = (
      t: number,
      degree: number,
      controlPoints: Point[],
      knots: number[]
    ) => {
      const n = controlPoints.length - 1;
      const result: Point = { x: 0, y: 0 };

      for (let i = 0; i <= n; i++) {
        const basis = basisFunction(i, degree, knots, t);
        result.x += basis * controlPoints[i].x;
        result.y += basis * controlPoints[i].y;
      }

      return result;
    };

    const n = controlPoints.length - 1;
    const knots = generateKnots(n, degree);
    const points: Point[] = [];

    for (
      let t = knots[degree];
      t <= knots[n + 1];
      t += (knots[n + 1] - knots[degree]) / numPoints
    ) {
      const result = calculateBSplinePoint(t, degree, controlPoints, knots);
      points.push(result);
    }

    return points;
  }
}
