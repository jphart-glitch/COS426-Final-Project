/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, DormScene } from 'scenes';

// Initialize core ThreeJS components
// EDITED: To make "normal" again, replace DormScene() with SeedScene()
const scene = new DormScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// STUDENT CODE: Take a point in local DOM coordinates and convert it to world coordinates
// Adapted from concept discussed here: https://discourse.threejs.org/t/project-a-2d-screen-point-to-3d-world-point/5713
function DOMToWorld(clientX, clientY) {
    let vec = new Vector3();
    // Convert from local DOM coordinates to NDC coordinates
    vec.set((clientX / window.innerWidth) * 2 - 1, - (clientY / window.innerHeight) * 2 + 1, 0.5);
    // Convert from NDC coordinates to world coordinates
    vec.unproject(camera);
    // Get the direction vector to the world coord point from the camera
    vec.sub(camera.position).normalize();
    // Calculate how far to travel along the direction vector
    let distance = camera.position.z - vec.z;
    // Calculate the position that lies on the direction vector and is at correct z level
    let pos = camera.position.clone().add(vec.multiplyScalar(distance));
    return pos;
}

// STUDENT CODE (BUGGY, NOT WORKING): Update camera position based on key input
// Add event listener for key presses
window.addEventListener(
    "keydown",
    handleKeydown
);

// Function for handling key presses
function handleKeydown(event) {

    // Mapping of camera movement vectors
    const moveMap = {
        ArrowUp: new Vector3(0, 0, 1),
        ArrowDown: new Vector3(0, 0, -1),
        ArrowLeft: new Vector3(1, 0, 0),
        ArrowRight: new Vector3(-1, 0, 0),
        " ": new Vector3(0, 1, 0)
    }
    // Scale to adjust movement vectors by
    const scale = 1;

    // If the arrow keys are pressed, move the camera in the correct direction
    if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == " ") {
        let newCameraPos = camera.position.clone().add(moveMap[event.key].clone().multiplyScalar(scale));
        camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
    }
}
// END STUDENT CODE

// STUDENT CODE (BUGGY, NOT WORKING): UPDATE CAMERA LOOK AT BASED ON MOUSE MOVEMENT
// Add event listener for key presses
window.addEventListener(
    "mousemove",
    handleMouseMove
);

// Function for handling mouse movements
function handleMouseMove(event) {

    let currFocus = new Vector3();
    camera.getWorldDirection(currFocus);
    let worldPoint = DOMToWorld(event.clientX, event.clientY);
    // camera.lookAt(worldPoint);
}
// END STUDENT CODE

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
