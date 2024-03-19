import { Canvas, CanvasOptions } from './Canvas';
import { Builder } from './Builder';

type AppOptions = CanvasOptions & {};

export class App {
  private canvas: Canvas;

  constructor(options: AppOptions) {
    this.canvas = new Canvas({
      scale: options.scale,
      gridEnabled: options.gridEnabled,
    });
    this.setupEventListeners();
  }

  drawDDALine = () => {
    const DDALine = Builder.buildDDALine({ x: 2, y: 2 }, { x: 10, y: 14 });
    this.canvas.clear();
    this.canvas.draw(DDALine, 100);
  };

  drawBresenhamLine = () => {
    const bresenhamLine = Builder.buildBresenhamLine(
      { x: 2, y: 2 },
      { x: 12, y: 6 }
    );
    this.canvas.clear();
    this.canvas.draw(bresenhamLine, 100);
  };

  drawWuLine = () => {
    const wuLine = Builder.buildWuLine({ x: 2, y: 2 }, { x: 24, y: 12 });
    this.canvas.clear();
    this.canvas.draw(wuLine, 50);
  };

  drawCircle = () => {
    const circle = Builder.buildCircle({ x: 18, y: 18 }, 12);
    this.canvas.clear();
    this.canvas.draw(circle, 20);
  };

  drawEllipse = () => {
    const ellipse = Builder.buildEllipse({ x: 18, y: 18 }, 8, 12);
    this.canvas.clear();
    this.canvas.draw(ellipse, 20);
  };

  drawParabola = () => {
    const parabola = Builder.buildParabola({ x: 20, y: 30 }, 2, 5);
    this.canvas.clear();
    this.canvas.draw(parabola, 10);
  };

  drawHyperbola = () => {
    const { width, height } = this.canvas.getCanvasSize();
    const hyperbola = Builder.buildHyperbola(
      { x: 40, y: 40 },
      5,
      5,
      width,
      height
    );
    this.canvas.clear();
    this.canvas.draw(hyperbola, 10);
  };

  drawHermiteCurve = () => {
    const curve = Builder.buildHermiteCurve(
      { x: 30, y: 10 },
      { x: 35, y: 25 },
      { x: 52, y: 10 },
      { x: 85, y: 5 },
      100
    );
    this.canvas.clear();
    this.canvas.draw(curve, 10);
  };

  drawBezierCurve = () => {
    const curve = Builder.buildBezierCurve(
      { x: 30, y: 10 },
      { x: 35, y: 25 },
      { x: 42, y: 10 },
      { x: 32, y: 35 },
      100
    );
    this.canvas.clear();
    this.canvas.draw(curve, 10);
  };

  drawBSplineCurve = () => {
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

    this.canvas.clear();
    this.canvas.draw(bsplineCurve, 10);
  };

  clearCanvas = () => {
    this.canvas.clear();
  };

  setupEventListeners = () => {
    document
      .getElementById('dda-line')
      ?.addEventListener('click', this.drawDDALine);
    document
      .getElementById('bresenham-line')
      ?.addEventListener('click', this.drawBresenhamLine);
    document
      .getElementById('wu-line')
      ?.addEventListener('click', this.drawWuLine);
    document
      .getElementById('circle')
      ?.addEventListener('click', this.drawCircle);
    document
      .getElementById('ellipse')
      ?.addEventListener('click', this.drawEllipse);
    document
      .getElementById('clear-canvas')
      ?.addEventListener('click', this.clearCanvas);
    document
      .getElementById('parabola')
      ?.addEventListener('click', this.drawParabola);
    document
      .getElementById('hyperbola')
      ?.addEventListener('click', this.drawHyperbola);
    document
      .getElementById('hermite-curve')
      ?.addEventListener('click', this.drawHermiteCurve);
    document
      .getElementById('bezier-curve')
      ?.addEventListener('click', this.drawBezierCurve);
    document
      .getElementById('bspline-curve')
      ?.addEventListener('click', this.drawBSplineCurve);
  };
}
