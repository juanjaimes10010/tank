import { Scene, WebGLRenderer, PerspectiveCamera, Vector3, HemisphereLight, Clock } from 'three';
import { GameMap } from './GameMap.js';
import { ResourceManager } from './ResourceManager.js';
import { PlayerTank } from './PlayerTank.js';
import { Wall } from './Wall.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Game {
    
    static _instance = new Game();
    
    static get instance() { return this._instance; }

    get camera() { return this._camera; }

    get entities() { return this._entities }

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
        this._clock = new Clock();

        this._mapSize = 15;
        
        const map = new GameMap( { position: new Vector3( 0, 0, 0 ), size: 15 } );
        this._entities.push( map );

        const playerTank = new PlayerTank( { position: new Vector3( 7, 7, 0 ) } );
        this._entities.push( playerTank );

        this.createWalls();

    }

    createWalls() {

        const edge = this._mapSize - 1;

        this._entities.push( new Wall( { position: new Vector3( 0, 0, 0 ) } ) ); 
        this._entities.push( new Wall( { position: new Vector3( edge, 0, 0 ) } ) ); 
        this._entities.push( new Wall( { position: new Vector3( edge, edge, 0 ) } ) ); 
        this._entities.push( new Wall( { position: new Vector3( 0, edge, 0 ) } ) ); 

        for(let i = 1; i < edge; i++) {
            this._entities.push( new Wall( { position: new Vector3( i, 0, 0 ) } ) ); 
            this._entities.push( new Wall( { position: new Vector3( 0, i, 0 ) } ) ); 
            this._entities.push( new Wall( { position: new Vector3( edge, i, 0 ) } ) ); 
            this._entities.push( new Wall( { position: new Vector3( i, edge, 0 ) } ) ); 
        }

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
        
        const deltaT = this._clock.getDelta();

        this._entities.forEach( e => {

            e.update( deltaT );

        })

        this._renderer.render( this._scene, this._camera );
    }

    addToScene( entity ) {
        this._entities.push( entity );
        this._scene.add( entity.mesh )
    }

    disposeEntities() {

        const entitiesToBeDisposed = this._entities.filter( e => e.shouldDispose );

        entitiesToBeDisposed.forEach( e => {
            this._scene.remove( e.mesh );
            e.dispose();
        });

        this._entities = [
            ...this._entities.filter( e => !e.shouldDispose )
        ];

    }

}

export { Game };