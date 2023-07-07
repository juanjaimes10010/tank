import { Vector3 } from "three";
import { Entity } from "./Entity.js";
import { ResourceManager } from "./ResourceManager.js";

class PlayerTank extends Entity {


    constructor( { position = new Vector3() } = {} ) {

        super( { position })

    }

    async load() {
        const tankModel = ResourceManager.instance.getModel( "tank" );

        if( !tankModel ) throw "unable to get tank model";

        const tankBodyMesh = tankModel.scene.children.find( m => m.name === "Body") as Mesh;

    }
}