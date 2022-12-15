import * as Dat from 'dat.gui';
import { Scene, Color, TetrahedronGeometry } from 'three';
import { Flower, Land, Mattress } from 'objects';
import { BasicLights } from 'lights';
import { BoxHelper } from 'three/src/helpers/BoxHelper.js';
import Box from '../objects/Box/Box';
import { Closet, Decor, Desk, Dresser, Room, Rug, WaterBottle } from '../objects';
// import { Mattress } from '../objects/Mattress';

class DormScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        // const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        // land.position.x = 1;
        // this.add(land, flower, lights);
        // const mattress = new Mattress();
        // mattress.position.x = 3;
        // mattress.position.z = 3;
        const box = new Box;
        this.add(box);
        // box.position.x = 1;
        // box.position.z = 1;
        const room = new Room();
        this.add(room, lights);
        const desk = new Desk();
        this.add(desk);
        // const rug = new Rug();
        // this.add(rug);
        // const dresser = new Dresser();
        // const boxHelper = new BoxHelper(dresser, 0xffff00);
        // this.add(dresser);
        // this.add(boxHelper);
        // const decor = new Decor();
        // this.add(decor);
        const wb = new WaterBottle();
        this.add(wb);
        const closet = new Closet();
        this.add(closet);

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default DormScene;