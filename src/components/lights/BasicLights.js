import { Group, SpotLight, AmbientLight, HemisphereLight, PointLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        // const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        // const ambi = new AmbientLight(0x404040, 1.32);
        // const ambi = new AmbientLight(0x404040);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 1);

        // dir.position.set(5, 1, 2);
        // dir.target.position.set(0, 0, 0);

        // this.add(ambi, hemi, dir);
        // this.add(ambi);

        const ambi = new AmbientLight(0x404040, 1.32);

        // const point = new PointLight(0xffffff, 1, 100);
        const point = new PointLight(0xfcfbf7, 0.8, 100);
        point.position.set(0.5,2.5,0);

        this.add(ambi, point);
    }
}

export default BasicLights;
