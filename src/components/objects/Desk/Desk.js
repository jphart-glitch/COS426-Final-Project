import { Group, TextureLoader, Texture, MeshBasicMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
require('./scene.bin');
const jpegPath = require('./wood.jpeg');

class Desk extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const texture = new TextureLoader().load(jpegPath);

        const loader = new GLTFLoader();

        this.name = 'desk';

        loader.load(MODEL, (gltf) => {
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    console.log(object.name);
                    object.material.dispose();
                    object.material = new MeshBasicMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
        });
    }
}

export default Desk;
