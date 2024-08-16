import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const textures = [];
const textureLoader = new THREE.TextureLoader();

const milKWAY = textureLoader.load('./images/glaxy2.png');
const shadows = textureLoader.load('./images/shadow.png');

textures.push(milKWAY);
textures.push(shadows);

textures.forEach(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
});

const hdrTextureURL = new URL('./images/victoria_sunset_4k.hdr', import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 30);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const loader = new RGBELoader();
loader.load(hdrTextureURL, function (texturehdr) {
    texturehdr.mapping = THREE.EquirectangularReflectionMapping;

    const geo2 = new THREE.CircleGeometry(10.5, 84);
    const mat2 = new THREE.MeshBasicMaterial({
        map: milKWAY,
        reflectivity: 0,
        envMap: texturehdr,
        side: THREE.DoubleSide,
    });

    const sphere2 = new THREE.Mesh(geo2, mat2);

    const geo = new THREE.SphereGeometry(10.5, 64, 64);
    const mat = new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0,
        transmission: 1,
        transparent: true,
        reflectivity: 0.1,
        refractionRatio: 0.2,
        envMap: texturehdr,
    });

    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(-2, -7, -4);
    sphere.name = 'Sphere'; // Name the sphere for easy identification

    const geoGround = new THREE.CircleGeometry(10.5, 64);
    const matGround = new THREE.MeshPhysicalMaterial({
        opacity: 0.3,
        transparent: true,
    });
    const groundCir = new THREE.Mesh(geoGround, matGround);
    groundCir.rotateX(-Math.PI / 2);
    groundCir.position.set(-1.6, -10, -5);

    scene.add(sphere);
    sphere.add(sphere2);
    sphere.add(groundCir);
});

// Raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(scene.children);

    intersects.forEach(intersect => {
        if (intersect.object.name === 'Sphere') {
            // Show the slider and hide the canvas
            const sliderContainer = document.getElementById('slider-container');
            // const threeCanvas = document.getElementById('three-canvas');

            if (sliderContainer) {
                sliderContainer.style.display = 'block';
                // threeCanvas.style.display = 'none';
            } else {
                console.error("Slider container or Three.js canvas element not found.");
            }
        }
    });
}

window.addEventListener('click', onMouseClick, false);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

scene.background = new THREE.Color('white');
