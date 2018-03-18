import 'three';
import 'three/OrbitControls';

class App {
    constructor() {
        this.state = {
            uniforms: {
                iResolution: {type: "v2", value: new THREE.Vector2(0, 0)},
            }
        }

        this.three = {};
    }

    changeSize(width, height) {
        this.three.renderer.setPixelRatio(window.devicePixelRatio);
        this.three.renderer.setSize(width, height);
        this.three.renderer.needsUpdate = true;
        this.state.uniforms.iResolution.value = new THREE.Vector2(width, height);
        this.state.uniforms.needsUpdate = true;
        this.three.camera.aspect = width / height;
        this.three.camera.needsUpdate = true;
    }

    initialize(container) {
        const self = this;
        this.initializeThree(container);
    }

    initializeThree(container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        // initialize renderer and size
        this.three.renderer = new THREE.WebGLRenderer();
        container.appendChild(this.three.renderer.domElement);
        this.three.renderer.setClearColor(new THREE.Color(0xF0F0F0));

        // initialize camera
        this.three.camera = new THREE.OrthographicCamera(0.0, 1.0, 0.0, 1.0, 1.0, 1000.0);
        // this.three.camera =new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.three.camera.position.set(0, 0, 10);
        this.three.camera.up = new THREE.Vector3(0.0, 1.0, 0.0);
        this.three.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        this.changeSize(width, height);

        this.three.scene = new THREE.Scene();

        new THREE.OrbitControls(this.three.camera, this.three.renderer.domElement);

        const axes = new THREE.AxesHelper(10000);
        axes.position.set(0, 0, 0);
        this.three.scene.add(axes);

        const grid = new THREE.GridHelper(100, 50);
        this.three.scene.add(grid);

        this.three.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 0.0,
        ]);
        const is = new Float32Array([
            0.0, 1.0, 2.0,
            0.0, 1.0, 2.0,
        ]);
        const uis = new Float32Array([
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
        ]);
        const ujs = new Float32Array([
            0.4, 0.4, 0.8,
            0.4, 0.4, 0.8,
        ]);
        this.three.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.three.geometry.addAttribute('idx', new THREE.BufferAttribute(is, 1));
        this.three.geometry.addAttribute('ui', new THREE.BufferAttribute(uis, 1));
        this.three.geometry.addAttribute('uj', new THREE.BufferAttribute(ujs, 1));

        this.three.material = new THREE.ShaderMaterial({
            uniforms: this.state.uniforms,
            vertexShader: document.getElementById('vertex_quad').textContent,
            fragmentShader: document.getElementById('fragment_quad').textContent,
        });

        this.three.material.side = THREE.DoubleSide;
        this.three.material.transparent = true;
        this.three.mesh = new THREE.Mesh(this.three.geometry, this.three.material);
        this.three.scene.add(this.three.mesh);

        this.animate();
    }

    animate() {
        const self = this;
        const callback = () => { self.animate() };
        requestAnimationFrame(callback);
        this.render();
    }

    render() {
        this.three.renderer.render(this.three.scene, this.three.camera);
    }
}

const app = new App();
const resize = () => {
    const container = document.getElementById('root');
    app.changeSize(container.clientWidth, container.clientHeight);
}
window.onresize = resize;
window.onload = () => {
    const rootElement = document.getElementById('root');
    app.initialize(rootElement);
}
