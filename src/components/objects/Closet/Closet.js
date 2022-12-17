import { Group, TextureLoader, MeshPhongMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
require('./scene.bin');
const wood = require('./wood.jpeg');

class Closet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'closet';

        const texture = new TextureLoader().load(wood);

        loader.load(MODEL, (gltf) => {
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    object.material.dispose();
                    object.material = new MeshPhongMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.rotateY(Math.PI);
            gltf.scene.translateY(1);
            gltf.scene.translateX(1);
            gltf.scene.translateZ(-1.65);
        });
    }
}

export default Closet;
