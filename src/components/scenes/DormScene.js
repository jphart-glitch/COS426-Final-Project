import * as Dat from 'dat.gui';
import { Scene, Color, TetrahedronGeometry } from 'three';
import { Flower, Land, Mattress } from 'objects';
import { BasicLights } from 'lights';
import Box from '../objects/Box/Box';
import { Desk, Room } from '../objects';
// import { Mattress } from '../objects/Mattress';

class DormScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
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

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default DormScene;