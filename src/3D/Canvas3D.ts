import * as THREE from 'three';
import * as d3 from 'd3';
import Delaunator from 'delaunator';
import { Canvas, CanvasOptions, Point, Shape } from '../types';

export type Canvas3DOptions = CanvasOptions;

export class Canvas3D implements Canvas {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  private renderer = new THREE.WebGLRenderer();
  private resizeObserver: ResizeObserver;
  private animationFrameId: number | null = null;
  private isDragging = false;
  private mousePosition = {
    previous: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  };
  private currentShape: Shape | null = null;

  constructor({ root }: Canvas3DOptions) {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { target } = entries[0];
      const { width, height } = target.getBoundingClientRect();
      this.renderer.setSize(width, height);
      this.clear();
    });

    this.resizeObserver.observe(root);

    this.scene.background = new THREE.Color(THREE.Color.NAMES.white);

    this.camera.position.z = 2;
    this.camera.userData = { theta: 0, phi: 0 };

    root.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener('mousedown', (event) =>
      this.onMouseDown(event)
    );
    this.renderer.domElement.addEventListener('mouseup', () =>
      this.onMouseUp()
    );
    this.renderer.domElement.addEventListener('mousemove', (event) =>
      this.onMouseMove(event)
    );
    this.renderer.domElement.addEventListener('wheel', (event) =>
      this.onMouseWheel(event)
    );
  }

  draw(geometry: THREE.BufferGeometry, shapeName: Shape, isAnimated = true) {
    this.clear();

    this.currentShape = shapeName;

    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const line = new THREE.LineSegments(edges, material);
    line.name = shapeName.toString();

    this.scene.add(line);

    this.renderer.render(this.scene, this.camera);

    isAnimated && this.animateCamera();
  }

  drawCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.draw(geometry, Shape.CUBE);
  }

  drawPyramid() {
    const geometry = new THREE.ConeGeometry(1, 1, 4);
    this.draw(geometry, Shape.PYRAMID);
  }

  drawDodecahedron() {
    const geometry = new THREE.DodecahedronGeometry(1, 0);
    this.draw(geometry, Shape.DODECAHEDRON);
  }

  clear() {
    this.currentShape = null;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.scene.clear();
    this.renderer.clear();
    this.camera.clear();
    this.camera.position.z = 2;
  }

  disable() {
    this.clear();
    this.renderer.domElement.style.display = 'none';
  }

  enable() {
    this.renderer.domElement.style.display = 'block';
  }

  private onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.isDragging = true;
      this.mousePosition.previous = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  private onMouseUp() {
    this.isDragging = false;
  }

  private onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.currentShape !== null) {
      const deltaMove = {
        x: event.clientX - this.mousePosition.previous.x,
        y: event.clientY - this.mousePosition.previous.y,
      };

      this.rotateShape(this.currentShape, deltaMove);

      this.mousePosition.previous = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  private onMouseWheel(event: WheelEvent) {
    const delta = event.deltaY;
    const step = delta > 0 ? -1 : 1;

    this.camera.position.z += step / 10;

    this.renderer.render(this.scene, this.camera);
  }

  private rotateShape(shapeName: Shape, deltaMove: Point) {
    const object = this.scene.getObjectByName(
      shapeName.toString()
    ) as THREE.Object3D<THREE.Object3DEventMap>;

    const axis = new THREE.Vector3(deltaMove.y, deltaMove.x);
    const angle = axis.length() * 0.01;
    object.rotateOnWorldAxis(axis.normalize(), angle);

    this.renderer.render(this.scene, this.camera);
  }

  private rotateCamera(deltaMove: Point) {
    const center = new THREE.Vector3(0, 0, 0);

    const radius = this.camera.position.z;

    const frequency = 0.5;
    const theta = -deltaMove.x * 0.01;
    const phi = -deltaMove.y * 0.01;

    this.camera.userData.theta += theta;
    this.camera.userData.phi += phi;

    const x = radius * Math.sin(this.camera.userData.theta);
    const y =
      radius *
      Math.sin(this.camera.userData.phi) *
      Math.cos(frequency * this.camera.userData.theta);
    const newPosition = new THREE.Vector3(x, y, radius);

    this.camera.position.copy(newPosition);
    this.camera.lookAt(center);
  }

  private animateCamera() {
    this.animationFrameId = requestAnimationFrame(
      this.animateCamera.bind(this)
    );

    if (!this.isDragging) {
      this.rotateCamera({ x: 0.5, y: 0.3, z: 0 });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
