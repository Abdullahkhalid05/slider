import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as YUKA from 'yuka';
import milKy from './images/glaxy-pic.png';
import milKy2 from './images/glaxy2.png';
import shadow from './images/shadow.png';

const textures = [];
const textureLoader = new THREE.TextureLoader();

const milKWAY = textureLoader.load(milKy);
const milKWAY2 = textureLoader.load(milKy2);
const shadows = textureLoader.load(shadow);
const venusTexture = textureLoader.load('https://i.imgur.com/zU5oOjt.jpeg');
const marsTexture = textureLoader.load('https://i.imgur.com/U6upjrv.jpeg');
const jupiterTexture = textureLoader.load('https://i.imgur.com/4APG00k.jpeg');
const saturnTexture = textureLoader.load('https://i.imgur.com/YKw0m4x.jpeg');
const plutoTexture = textureLoader.load('https://i.imgur.com/YNsmmHV.jpeg');
const uranus = textureLoader.load('https://i.imgur.com/olpgGMo.jpeg');
const neptune = textureLoader.load('https://i.imgur.com/pycXdLM.jpeg');

// const hdrTextureURL = new URL('./images/victoria_sunset_4k.hdr', import.meta.url);

textures.push(
    milKWAY,
    milKWAY2,
    venusTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    plutoTexture,
    neptune,
    uranus,
    shadows
);

textures.forEach(function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
});

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

const spheres = [];

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;


let hdrTexture;

const hdrTextureURL = new URL('./images/victoria_sunset_4k.hdr', import.meta.url);

const loader = new RGBELoader();
loader.load(hdrTextureURL, function (texturehdr) {
    texturehdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texturehdr;
    hdrTexture = texturehdr;

    spheres.push(createSphere(plutoTexture, positions[0].x, positions[0].y, positions[0].z, rotations[0], groundPositions[0]));
    spheres.push(createSphere(milKWAY, positions[1].x, positions[1].y, positions[1].z, rotations[1], groundPositions[1]));
    spheres.push(createSphere(venusTexture, positions[2].x, positions[2].y, positions[2].z, rotations[2], groundPositions[2]));
    spheres.push(createSphere(milKWAY2, positions[3].x, positions[3].y, positions[3].z, rotations[3], groundPositions[3]));
    spheres.push(createSphere(saturnTexture, positions[4].x, positions[4].y, positions[4].z, rotations[4], groundPositions[4]));
    spheres.push(createSphere(saturnTexture, positions[5].x, positions[5].y, positions[5].z, rotations[5], groundPositions[5]));
});


function createSphere(texture, x, y, z, rotation, groundPosition) {
    const geo2 = new THREE.CircleGeometry(10.7, 64);
    const mat2 = new THREE.MeshBasicMaterial({
        map: texture,
        reflectivity: 0,
        refractionRatio: 0,
        envMap: hdrTexture,
        side: THREE.DoubleSide,
    });

    const sphere2 = new THREE.Mesh(geo2, mat2);

    const geoGround = new THREE.CircleGeometry(10.3, 64);
    const matGround = new THREE.MeshStandardMaterial({
        map: shadows,
        // color: 0x000000,
        opacity: 0.3,
        transparent: true,
    });
    const groundCir = new THREE.Mesh(geoGround, matGround);

    groundCir.rotateX(-Math.PI / 2);
    groundCir.position.set(groundPosition.x, groundPosition.y, groundPosition.z);

    const geo = new THREE.SphereGeometry(10.5, 64, 64);
    const mat = new THREE.MeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0,
        transmission: 1,
        transparent: true,
        reflectivity: 0.1,
        envMap: hdrTexture,
    });

    const sphere = new THREE.Mesh(geo, mat);
    sphere.add(sphere2);
    sphere.add(groundCir);

    scene.add(sphere);

    sphere.position.set(x, y, z);
    sphere.rotation.copy(rotation); // Apply initial rotation
    return sphere;
}

const initialPosition = new THREE.Vector3(-2, -7, -4);
const hoverPosition = new THREE.Vector3(-2, -7, -3);

const positions = [
    new YUKA.Vector3(-33, -39, -20),
    initialPosition,
    new YUKA.Vector3(25, 11, -20),
    new YUKA.Vector3(77, 32, -39),
    new YUKA.Vector3(149, 53, -55),
    new YUKA.Vector3(213, -93, -40)
];

