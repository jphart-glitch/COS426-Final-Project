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
        // previous hitbox for player
        this.prevHitbox = new Box3(
            new Vector3(this.position.x - 0.5, this.position.y - 1.25, this.position.z - 0.5),
            new Vector3(this.position.x + 0.5, this.position.y + 0.5, this.position.z + 0.5),
        );
        // hitbox for player
        this.hitbox = new Box3(
            new Vector3(this.position.x - 0.5, this.position.y - 1.25, this.position.z - 0.5),
            new Vector3(this.position.x + 0.5, this.position.y + 0.5, this.position.z + 0.5),
        );
    }

    /* -------------------------------------------------------------- */
    /*                                                                */
    /* Hitbox update                                                  */
    /*                                                                */
    /* -------------------------------------------------------------- */

    updateHitbox() {
        this.prevHitbox = this.hitbox.clone();
        this.hitbox = new Box3(
            new Vector3(this.position.x - 0.2, this.position.y - 1.25, this.position.z - 0.2),
            new Vector3(this.position.x + 0.2, this.position.y + 0.5, this.position.z + 0.2),
        );
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

    // Handles collisions between character and a plane geometry
    handlePlaneCollision(plane) {

        // Initialize plane position from object
        let planeMesh = plane.mesh;
        let planePosition = planeMesh.position;

        // Can adjust as needed to reduce clipping
        const EPS = 0.03;

        if (this.position.y < planePosition.y + EPS) {
            this.position.y = planePosition.y + EPS;
        }
    }

    // Handles collisions between character and an object's bounding box 
    handleBoxCollision(box) {

        // Can adjust as needed to reduce clipping
        const EPS = 0.03;

        // Can adjust as needed to account for friction - not considered much in the scope
        // of this implementation, but can be used in the future
        const friction = 0.9;

        // Positions vectors accounting for no friction and friction respectively
        let posFriction = new Vector3();
        let posNoFriction = new Vector3();

        // If the character is inside the object's hitbox,
        // then "push" character to nearest outside face

        // Check if inside box; if not, do nothing
        let boundingBoxEPS = new Box3(box.min.subScalar(EPS), box.max.addScalar(EPS));
        if (!boundingBoxEPS.intersectsBox(this.hitbox)) return;
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
        if (!boundingBoxEPS.intersectsBox(this.prevHitbox)) {
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
        // this.position.y += 1.5;
    }

    handleRoomBoundary(box) {
        // Can adjust as needed to reduce clipping
        const EPS = 0.05;

        // If the character is inside the object's hitbox,
        // then "push" character to nearest outside face

        // Check if inside box; if not, do nothing
        let boundingBoxEPS = new Box3(box.min.subScalar(EPS), box.max.addScalar(EPS));

        if (!boundingBoxEPS.containsBox(this.hitbox)) {
            while(this.hitbox.min.x < boundingBoxEPS.min.x) {
                this.position.x += EPS;
                this.updateHitbox();
            }
            while(this.hitbox.min.y < boundingBoxEPS.min.y) {
                this.position.y += EPS;
                this.updateHitbox();
            }
            while(this.hitbox.min.z < boundingBoxEPS.min.z) {
                this.position.z += EPS;
                this.updateHitbox();
            }
            while(this.hitbox.max.x > boundingBoxEPS.max.x) {
                this.position.x -= EPS;
                this.updateHitbox();
            }
            while(this.hitbox.max.y > boundingBoxEPS.max.y) {
                this.position.y -= EPS;
                this.updateHitbox();
            }
            while(this.hitbox.max.z > boundingBoxEPS.max.z) {
                this.position.z -= EPS;
                this.updateHitbox();
            }
        }
    }

    /* -------------------------------------------------------------- */
    /*                                                                */
    /* Object selection handling functions                            */
    /*                                                                */
    /* -------------------------------------------------------------- */

    // Chooses closer intersection distance among the two given
    chooseCloserIntersection(len, best_dist) {
        if (best_dist <= len) return best_dist;
        return len;
    }

    // Intersects ray with plane; returns infinity if no intersection
    // or the intersection and distance if there is one
    findIntersectionWithPlane(origin, direction, planeNormal, dist) {
        let a = direction.dot(planeNormal);
        let b = origin.dot(planeNormal) - dist;

        if (a == 0) {
            return {intersect: new Vector3(Infinity, Infinity, Infinity), len: Infinity};
        }

        let len = -b / a;
        if (len == 0) {
            return {intersect: new Vector3(Infinity, Infinity, Infinity), len: Infinity};
        }

        let intersect = origin.clone().add(direction.clone().multiplyScalar(len));
        let intersection = {intersect: intersect, len: len}
        return intersection;
    }

    // Checks for intersection of ray and object hitbox; returns infinity
    // if no intersection or the closest intersection if there is one
    lookingAtObject(direction, box) {
        // Set up base case for best_dist
        let best_dist = Infinity;
        // Initialize pmin and pmax
        let pmin = box.min;
        let pmax = box.max;
        // Initialize all front-faces
        let faces = new Array();
        // Side with plane equation x = pmax.x
        faces.push(new Vector3(pmax.x, pmin.y, pmin.z));
        // Side with plane equation y = pmax.y
        faces.push(new Vector3(pmin.x, pmax.y, pmin.z));
        // Side with plane equation z = pmax.z
        faces.push(new Vector3(pmin.x, pmin.y, pmax.z));
        
        // Loop through all front-facing faces
        for (let i = 0; i < faces.length; i++) {
            // Initialize points on current face
            let p = faces[i];
            // Calculate plane normal and distance from ray origin to plane
            let planeNormal = p.clone().sub(pmin).normalize();
            let d = planeNormal.dot(p);
            // Find intersection
            let intersection = this.findIntersectionWithPlane(this.position, direction, planeNormal, d);
            let intersect = intersection.intersect;
            let len = intersection.len;
            // If the intersection is inside the rectangle, update the value of best_dist and best_intersect as needed
            if (box.containsPoint(intersect)) {
                best_dist = this.chooseCloserIntersection(len, best_dist);
            }
        }

        // Initialize all back-faces
        faces = new Array();
        // Side with plane equation x = pmin.x
        faces.push(new Vector3(pmin.x, pmax.y, pmax.z));
        // Side with plane equation y = pmin.y
        faces.push(new Vector3(pmax.x, pmin.y, pmax.z));
        // Side with plane equation z = pmin.z
        faces.push(new Vector3(pmax.x, pmax.y, pmin.z));
        
        // Loop through all front-facing faces
        for (let i = 0; i < faces.length; i++) {
            // Initialize points on current face
            let p = faces[i];
            // Calculate plane normal and distance from ray origin to plane
            let planeNormal = p.clone().sub(pmax).normalize();
            let d = planeNormal.dot(p);
            // Find intersection
            let intersection = this.findIntersectionWithPlane(this.position, direction, planeNormal, d);
            let intersect = intersection.intersect;
            let len = intersection.len;
            // If the intersection is inside the rectangle, update the value of best_dist and best_intersect as needed
            if (box.containsPoint(intersect)) {
                best_dist = this.chooseCloserIntersection(len, best_dist);
            }
        }
        // Return closest intersection distance or INFINITY if none exist
        return best_dist;
    }

}