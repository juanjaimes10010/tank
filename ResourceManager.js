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
        await this.loadGroundTextures( textureLoader );
        await this.loadTankTextures( textureLoader );
    }

    async loadModels() {

        const modelLoader = new GLTFLoader();
        const playerTank = await modelLoader.loadAsync( "tank/models/tank.glb" );
        this._models.set( "tank", playerTank )

    }

    async loadTankTextures( textureLoader ) {

        const tankBodyTexture = await textureLoader.loadAsync( "tank/textures/tank-body.png" );
        const tankTurretTexture = await textureLoader.loadAsync( "tank/textures/tank-turret.png" );

        this._textures.set( "tank-body", tankBodyTexture );
        this._textures.set( "tank-turret", tankTurretTexture );

    }

    async loadGroundTextures( textureLoader ) {
        const textures = [
            "grass_rock.jpg",
            "jungle_stone.jpg"
        ];

        const texture = await textureLoader.loadAsync(  "tank/textures/grass_rock.jpg" )
        this._groundTextures.push( texture );

    }

    getGroundTexture() {

        return this._groundTextures[0];

    }
      
}

export { ResourceManager };