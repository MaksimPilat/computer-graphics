export type Point = {
  x: number;
  y: number;
  z?: number;
  intensity?: number;
};

export type Edge = {
  startY: number;
  endY: number;
  xAtMinY: number;
  slopeInverse: number;
};

export type CanvasOptions = {
  root: HTMLElement;
};

export interface Canvas {
  draw: Function;
  enable: () => void;
  disable: () => void;
  clear: () => void;
}

export enum Shape {
  CUBE,
  PYRAMID,
  DODECAHEDRON,
}

export enum Orientation {
  COLLINEAR = 0,
  CLOCKWISE = 1,
  COUNTER_CLOCKWISE = 2,
}
