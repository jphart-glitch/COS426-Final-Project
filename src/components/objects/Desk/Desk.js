import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
require('./scene.bin');
require('./textures/DeskMaterial_baseColor.png');
require('./textures/DeskMaterial_metallicRoughness.png');
require('./textures/DeskMaterial_normal.png');

class Desk extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'desk';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }
}

export default Desk;
