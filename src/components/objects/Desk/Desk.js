import { Group, TextureLoader, Texture, MeshBasicMaterial, MeshPhongMaterial, MeshLambertMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import CHAIRMODEL from './chairscene.gltf';
require('./scene.bin');
require('./chairscene.bin');
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
                    // console.log(object.name);
                    object.material.dispose();
                    object.material = new MeshPhongMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.translateZ(-0.25);
        });

        loader.load(CHAIRMODEL, (gltf) => {
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    // console.log(object.name);
                    object.scale.set(0.1, 0.1, 0.1);
                    object.material.dispose();
                    object.material = new MeshPhongMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.translateY(8.2);
            gltf.scene.translateX(2.3);
            // console.log(gltf.scene.getWorldPosition());
            // console.log(gltf.scene.position);
        });
    }
}

export default Desk;
