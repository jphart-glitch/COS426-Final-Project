import { Group, Vector3, TextureLoader, MeshBasicMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
require('./scene.bin');
const jpegPath = require('./tigerprint.jpeg');

class Rug extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const texture = new TextureLoader().load(jpegPath);
        
        const loader = new GLTFLoader();

        this.name = 'rug';

        loader.load(MODEL, (gltf) => {
            // gltf.scene.scale.set(0.1, 0.1, 0.1);
            console.log(gltf.scene);
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    // console.log(object.name);
                    object.scale.set(0.5, 0.5, 0.5);
                    object.material.dispose();
                    object.material = new MeshBasicMaterial( { map: texture } );
                }
            } );
            // gltf.scene.scale.x = 0.1;
            // gltf.scene.scale.y = 0.1;
            // gltf.scene.scale.z = 0.1;
            this.add(gltf.scene);
            // gltf.scene.translateY(-20);
        });
    }
}

export default Rug;
