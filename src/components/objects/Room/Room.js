import { Group, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, MeshPhongMaterial, Euler, SphereGeometry, Vector3, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from './mattress.gltf';
const jpegPath = require('./floortexture.jpeg');

class Room extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'room';

        const geometry = new PlaneGeometry(4, 3);
        const geometryside = new PlaneGeometry(5,3);
        const material = new MeshPhongMaterial( { color: 0xffffff, side: DoubleSide } );
        
        const texture = new TextureLoader().load(jpegPath);
        // const floormat = new MeshPhongMaterial( { color: 0xd1935b, side: DoubleSide } );
        const floormat = new MeshPhongMaterial( { map: texture, side: DoubleSide } );
        const floorgeom = new PlaneGeometry(5, 4);
        const floor = new Mesh(floorgeom, floormat);
        floor.geometry.rotateX(Math.PI/2);
        // floor.rotateOnWorldAxis(new Vector3(1,0,0), Math.PI/2);

        const wall1 = new Mesh( geometryside.clone(), material.clone() );
        const wall2 = new Mesh(geometryside.clone(), material.clone());
        const wall3 = new Mesh(geometry.clone(), material.clone());
        wall3.geometry.rotateY(Math.PI/2);
        const wall4 = new Mesh(geometry.clone(), material.clone());
        wall4.geometry.rotateY(Math.PI/2);

        // this.add( wall1, floor, wall2, wall3, wall4 );
        this.add( wall1, floor, wall2, wall3 );
        // this.add(floor);

        floor.geometry.translate(0.5, 0, 0)
        wall1.geometry.translate(0.5, 1.5, 2);
        wall2.geometry.translate(0.5, 1.5, -2);
        wall3.geometry.translate(-2, 1.5, 0);
        wall4.geometry.translate(3, 1.5, 0);

        const g = new SphereGeometry(0.05);
        const m = new MeshPhongMaterial( { color: 0x000000 } );
        const center = new Mesh(g, m);

        this.add(center);
    }


}

export default Room;
