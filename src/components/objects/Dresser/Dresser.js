import { Group, Vector3, TextureLoader, MeshBasicMaterial, MeshPhongMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import CLOSETMODEL from './closetscene.gltf';
require('./scene.bin');
require('./closetscene.bin');
const jpegPath = require('./wood.jpeg');

class Dresser extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const texture = new TextureLoader().load(jpegPath);
        
        const loader = new GLTFLoader();

        this.name = 'dresser';

        loader.load(MODEL, (gltf) => {
            // gltf.scene.scale.set(0.1, 0.1, 0.1);
            // console.log(gltf.scene);
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    // console.log(object.name);
                    object.scale.set(12, 12, 12);
                    object.material.dispose();
                    object.material = new MeshPhongMaterial( { map: texture } );
                    // object.material = new MeshBasicMaterial( { color: 0xffffff } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.translateZ(1.5);
        });

        loader.load(CLOSETMODEL, (gltf) => {
            gltf.scene.traverse( function(object) {    
                if ( object.isMesh ) {
                    object.scale.set(0.2,0.2,0.2);
                    object.material.dispose();
                    object.material = new MeshPhongMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.rotateY(Math.PI);
            gltf.scene.translateX(1.25);
            gltf.scene.translateZ(-1.7);
        });
    }
}

export default Dresser;
