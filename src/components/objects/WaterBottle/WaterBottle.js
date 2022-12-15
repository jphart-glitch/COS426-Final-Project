import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
require('./scene.bin');
require('./textures/Water_Bottle_Lid_baseColor.png');
require('./textures/Water_Bottle_Lid_metallicRoughness.png');
require('./textures/Water_Bottle_Lid_normal.png');
require('./textures/Water_Bottle_Metal_Part_baseColor.png');
require('./textures/Water_Bottle_Metal_Part_metallicRoughness.png');
require('./textures/Water_Bottle_Metal_Part_normal.png');
require('./textures/Water_Bottle_Yellow_Part_baseColor.png');
require('./textures/Water_Bottle_Yellow_Part_metallicRoughness.png');
require('./textures/Water_Bottle_Yellow_Part_normal.png');

class WaterBottle extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'waterbottle';

        loader.load(MODEL, (gltf) => {
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    object.scale.set(0.015, 0.015, 0.015);
                }
            } );
            this.add(gltf.scene);
            gltf.scene.translateY(0.73);
            gltf.scene.translateZ(-1.5);
        });
    }
}

export default WaterBottle;
