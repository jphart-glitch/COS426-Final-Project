/* ------------------------------------------------------------------ */
/*                                                                    */
/* app.js                                                             */
/* Authors: John Hart and Hitesha Ukey                                */
/*                                                                    */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/*                                                                    */
/* Import statements                                                  */
/*                                                                    */
/* ------------------------------------------------------------------ */

import { WebGLRenderer, Vector2, Vector3, Box3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { LoadingManager } from 'three/src/loaders/LoadingManager.js';
import { default as Player } from './components/camera/Player.js';
import { DormScene } from 'scenes';

/* ------------------------------------------------------------------ */
/*                                                                    */
/* Scene setup                                                        */
/*                                                                    */
/* ------------------------------------------------------------------ */

// Set up loading screen
const loading_screen = document.createElement('div');
const loading_text = document.createElement('h1');
loading_text.style.position = 'absolute';
loading_text.style.top = '50%';
loading_text.style.left = '50%';
loading_text.style.fontSize = '50px';
loading_text.style.color = 'white';
loading_text.style.transform = 'translate(-50%, -150%)'
loading_text.appendChild(document.createTextNode("Loading..."));
loading_screen.appendChild(loading_text);
loading_screen.style.position = 'fixed';
loading_screen.style.display = 'none';
loading_screen.style.width = '100%';
loading_screen.style.height = '100%';
loading_screen.style.top = '0';
loading_screen.style.left = '0';
loading_screen.style.right = '0';
loading_screen.style.bottom = '0';
loading_screen.style.backgroundColor = 'rgba(0,0,0,1)';
loading_screen.style.zIndex = '2';
loading_screen.style.cursor = 'pointer';
loading_screen.style.userSelect = 'none';
document.body.appendChild(loading_screen);

// Instantiate loading manager
const manager = new LoadingManager();
// When loading starts, display loading screen
manager.onStart = function(url, itemsLoaded, itemsTotal) {
    console.log("Loading scene...");
    loading_screen.style.display = 'block';
};
// When loading finishes, get rid of loading screen
manager.onLoad = function() {
    console.log("Loading complete!");
    loading_screen.style.display = 'none';
}

// Load scene
const loader = new OBJLoader(manager);
loader.load("./components/scenes/DormScene.js", function(object) {
});

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

// Add pause menu and its CSS adjustments
const overlay = document.createElement('div');
const text = document.createElement('h1');

// If I could just do this, it would get rid of the ugly mess below
// overlay.setAttribute('class', 'pause-menu-text');
text.style.position = 'absolute';
text.style.top = '50%';
text.style.left = '50%';
text.style.fontSize = '50px';
text.style.color = 'white';
text.style.transform = 'translate(-50%, -150%)'
text.appendChild(document.createTextNode("Late to Class!")); //changed from Paused to Start
overlay.appendChild(text);
// If I could just do this, it would get rid of the ugly mess below
// overlay.setAttribute('class', 'pause-menu');
overlay.style.position = 'fixed';
overlay.style.display = 'block';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.right = '0';
overlay.style.bottom = '0';
overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
overlay.style.zIndex = '2';
overlay.style.cursor = 'pointer';
overlay.style.userSelect = 'none';
document.body.appendChild(overlay);

// Start menu
// text.removeChild(text.firstChild);
// console.log(text.firstChild);
const button = document.createElement('button');
button.appendChild(document.createTextNode('Start Here'))
button.style.position = 'absolute';
button.style.top = '55%';
button.style.left = '45%';
overlay.appendChild(button);

const printtoconsole = function() {
    controls.lock();
};

button.onclick = printtoconsole;

// Set up camera
camera.position.set(10, 1,5, 0);
camera.lookAt(new Vector3(0, 0, 0));

/* ------------------------------------------------------------------ */
/*                                                                    */
/* Misc global variables                                              */
/*                                                                    */
/* ------------------------------------------------------------------ */

// Functions for handling key presses
var keyPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
    Shift: {
        "1": false,
        "2": false
    },
    " ": false,
    "Escape": true
};


/* ------------------------------------------------------------------ */
/*                                                                    */
/* Controls setup                                                     */
/*                                                                    */
/* ------------------------------------------------------------------ */

// Initialize controls
var controls = new PointerLockControls(camera, document.body);
// When the document is clicked on, lock the pointer in a pseudo-fullscreen mode

