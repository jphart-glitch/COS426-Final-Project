/* ------------------------------------------------------------------ */
/*                                                                    */
/* Player.js                                                          */
/* Authors: John Hart and Hitesha Ukey                                */
/*                                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*                                                                    */
/* Import statements                                                  */
/*                                                                    */
/* ------------------------------------------------------------------ */

import { PerspectiveCamera, Vector3, Box3 } from 'three';

export default class Player extends PerspectiveCamera {

    /* -------------------------------------------------------------- */
    /*                                                                */
    /* Constructor                                                    */
    /*                                                                */
    /* -------------------------------------------------------------- */
    constructor(fov=50, aspect=1, near=0.1, far=2000) {
        // Call parent PerspectiveCamera() constructor
        super(fov, aspect, near, far);

        // check if player is currently jumping
        this.jumping = false;
        // y position of player when last jump occurred
        this.jumpY = 0;
        // check if player is currently crouching
        this.crouching = false;
        // player's velocity (used only in jumping calculations)
        this.velocity = 0;
        // previous position used to readjust camera view dynamically
        this.prevPosition = new Vector3(0, 0, 0);
    }

    /* -------------------------------------------------------------- */
    /*                                                                */
    /* Misc movement functions                                        */
    /*                                                                */
    /* -------------------------------------------------------------- */

    // Handles the player's jumping based on jump arc
    handleJump() {
        const GRAVITY = 0.01;
        this.velocity += GRAVITY;

        let oldPos = this.position.clone();
        this.position.y -= this.velocity;
        this.prevPosition = oldPos;

        if (this.position.y < this.jumpY) {
            this.position.y = this.jumpY;
            this.jumping = false;
        }
    }

    // Handles the player's crouching (switches in and out of crouch state)
    handleCrouch() {
        if (!this.crouching) {
            let oldPos = this.position.clone();
            this.crouching = true;
            this.position.y /= 2;
            this.prevPosition = oldPos;
        }
        else {
            let oldPos = this.position.clone();
            this.crouching = false;
            this.position.y *= 2;
            this.prevPosition = oldPos;
        }
    }

    /* -------------------------------------------------------------- */
    /*                                                                */
    /* Collision handling functions                                   */
    /*                                                                */
    /* -------------------------------------------------------------- */

    // Handles collisions between character and an object's bounding box 
    handleBoxCollision(box) {

        // Can adjust as needed to reduce clipping
        const EPS = 0.1;

        // Can adjust as needed to account for friction - not considered much in the scope
        // of this implementation, but can be used in the future
        const friction = 0.9;

        // Positions vectors accounting for no friction and friction respectively
        let posFriction = new Vector3();
        let posNoFriction = new Vector3();

        // If the character is inside the object's hitbox,
        // then "push" character to nearest outside face

        // Check if inside box; if not, do nothing
        let boundingBoxEPS = new Box3(box.clone().min.subScalar(EPS), box.clone().max.addScalar(EPS));
        if (!boundingBoxEPS.containsPoint(this.position)) return;
        // If so, compute posNoFriction - projection of the particle’s current position to the nearest point on the box's nearest face
        let faces = new Array();
        posNoFriction = new Vector3(boundingBoxEPS.min.x, this.position.y, this.position.z);
        faces.push(new Vector3(this.position.x, boundingBoxEPS.min.y, this.position.z));
        faces.push(new Vector3(this.position.x, this.position.y, boundingBoxEPS.min.z));
        faces.push(new Vector3(boundingBoxEPS.max.x, this.position.y, this.position.z));
        faces.push(new Vector3(this.position.x, boundingBoxEPS.max.y, this.position.z));
        faces.push(new Vector3(this.position.x, this.position.y, boundingBoxEPS.max.z));
        for (let i = 0; i < 5; i++) {
            if (this.position.distanceTo(faces[i]) < this.position.distanceTo(posNoFriction)) {
                posNoFriction = faces[i];
            }
        }
        // If the particle was outside the box before, account for friction
        if (!boundingBoxEPS.containsPoint(this.position)) {
            posFriction = this.prevPosition.clone().multiplyScalar(friction);
            posNoFriction.multiplyScalar(1.0 - friction);
            posFriction.add(posNoFriction);
            this.position.x = posFriction.x;
            this.position.y = posFriction.y;
            this.position.z = posFriction.z;
        }
        // Else do not account for friction
        else {
            this.position.x = posNoFriction.x;
            this.position.y = posNoFriction.y;
            this.position.z = posNoFriction.z;
        };
    }

}