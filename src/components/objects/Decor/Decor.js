import { Group, MeshBasicMaterial, MeshPhysicalMaterial, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const pton = require('./princeton.jpeg');

class Decor extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'decor';

    //     const texture = new TextureLoader().load(pton);

    //     loader.load(MODEL, (gltf) => {
    //         gltf.scene.traverse( function(object) {
    //             if ( object.isMesh ) {
    //                 object.scale.set(0.6, 0.6, 0.6);
    //                 object.material.dispose();
    //                 object.material = new MeshPhysicalMaterial( { map: texture } );
    //             }
    //         } );
    //         this.add(gltf.scene);
    //     });
    }
}

export default Decor;
