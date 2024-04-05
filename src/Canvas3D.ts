import * as THREE from 'three';

export type Canvas3DOptions = {
  root: HTMLElement;
};

export type Point3D = {
  x: number;
  y: number;
  z: number;
};

export class Canvas3D {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
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
  private currentShape: string | null = null;

  constructor({ root }: Canvas3DOptions) {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { target } = entries[0];
      const { width, height } = target.getBoundingClientRect();
      this.renderer.setSize(width, height);
      this.clear();
    });

    this.resizeObserver.observe(root);

    this.scene.background = new THREE.Color('#ffffff');

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
  }

  drawCube() {
    this.clear();

    this.currentShape = 'cube';

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const line = new THREE.LineSegments(edges, material);
    line.name = 'cube';

    this.scene.add(line);

    this.animateCamera();
  }

  drawPyramid() {
    this.clear();

    const geometry = new THREE.ConeGeometry(1, 1, 4);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const line = new THREE.LineSegments(edges, material);
    line.name = 'pyramid';

    this.scene.add(line);

    this.camera.position.z = 3;

    const animatePyramid = () => {
      this.animationFrameId = requestAnimationFrame(() => animatePyramid());

      const line = this.scene.getObjectByName(
        'pyramid'
      ) as THREE.Object3D<THREE.Object3DEventMap>;

      if (!this.isDragging) {
        const deltaMove = {
          x: 0.5,
          y: 0.3,
          z: 0.4,
        };

        const axis = new THREE.Vector3(deltaMove.y, deltaMove.x, deltaMove.z);
        const angle = axis.length() * 0.01;

        line.rotateOnAxis(axis.normalize(), angle);
      } else {
        const deltaMove = {
          x: this.mousePosition.previous.x - this.mousePosition.current.x,
          y: this.mousePosition.previous.y - this.mousePosition.current.y,
        };

        if (deltaMove.x || deltaMove.y) {
          const axis = new THREE.Vector3(deltaMove.y, deltaMove.x, 0);
          const angle = axis.length() * 0.01;

          line.rotateOnWorldAxis(axis.normalize(), angle);
        }

        this.mousePosition.previous = {
          x: this.mousePosition.current.x,
          y: this.mousePosition.current.y,
        };
      }

      this.renderer.render(this.scene, this.camera);
    };

    animatePyramid();
  }

  drawDodecahedron() {
    this.clear();

    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const line = new THREE.LineSegments(edges, material);
    line.name = 'polyhedron';

    this.scene.add(line);

    this.camera.position.z = 3;

    const animateDodecahedron = () => {
      this.animationFrameId = requestAnimationFrame(() =>
        animateDodecahedron()
      );

      const line = this.scene.getObjectByName(
        'polyhedron'
      ) as THREE.Object3D<THREE.Object3DEventMap>;

      if (!this.isDragging) {
        const deltaMove = {
          x: 0.5,
          y: 0.3,
          z: 0.5,
        };

        const axis = new THREE.Vector3(deltaMove.y, deltaMove.x, deltaMove.z);
        const angle = axis.length() * 0.01;

        line.rotateOnAxis(axis.normalize(), angle);
      } else {
        const deltaMove = {
          x: this.mousePosition.previous.x - this.mousePosition.current.x,
          y: this.mousePosition.previous.y - this.mousePosition.current.y,
        };

        if (deltaMove.x || deltaMove.y) {
          const axis = new THREE.Vector3(deltaMove.y, deltaMove.x, 0);
          const angle = axis.length() * 0.01;

          line.rotateOnWorldAxis(axis.normalize(), angle);
        }

        this.mousePosition.previous = {
          x: this.mousePosition.current.x,
          y: this.mousePosition.current.y,
        };
      }

      this.renderer.render(this.scene, this.camera);
    };

    animateDodecahedron();
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
    if (this.isDragging && this.currentShape) {
      const deltaMove = {
        x: event.clientX - this.mousePosition.previous.x,
        y: event.clientY - this.mousePosition.previous.y,
        z: 0,
      };

      this.rotateShape(this.currentShape, deltaMove);

      this.mousePosition.previous = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  private rotateShape(shape: string, deltaMove: Point3D) {
    const object = this.scene.getObjectByName(
      shape
    ) as THREE.Object3D<THREE.Object3DEventMap>;

    const axis = new THREE.Vector3(deltaMove.y, deltaMove.x, 0);
    const angle = axis.length() * 0.01;
    object.rotateOnWorldAxis(axis.normalize(), angle);

    this.renderer.render(this.scene, this.camera);
  }

  private rotateCamera(deltaMove: Point3D) {
    const center = new THREE.Vector3(0, 0, 0);

    const radius = 2;
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
    const z = radius * Math.cos(this.camera.userData.phi);
    const newPosition = new THREE.Vector3(x, y, z);

    this.camera.position.copy(newPosition);
    this.camera.lookAt(center);
  }

  animateCamera() {
    this.animationFrameId = requestAnimationFrame(
      this.animateCamera.bind(this)
    );

    if (!this.isDragging) {
      this.rotateCamera({ x: 0.5, y: 0.3, z: 0 });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
