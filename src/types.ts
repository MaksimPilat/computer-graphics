export type Point = {
  x: number;
  y: number;
  z?: number;
  intensity?: number;
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

export enum Shapes {
  Cube,
  Pyramid,
  Dodecahedron,
}