const groundPositions = [
    new THREE.Vector3(0, 0, 0),     // Ground position for sphere at positions[0]
    new THREE.Vector3(-3.6, -10, -5),     // Ground position for sphere at positions[1]
    new THREE.Vector3(-6, -10, -9),     // Ground position for sphere at positions[2]
    new THREE.Vector3(-6, -11, 0),     // Ground position for sphere at positions[3]
    new THREE.Vector3(0, -1, 0),     // Ground position for sphere at positions[4]
    new THREE.Vector3(0, 0, 0)      // Ground position for sphere at positions[5]
];



const rotations = [
    new THREE.Euler(-Math.PI / 12, Math.PI / 12, 0), // Rotation for positions[0]
    new THREE.Euler(-Math.PI / 16, Math.PI / 34, 0),            // No rotation for positions[1]
    new THREE.Euler(Math.PI / 12, -Math.PI / 8, 0),// Rotation for positions[2]
    new THREE.Euler(Math.PI / 13, -Math.PI / 5.5, 0), // Rotation for positions[3]
    new THREE.Euler(Math.PI / 7, -Math.PI / 5, 0), // Rotation for positions[4]
    new THREE.Euler(Math.PI / 8, 0, 0)   // Default rotation for positions[5]
];

let isHovering = false;

let previousScrollPosition = window.scrollY;

function swapPositionsDown() {
    spheres.forEach((sphere) => {
        const currentPosition = sphere.position.clone();
        let nextPosition, nextRotation, nextGroundPosition;

        switch (true) {
            case currentPosition.equals(positions[0]):
                nextPosition = positions[1];
                nextRotation = rotations[1];
                nextGroundPosition = groundPositions[1];
                break;
            case currentPosition.equals(positions[1]):
                nextPosition = positions[2];
                nextRotation = rotations[2];
                nextGroundPosition = groundPositions[2];
                break;
            case currentPosition.equals(positions[2]):
                nextPosition = positions[3];
                nextRotation = rotations[3];
                nextGroundPosition = groundPositions[3];
                break;
            case currentPosition.equals(positions[3]):
                nextPosition = positions[4];
                nextRotation = rotations[4];
                nextGroundPosition = groundPositions[4];
                break;
            case currentPosition.equals(positions[4]):
                nextPosition = positions[5];
                nextRotation = rotations[5];
                nextGroundPosition = groundPositions[5];
                break;
            case currentPosition.equals(positions[5]):
                nextPosition = positions[0];
                nextRotation = rotations[0];
                nextGroundPosition = groundPositions[0];
                break;
            default:
                return;
        }

        animatePosition(sphere, nextPosition, nextRotation, nextGroundPosition);
    });
}

function swapPositionsUP() {
    spheres.forEach((sphere) => {
        const currentPosition = sphere.position.clone();
        let nextPosition, nextRotation, nextGroundPosition;

        switch (true) {
            case currentPosition.equals(positions[0]):
                nextPosition = positions[5];
                nextRotation = rotations[5];
                nextGroundPosition = groundPositions[5];
                break;
            case currentPosition.equals(positions[5]):
                nextPosition = positions[4];
                nextRotation = rotations[4];
                nextGroundPosition = groundPositions[4];
                break;
            case currentPosition.equals(positions[4]):
                nextPosition = positions[3];
                nextRotation = rotations[3];
                nextGroundPosition = groundPositions[3];
                break;
            case currentPosition.equals(positions[3]):
                nextPosition = positions[2];
                nextRotation = rotations[2];
                nextGroundPosition = groundPositions[2];
                break;
            case currentPosition.equals(positions[2]):
                nextPosition = positions[1];
                nextRotation = rotations[1];
                nextGroundPosition = groundPositions[1];
                break;
            case currentPosition.equals(positions[1]):
                nextPosition = positions[0];
                nextRotation = rotations[0];
                nextGroundPosition = groundPositions[0];
                break;
            default:
                return;
        }

        animatePosition(sphere, nextPosition, nextRotation, nextGroundPosition);
    });
}





let simulatedScrollPosition = 0;
let scrollStep = 50; // Adjust this to control the scroll step

