import { PerspectiveCamera, Vector3, Box3 } from 'three';

export default class Player extends PerspectiveCamera {
    constructor(fov=50, aspect=1, near=0.1, far=2000) {
        // Call parent PerspectiveCamera() constructor
        super(fov, aspect, near, far);

        // character hitbox
        this.boundingBox = new Box3(
                new Vector3(this.position.x - 1, this.position.y - 1, this.position.z - 1),
                new Vector3(this.position.x + 1, this.position.y + 1, this.position.z + 1));
        // speed of character's movement
        this.velocity = new Vector3(0, 0, 0);
        // check if character is currently moving
        this.moving = false;
        // point in 3D space where camera is looking at
        this.lookingAt = new Vector3(0, 0, 0);
    }

    updatePos(x, y, z) {
        this.position.set(x, y, z);
        this.boundingBox = new Box3(
            new Vector3(this.position.x - 1, this.position.y - 1, this.position.z - 1),
            new Vector3(this.position.x + 1, this.position.y + 1, this.position.z + 1));
    }
}