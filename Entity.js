import { Mesh, Vector3 } from "three";

class Entity {

   

    constructor( { position = new Vector3() } = {} ) {
        
        this._mesh = new Mesh();
        this._position = position;
        this._mesh.position.copy( this._position );

    } 

    async load() {


    }

    update() {


    }

}

export { Entity }