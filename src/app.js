/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, Vector2, Vector3, Box3 } from 'three';
import { default as Player } from './components/camera/Player.js';
import { DormScene } from 'scenes';

// Initialize core ThreeJS components
const scene = new DormScene();
const camera = new Player();
const renderer = new WebGLRenderer({ antialias: true });

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Add event listener for mouse movement
window.addEventListener(
    "mousemove",
    handleMouseMove
);

// Add event listener for key presses (holding down and letting go)
window.addEventListener(
    "keydown",
    handleKeydown
);
window.addEventListener(
    "keyup",
    handleKeyup
);

// Handle mouse movement (looking around the scene)
function handleMouseMove(event) {
    let point = new Vector2(event.clientX, event.clientY);
    camera.handleLook(point, canvas.width, canvas.height);
}

// Functions for handling key presses
var keyPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Shift: {
        "1": false,
        "2": false
    },
    " ": false
};

// Handle pressing the key
function handleKeydown(event) {

    // If an arrow key, switch state of that keyPressed value
    if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == " ") {
        keyPressed[event.key] = true;
    }

    // If a shift key, switch state of that keyPressed value
    if (event.key == "Shift") {
        keyPressed[event.key[event.location]] = true;
        // If the left shift key, make the camera handle crouching
        if (event.location == 1) camera.handleCrouch();
    }

    // If the space key and player is not crouching, switch state of jumping and set initial state of velocity
    if (event.key == " ") {
        if (!camera.jumping) {
            const JUMP_HEIGHT = 0.2;
            camera.jumping = true;
            camera.jumpY = camera.position.y;
            camera.velocity = -JUMP_HEIGHT;
        }
    }
}

// Handle letting go of the key
function handleKeyup(event) {

    // If an arrow key, space bar, or shift key is pressed, move the camera in the correct direction
    if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == " ") {
        keyPressed[event.key] = false;
    }
    if (event.key == "Shift") {
        keyPressed[event.key[event.location]] = false;
        // If the left shift key, make the camera handle crouching
        if (event.location == 1) camera.handleCrouch();
    }
}

// Handle movement using verlet integration
function movePlayer() {

    // Scale to adjust lateral movement by
    let speed = 0.1;

    // If right shift (sprint key) is held down, increase speed
    if (keyPressed["Shift"["2"]]) {
        speed = 0.25;
    }

    // If left shift (crouch key) is held down, decrease speed
    if (keyPressed["Shift"["1"]]) {
        speed /= 2;
    }

    // Check for lateral movement key input; if detected, call relevant handler function
    if (keyPressed["ArrowUp"]) {
        camera.moveForward(speed);
    }
    if (keyPressed["ArrowDown"]) {
        camera.moveBackward(speed);
    }
    if (keyPressed["ArrowLeft"]) {
        camera.moveLeft(speed);
    }
    if (keyPressed["ArrowRight"]) {
        camera.moveRight(speed);
    }

    // If the space bar (jump key) is pressed, call relevant handler function
    if (keyPressed[" "] || camera.jumping) {
        camera.handleJump();
    }
}

// Calls relevant handler function for any collisions
function handleCollisions() {
    scene.traverse( function(obj) {
        let box = new Box3().setFromObject(obj);
        camera.handleBoxCollision(box);
    });
}

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    movePlayer();
    handleCollisions();
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
