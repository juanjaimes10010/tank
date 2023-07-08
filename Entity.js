import { Mesh, Vector3 } from "three";

class Entity {


    get collider() { return this._collider };
    get type() { return this._type };
    get shouldDispose() { return this._shouldDispose };

    constructor( { position = new Vector3(), type = "general" } = {} ) {
        
        this._mesh = new Mesh();
        this._position = position;
        this._mesh.position.copy( this._position );
        this._collider = false;
        this._type = type;
        this._shouldDispose = false;

    } 

    async load() { }

    update( deltaT ) { }

    dispose() {

        
    }

}

export { Entity }