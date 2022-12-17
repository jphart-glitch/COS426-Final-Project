import { Group, TextureLoader, MeshPhysicalMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import LAUNDRY_BASKET from './laundry.gltf';
require('./laundry.bin');
require('./textures/material_0_baseColor.jpeg');
import RUG from './rug.gltf';
require('./rug.bin');
const pngPath = require('./pattern.png');


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

        const texture = new TextureLoader().load(pngPath);

        loader.load(RUG, (gltf) => {
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    object.material.dispose();
                    object.material = new MeshPhysicalMaterial( { map: texture } );
                    object.scale.set(0.1, 0.1, 0.1);
                }
            } );
            this.add(gltf.scene);
            // gltf.scene.rotateY(Math.PI*3/2)
            gltf.scene.translateY(0.05);
            gltf.scene.translateX(1.2);
        });
    }
}

export default Extras;
