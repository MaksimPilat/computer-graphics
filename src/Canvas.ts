import { Point } from "./Builder";

export type CanvasOptions = {
  root?: HTMLElement;
  scale?: number;
  gridEnabled?: boolean;
};

export class Canvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private resizeObserver: ResizeObserver;
  private scale: number;
  private gridEnabled: boolean;
  private drawingController = new AbortController();

  constructor({ root = document.body, scale = 10, gridEnabled = false }: CanvasOptions = {}) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.scale = scale;
    this.gridEnabled = gridEnabled;

    this.gridEnabled && this.drawGrid();

    this.resizeObserver = new ResizeObserver((entries) => {
      const { target } = entries[0];
      const { width, height } = target.getBoundingClientRect();
      this.canvas.width = width;
      this.canvas.height = height;
      this.gridEnabled && this.drawGrid();
    });

    this.resizeObserver.observe(root);

    root.appendChild(this.canvas);
  }

  setScale(value: number) {
    this.scale = value;
    this.gridEnabled && this.drawGrid();
  }

  getScale() {
    return this.scale;
  }

  setGrid(value: boolean) {
    this.gridEnabled = value;
    this.clear();
  }

  getCanvasSize() {
    return { width: this.canvas.width, height: this.canvas.height };
  }

  private drawGrid() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.strokeStyle = "#ccc";
    this.context.lineWidth = 0.5;

    for (let y = 0; y < this.canvas.height; y += this.scale) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas.width, y);
      this.context.stroke();
    }

    for (let x = 0; x < this.canvas.width; x += this.scale) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas.height);
      this.context.stroke();
    }
  }

  drawPixel(point: Point, color = "#000000") {
    this.context.fillStyle = color;
    this.context.fillRect(point.x * this.scale, point.y * this.scale, this.scale, this.scale);
  }

  draw(points: Point[], speed: number = 0) {
    this.drawingController && this.drawingController.abort();
    this.drawingController = new AbortController();

    (async (controller: AbortController) => {
      for (let i = 0; i < points.length; i++) {
        if (controller.signal.aborted) return;

        const point = points[i];
        const color = point.intensity ? `rgba(0, 0, 0, ${point.intensity})` : undefined;
        this.drawPixel(point, color);

        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    })(this.drawingController);
  }

  clear() {
    this.drawingController.abort();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.gridEnabled && this.drawGrid();
  }
}