function onSimulatedScroll(delta) {
    // Update simulated scroll position
    simulatedScrollPosition += delta;

    if (delta > 0) {
        swapPositionsUP();
    } else {
        swapPositionsDown();
    }
}

window.addEventListener('keydown', (event) => {
    // Example: Use the arrow keys for scrolling
    if (event.key === 'ArrowDown') {
        onSimulatedScroll(scrollStep);
    } else if (event.key === 'ArrowUp') {
        onSimulatedScroll(-scrollStep);
    }
});

window.addEventListener('wheel', (event) => {
    // Handle mouse wheel scrolling
    onSimulatedScroll(event.deltaY);
});




function animatePosition(sphere, targetPosition, targetRotation, targetGroundPosition) {
    const duration = 2000; // Duration in milliseconds
    const startTime = Date.now();
    const startPosition = sphere.position.clone();
    const startRotation = sphere.rotation.clone(); // Store initial rotation

    const groundCir = sphere.children[1]; // Assuming the ground circle is the second child
    const startGroundPosition = groundCir.position.clone();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Interpolate position for the outer sphere
        sphere.position.set(
            THREE.MathUtils.lerp(startPosition.x, targetPosition.x, progress),
            THREE.MathUtils.lerp(startPosition.y, targetPosition.y, progress),
            THREE.MathUtils.lerp(startPosition.z, targetPosition.z, progress)
        );

        // Interpolate rotation for the outer sphere
        sphere.rotation.set(
            THREE.MathUtils.lerp(startRotation.x, targetRotation.x, progress),
            THREE.MathUtils.lerp(startRotation.y, targetRotation.y, progress),
            THREE.MathUtils.lerp(startRotation.z, targetRotation.z, progress)
        );

        // Interpolate position for the ground circle
        groundCir.position.set(
            THREE.MathUtils.lerp(startGroundPosition.x, targetGroundPosition.x, progress),
            THREE.MathUtils.lerp(startGroundPosition.y, targetGroundPosition.y, progress),
            THREE.MathUtils.lerp(startGroundPosition.z, targetGroundPosition.z, progress)
        );

        // Animation loop
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // After animation ends, set final rotation and ground position exactly to target
            sphere.rotation.set(targetRotation.x, targetRotation.y, targetRotation.z);
            groundCir.position.set(targetGroundPosition.x, targetGroundPosition.y, targetGroundPosition.z);
        }
    }

    animate();
}




window.addEventListener('scroll', () => {
    let currentScrollPosition = window.scrollY;

    if (!isHovering) {  // Only execute swap if not hovering over any sphere
        if (currentScrollPosition > previousScrollPosition) {
            swapPositionsUP();
        } else {
            swapPositionsDown();
        }
    }

    previousScrollPosition = currentScrollPosition;
});



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onPointerMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres);

    if (intersects.length > 0) {
        const hoveredSphere = intersects[0].object;
        isHovering = true;  // Set the hover flag to true

        if (hoveredSphere.position.equals(initialPosition)) {
            hoveredSphere.position.copy(hoverPosition);
        }
    } else {
        isHovering = false;  // Set the hover flag to false if no sphere is hovered
    }

    spheres.forEach(sphere => {
        if (sphere.position.equals(hoverPosition) && !isHovering) {
            sphere.position.copy(initialPosition); // Reset to initial position if mouse is not over the sphere
        }
    });
}

// Attach the pointer move event listener
window.addEventListener('mousemove', onPointerMove);
function checkIntersections() {
    // Calculate mouse position in normalized device coordinates
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the spheres
    const intersects = raycaster.intersectObjects(spheres);

    spheres.forEach(sphere => {
        // Reset to initial position if it's currently in hover position
        if (sphere.position.equals(hoverPosition) && intersects.length === 0) {
            sphere.position.copy(initialPosition);
        }
    });

    if (intersects.length > 0) {
        const hoveredSphere = intersects[0].object;

        // Change the position of the hovered sphere
        if (hoveredSphere.position.equals(initialPosition)) {
            hoveredSphere.position.copy(hoverPosition);
        }
    }
}



function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    checkIntersections();
}

animate();

scene.background = new THREE.Color("white");

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);


