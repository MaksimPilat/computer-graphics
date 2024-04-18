import { Point } from './types';
import { CurveBuilder } from './2D/CurveBuilder';
import { LineBuilder } from './2D/LineBuilder';
import { PolygonBuilder } from './2D/PolygonBuilder';
import { Canvas2D, Canvas2DOptions } from './2D/Canvas2D';
import { Canvas3D, Canvas3DOptions } from './3D/Canvas3D';

type AppOptions = Canvas2DOptions & Canvas3DOptions;

export class App {
  private canvas2D: Canvas2D;
  private canvas3D: Canvas3D;

  constructor(options: AppOptions) {
    this.canvas2D = new Canvas2D({
      root: options.root,
      scale: options.scale,
      gridEnabled: options.gridEnabled,
    });

    this.canvas3D = new Canvas3D({
      root: options.root,
    });

    this.canvas3D.disable();

    this.setupEventListeners();
  }

  private switchTo2D() {
    this.canvas3D.disable();
    this.canvas2D.enable();
  }

  private switchTo3D() {
    this.canvas2D.disable();
    this.canvas3D.enable();
  }

  drawDDALine() {
    this.switchTo2D();

    const DDALine = LineBuilder.buildDDALine({ x: 2, y: 2 }, { x: 10, y: 14 });

    this.canvas2D.clear();
    this.canvas2D.draw(DDALine, 100);
  }

  drawBresenhamLine() {
    this.switchTo2D();

    const bresenhamLine = LineBuilder.buildBresenhamLine(
      { x: 2, y: 2 },
      { x: 12, y: 6 }
    );

    this.canvas2D.clear();
    this.canvas2D.draw(bresenhamLine, 100);
  }

  drawWuLine() {
    this.switchTo2D();

    const wuLine = LineBuilder.buildWuLine({ x: 2, y: 2 }, { x: 24, y: 12 });

    this.canvas2D.clear();
    this.canvas2D.draw(wuLine, 50);
  }

  drawCircle() {
    this.switchTo2D();

    const circle = CurveBuilder.buildCircle({ x: 18, y: 18 }, 12);

    this.canvas2D.clear();
    this.canvas2D.draw(circle, 20);
  }

  drawEllipse() {
    this.switchTo2D();

    const ellipse = CurveBuilder.buildEllipse({ x: 18, y: 18 }, 8, 12);

    this.canvas2D.clear();
    this.canvas2D.draw(ellipse, 20);
  }

  drawParabola() {
    this.switchTo2D();

    const parabola = CurveBuilder.buildParabola({ x: 20, y: 30 }, 2, 5);

    this.canvas2D.clear();
    this.canvas2D.draw(parabola, 10);
  }

  drawHyperbola() {
    this.switchTo2D();

    const { width, height } = this.canvas2D.getCanvasSize();
    const hyperbola = CurveBuilder.buildHyperbola(
      { x: 40, y: 40 },
      5,
      5,
      width,
      height
    );

    this.canvas2D.clear();
    this.canvas2D.draw(hyperbola, 10);
  }

  drawHermiteCurve() {
    this.switchTo2D();

    const curve = CurveBuilder.buildHermiteCurve(
      { x: 30, y: 10 },
      { x: 35, y: 25 },
      { x: 52, y: 10 },
      { x: 85, y: 5 },
      100
    );

    this.canvas2D.clear();
    this.canvas2D.draw(curve, 10);
  }

  drawBezierCurve() {
    this.switchTo2D();

    const curve = CurveBuilder.buildBezierCurve(
      { x: 30, y: 10 },
      { x: 35, y: 25 },
      { x: 42, y: 10 },
      { x: 32, y: 35 },
      100
    );

    this.canvas2D.clear();
    this.canvas2D.draw(curve, 10);
  }

