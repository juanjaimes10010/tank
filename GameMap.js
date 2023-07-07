import { Mesh, MeshStandardMaterial, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { Entity } from "./Entity.js";
import { ResourceManager } from "./ResourceManager.js";

class MapTile extends Entity {

    constructor( { position = new Vector3() } = {} ) {

        super( { position } );

    }

    async load() {

        const texture = ResourceManager.instance.getGroundTexture();
        const geometry = new PlaneGeometry( 1, 1 );
        const material = new MeshStandardMaterial( { map: texture } );
        this._mesh.geometry = geometry;
        this._mesh.material = material;

    }
}

class GameMap extends Entity {

    constructor( { position = new Vector3(), size = 1 } = {}) {

        super( { position } );
        this._size = size;
        this._tiles = [];

        for(let i = 0; i < this._size; i++) {

            for(let j = 0; j < this._size; j++) {

                this._tiles.push( new MapTile( { position: new Vector3( i, j, 0 ) } ) );

            }
        }
        
    } 


    async load() {

        this._tiles.forEach( async tile => {
            
            await tile.load();
            this._mesh.add( tile._mesh );
            
        })

    }
}

export { GameMap };