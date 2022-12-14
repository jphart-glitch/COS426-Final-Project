import { Group, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, Texture } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './mattress.gltf';
require('./scene.bin');
const pngPath = require('./floral.png');

class Box extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'box';


        const texture = new TextureLoader().load(pngPath);

        // ./src/components/objects/Box/
        // let object = new ArrayBuffer(MODEL);
        // console.log(object);
        // loader.parse(object, './scene.bin', (gltf) => {
        //     this.add(gltf.scene);
        // })

        // const geometry = new BoxGeometry( 1, 1, 1 );
        // const material = new MeshBasicMaterial( { map: texture } );
        // const cube = new Mesh( geometry, material );
        // this.add( cube );

        loader.load(MODEL, (gltf) => {
            // console.log(gltf.scene);
            // gltf.scene.overrideMaterial = new MeshBasicMaterial( { map: texture } );
            // gltf.scene.overrideMaterial = new MeshBasicMaterial( { color: 0x974f3e } );
            // console.log(gltf.scene);
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    object.material.dispose();
                    object.material = new MeshBasicMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.rotateY(Math.PI);
            gltf.scene.translateX(0);
        });
    }


}

export default Box;