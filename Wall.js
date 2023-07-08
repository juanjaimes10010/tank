import { Box3, BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
import { Entity } from "./Entity.js";
import { ResourceManager } from "./ResourceManager.js";

class Wall extends Entity {

    constructor( { position = new Vector3() } ) {

        super( { position } );
    }

    load() {

        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshStandardMaterial( { map: ResourceManager.instance.getTexture( "wall" ) } );
        this._mesh.geometry = geometry;
        this._mesh.material = material;

        this._collider = new Box3().setFromObject( this._mesh );

    }

}

export { Wall };