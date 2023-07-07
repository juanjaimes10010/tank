import { Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, Color, Vector3, HemisphereLight } from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Entity } from './Entity.js';
import { GameMap } from './GameMap.js';
import { ResourceManager } from './ResourceManager.js';



class Game {
    
    static _instance = new Game();
    
    static get instance() { return this._instance; }

    constructor( ) {

        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._scene = new Scene();
        this._camera = new PerspectiveCamera( 75, this._width / this._height, 0.1, 1000 );
        this._camera.position.set( 7, 7, 10 )
        this._light = new HemisphereLight( 0xffffbb, 0x080820, 1);
        this._scene.add( this._light );
        this._renderer = new WebGLRenderer( { alpha: true, antialias: true } );
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( this._width, this._height );
        window.document.body.appendChild( this._renderer.domElement );

        this._entities = [];


        const map = new GameMap( { position: new Vector3( 0, 0, 0 ), size: 15 } );
        this._entities.push( map );

    }

    async load() {

        await ResourceManager.instance.load();

        this._entities.forEach( async entity => {
            await entity.load();
            this._scene.add( entity._mesh );
        } );

    }

    render() {
        requestAnimationFrame( this.render.bind( this ) );
        
        this._renderer.render( this._scene, this._camera );
    }

}

await Game.instance.load();
Game.instance.render();
console.log( Game.instance._scene )