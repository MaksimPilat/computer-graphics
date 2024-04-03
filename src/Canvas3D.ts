import * as THREE from 'three';

export type Canvas3DOptions = {
  root: HTMLElement;
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

  constructor({ root }: Canvas3DOptions) {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { target } = entries[0];
      const { width, height } = target.getBoundingClientRect();

      this.renderer.setSize(width, height);
      this.clear();
    });

    this.resizeObserver.observe(root);

    this.scene.background = new THREE.Color('#ffffff');

    root.appendChild(this.renderer.domElement);
  }

  drawCube() {
    this.clear();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );

    this.scene.add(line);

    this.camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      line.rotation.x += 0.01;
      line.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  clear() {
    this.scene.clear();
    this.renderer.clear();
  }

  disable() {
    this.clear();
    this.renderer.domElement.style.display = 'none';
  }

  enable() {
    this.renderer.domElement.style.display = 'block';
  }
}