// When the pointer is locked, get rid of the pause menu
controls.addEventListener( 
    'lock',
    function () {
	    overlay.style.display = 'none';
        keyPressed["Escape"] = !keyPressed["Escape"];
    }
);
// When the pointer is unlocked, bring up the pause menu
controls.addEventListener( 
    'unlock',
    function () {
	    overlay.style.display = 'block';
        button.removeChild(button.firstChild);
        button.appendChild(document.createTextNode('Return to Game'));
        // If crouched, uncrouch upon exiting pause menu
        if (keyPressed["Shift"[2]]) camera.handleCrouch();
        // Switch all states off
        keyPressed["w"] = false;
        keyPressed["a"] = false;
        keyPressed["s"] = false;
        keyPressed["d"] = false;
        keyPressed["Shift"[1]] = false;
        keyPressed["Shift"[2]] = false;
        keyPressed[" "] = false;
        keyPressed["Escape"] = !keyPressed["Escape"];
    }
);

/* ------------------------------------------------------------------ */
/*                                                                    */
/* Misc event listeners                                               */
/*                                                                    */
/* ------------------------------------------------------------------ */

// Add event listener for key presses (holding down and letting go)
document.addEventListener(
    'keydown',
    handleKeydown
);
document.addEventListener(
    'keyup',
    handleKeyup
);

/* ------------------------------------------------------------------ */
/*                                                                    */
/* Event handlers                                                     */
/*                                                                    */
/* ------------------------------------------------------------------ */

// Handle pressing the key
function handleKeydown(event) {

    // If game is paused, do nothing further
    if (keyPressed["Escape"]) return;

    // If a movement key is pressed, switch state of that keyPressed value
    if (event.key == "w" || event.key == "a" || 
    event.key =="s" || event.key == "d") {
        keyPressed[event.key] = true;
    }

    // If a shift key, switch state of that keyPressed value
    if (event.key == "Shift") {
        keyPressed[event.key[event.location]] = true;
        // If the right shift key, make the camera handle crouching
        if (event.location == 2) camera.handleCrouch();
    }

    // If the space key and player is not crouching, switch state of jumping and set initial state of velocity
    if(event.key == " ") {
        keyPressed[event.key] = true;
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

    // If game is paused, do nothing further
    if (keyPressed["Escape"]) return;

    // If a movement key is pressed, switch state of that keyPressed value
    if (event.key == "w" || event.key == "a" || 
    event.key =="s" || event.key == "d") {
        keyPressed[event.key] = false;
    }

    // If a shift key, switch state of that keyPressed value and call relevant handler function
    if (event.key == "Shift") {
        keyPressed[event.key[event.location]] = false;
        // If the right shift key, make the camera handle crouching
        if (event.location == 2) camera.handleCrouch();
    }

    // If space bar is pressed, switch state of that keyPressed value
    if (event.key == " ") {
        keyPressed[event.key] = false;
    }

}

// Handle movement using verlet integration
function movePlayer() {

    // If game is paused, do nothing further
    if (keyPressed["Escape"]) return;

    // Scale to adjust lateral movement by
    let speed = 0.1;

    // If left shift (sprint key) is held down, increase speed
    if (keyPressed["Shift"["1"]]) {
        speed *= 5 / 2;
    }

    // If right shift (crouch key) is held down, decrease speed
    if (keyPressed["Shift"["2"]]) {
        speed /= 2;
    }


    // Check for lateral movement key input; if detected, call relevant handler function
    if (keyPressed["w"]) {
        controls.moveForward(speed);
    }
    if (keyPressed["s"]) {
        controls.moveForward(-speed);
    }
    if (keyPressed["a"]) {
        controls.moveRight(-speed);
    }
    if (keyPressed["d"]) {
        controls.moveRight(speed);
    }

    // If the space bar (jump key) is pressed, call relevant handler function
    if (keyPressed[" "] || camera.jumping) {
        camera.handleJump();
    }
}

// Calls relevant handler function for any collisions
function handleCollisions() {

    // If game is paused, do nothing further
    if (keyPressed["Escape"]) return;

    scene.traverse( function(obj) {
        let box = new Box3().setFromObject(obj);
        camera.handleBoxCollision(box);
    });
}

/* ------------------------------------------------------------------ */
/*                                                                    */
/* Rendering and resizing                                             */
/*                                                                    */
/* ------------------------------------------------------------------ */

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
