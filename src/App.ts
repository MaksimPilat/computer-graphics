import { Canvas2D, Canvas2DOptions } from './Canvas2D';
import { Canvas3D, Canvas3DOptions } from './Canvas3D';
import { Builder } from './Builder';

type AppOptions = Canvas2DOptions & Canvas3DOptions & {};

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
      root: document.getElementById('content') as HTMLElement,
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

    const DDALine = Builder.buildDDALine({ x: 2, y: 2 }, { x: 10, y: 14 });

    this.canvas2D.clear();
    this.canvas2D.draw(DDALine, 100);
  }

  drawBresenhamLine() {
    this.switchTo2D();

    const bresenhamLine = Builder.buildBresenhamLine(
      { x: 2, y: 2 },
      { x: 12, y: 6 }
    );

    this.canvas2D.clear();
    this.canvas2D.draw(bresenhamLine, 100);
  }

  drawWuLine() {
    this.switchTo2D();

    const wuLine = Builder.buildWuLine({ x: 2, y: 2 }, { x: 24, y: 12 });

    this.canvas2D.clear();
    this.canvas2D.draw(wuLine, 50);
  }

  drawCircle() {
    this.switchTo2D();

    const circle = Builder.buildCircle({ x: 18, y: 18 }, 12);

    this.canvas2D.clear();
    this.canvas2D.draw(circle, 20);
  }

  drawEllipse() {
    this.switchTo2D();

    const ellipse = Builder.buildEllipse({ x: 18, y: 18 }, 8, 12);

    this.canvas2D.clear();
    this.canvas2D.draw(ellipse, 20);
  }

  drawParabola() {
    this.switchTo2D();

    const parabola = Builder.buildParabola({ x: 20, y: 30 }, 2, 5);

    this.canvas2D.clear();
    this.canvas2D.draw(parabola, 10);
  }

  drawHyperbola() {
    this.switchTo2D();

    const { width, height } = this.canvas2D.getCanvasSize();
    const hyperbola = Builder.buildHyperbola(
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

    const curve = Builder.buildHermiteCurve(
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

    const curve = Builder.buildBezierCurve(
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

    const controlPoints = [
      { x: 20, y: 25 },
      { x: 30, y: 15 },
      { x: 35, y: 40 },
      { x: 60, y: 20 },
    ];
    const degree = 2;
    const numPoints = 100;

    const bsplineCurve = Builder.buildBSplineCurve(
      controlPoints,
      degree,
      numPoints
    );

    this.canvas2D.clear();
    this.canvas2D.draw(bsplineCurve, 10);
  }

  drawCube() {
    this.switchTo3D();
    this.canvas3D.drawCube();
  }

  drawPyramid() {
    this.switchTo3D();
    this.canvas3D.drawPyramid();
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
  }
}
