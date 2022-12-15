import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import LAUNDRY_BASKET from './laundry.gltf';
require('./laundry.bin');
require('./laundry_textures/material_0_baseColor.jpeg');


class Extras extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'extras';

        loader.load(LAUNDRY_BASKET, (gltf) => {
            this.add(gltf.scene);
            gltf.scene.rotateY(Math.PI*3/2)
            gltf.scene.translateY(0.4);
            gltf.scene.translateX(1.6);
        });
    }
}

export default Extras;
