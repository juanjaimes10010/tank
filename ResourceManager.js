import { TextureLoader } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ResourceManager {

    static _instance = new ResourceManager();
    
    static get instance() { return this._instance; }

    constructor() {

        this._groundTextures = [];
        this._models = new Map();
        this._textures = new Map();

    }

    getModel( modelName ) {

        return this._models.get( modelName );

    }

    getTexture( textureName ) {

        return this._textures.get( textureName );
        
    }


    async load() {

        const textureLoader = new TextureLoader();
        const modelLoader = new GLTFLoader();

        await this.loadGroundTextures( textureLoader );
        await this.loadTankTextures( textureLoader );
        await this.loadModels( modelLoader );
    }

    async loadModels( modelLoader) {

        const playerTank = await modelLoader.loadAsync( "./models/tank.glb" );
        this._models.set( "tank", playerTank );

    }

    async loadTankTextures( textureLoader ) {

        const tankBodyTexture = await textureLoader.loadAsync( "./textures/tank-body.png" );
        const tankTurretTexture = await textureLoader.loadAsync( "./textures/tank-turret.png" );

        this._textures.set( "tank-body", tankBodyTexture );
        this._textures.set( "tank-turret", tankTurretTexture );


        const wallTexture = await textureLoader.loadAsync( "./textures/wall.png" );

        this._textures.set( "wall", wallTexture );

    }

    async loadGroundTextures( textureLoader ) {
        const textures = [
            "grass_rock.jpg",
            "jungle_stone.jpg"
        ];
        
        textures.forEach( async texture => { 
            const t = await textureLoader.loadAsync( `./textures/${ texture }` )
            this._groundTextures.push( t )
        });

    }

    getGroundTexture() {

        return this._groundTextures[ Math.floor( Math.random() * this._groundTextures.length )];

    }
      
}

export { ResourceManager };