  drawBSplineCurve() {
    this.switchTo2D();

    const controlPoints: Point[] = [
      { x: 20, y: 25 },
      { x: 30, y: 15 },
      { x: 35, y: 40 },
      { x: 60, y: 20 },
    ];

    const bsplineCurve = CurveBuilder.buildBSplineCurve(controlPoints, 2, 100);

    this.canvas2D.clear();
    this.canvas2D.draw(bsplineCurve, 10);
  }

  drawGrahamPolygon() {
    this.switchTo2D();

    const points: Point[] = [
      { x: 0, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 0 },
      { x: 0, y: 0 },
      { x: 12, y: 10 },
    ];

    let polygon = PolygonBuilder.buildGrahamPolygon(points);
    polygon = this.fillPolygon(polygon);

    this.canvas2D.clear();
    this.canvas2D.draw(polygon, 50);
  }

  drawJarvisPolygon() {
    this.switchTo2D();

    const points: Point[] = [
      { x: 0, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 0 },
      { x: 0, y: 0 },
      { x: 12, y: 10 },
    ];

    let hull = PolygonBuilder.buildJarvisPolygon(points);
    hull = this.fillPolygon(hull);

    this.canvas2D.clear();
    this.canvas2D.draw(hull, 50);
  }

  private fillPolygon(polygon: Point[]) {
    const selectElem = document.getElementById(
      'polygon-fill-select'
    ) as HTMLSelectElement;
    const fillType = selectElem.value;

    if (fillType === 'scan-lines-fill') {
      return PolygonBuilder.scanLinesFill(polygon);
    } else if (fillType === 'scan-lines-active-edges-fill') {
      return PolygonBuilder.scanLinesWithActiveEdgesFill(polygon);
    } else if (fillType === 'flood-fill') {
      return PolygonBuilder.floodFill(polygon);
    } else if (fillType === 'scan-lines-flood-fill') {
      return PolygonBuilder.scanLinesFloodFill(polygon);
    }

    return polygon;
  }

  drawCube() {
    this.switchTo3D();
    this.canvas3D.drawCube();
  }

  drawPyramid() {
    this.switchTo3D();
    this.canvas3D.drawPyramid();
  }

  drawDodecahedron() {
    this.switchTo3D();
    this.canvas3D.drawDodecahedron();
  }

  clearCanvas() {
    this.canvas2D.clear();
    this.canvas3D.clear();
  }

  setupEventListeners() {
    document
      .getElementById('dda-line')
      ?.addEventListener('click', () => this.drawDDALine());
    document
      .getElementById('bresenham-line')
      ?.addEventListener('click', () => this.drawBresenhamLine());
    document
      .getElementById('wu-line')
      ?.addEventListener('click', () => this.drawWuLine());
    document
      .getElementById('circle')
      ?.addEventListener('click', () => this.drawCircle());
    document
      .getElementById('ellipse')
      ?.addEventListener('click', () => this.drawEllipse());
    document
      .getElementById('clear-canvas')
      ?.addEventListener('click', () => this.clearCanvas());
    document
      .getElementById('parabola')
      ?.addEventListener('click', () => this.drawParabola());
    document
      .getElementById('hyperbola')
      ?.addEventListener('click', () => this.drawHyperbola());
    document
      .getElementById('hermite-curve')
      ?.addEventListener('click', () => this.drawHermiteCurve());
    document
      .getElementById('bezier-curve')
      ?.addEventListener('click', () => this.drawBezierCurve());
    document
      .getElementById('bspline-curve')
      ?.addEventListener('click', () => this.drawBSplineCurve());
    document
      .getElementById('cube')
      ?.addEventListener('click', () => this.drawCube());
    document
      .getElementById('pyramid')
      ?.addEventListener('click', () => this.drawPyramid());
    document
      .getElementById('dodecahedron')
      ?.addEventListener('click', () => this.drawDodecahedron());
    document
      .getElementById('graham-polygon')
      ?.addEventListener('click', () => this.drawGrahamPolygon());
    document
      .getElementById('jarvis-polygon')
      ?.addEventListener('click', () => this.drawJarvisPolygon());
  }
}
