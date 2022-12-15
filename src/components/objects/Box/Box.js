import { Group, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, MeshPhysicalMaterial, MeshPhongMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './mattress.gltf';
require('./scene.bin');
const pngPath = require('./tigerprint.jpeg');
const woodPath = require('./wood.jpeg');

class Box extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'box';


        const texture = new TextureLoader().load(pngPath);
        const frameTexture = new TextureLoader().load(woodPath);

        // ./src/components/objects/Box/
        // let object = new ArrayBuffer(MODEL);
        // console.log(object);
        // loader.parse(object, './scene.bin', (gltf) => {
        //     this.add(gltf.scene);
        // })

        const geometry = new BoxGeometry( 1.3, 0.5, 2.1 );
        const material = new MeshPhysicalMaterial( { map: frameTexture } );
        const bedframe = new Mesh( geometry, material );
        this.add( bedframe );
        bedframe.geometry.translate(-1.35,0.25,-0.95);

        loader.load(MODEL, (gltf) => {
            // console.log(gltf.scene);
            // gltf.scene.overrideMaterial = new MeshBasicMaterial( { map: texture } );
            // gltf.scene.overrideMaterial = new MeshBasicMaterial( { color: 0x974f3e } );
            // console.log(gltf.scene);
            gltf.scene.traverse( function(object) {
                if ( object.isMesh ) {
                    // console.log(object.name);
                    object.material.dispose();
                    object.material = new MeshPhongMaterial( { map: texture } );
                }
            } );
            this.add(gltf.scene);
            gltf.scene.rotateY(Math.PI/2);
            gltf.scene.translateY(0.5);
            gltf.scene.translateZ(-1.9);
            gltf.scene.translateX(0);
        });
    }


}

export default Box;