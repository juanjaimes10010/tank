import { Game } from "./Game.js"
import { Box3, Box3Helper, MeshStandardMaterial, Sphere, Vector3 } from "three";
import { Entity } from "./Entity.js";
import { ResourceManager } from "./ResourceManager.js";


class PlayerTank extends Entity {


    constructor( { position = new Vector3() } = {} ) {

        super( { position } );

        this._roation = 0;

        this._keyboardState = {
            LeftPressed: false,
            RightPressed: false,
            UpPressed: false,
            DownPressed: false
        }

        window.addEventListener( "keydown", this.handleKeyDown.bind( this ) );
        window.addEventListener( "keyup", this.handleKeyUp.bind( this ) );

    }

    handleKeyDown( e ) {

        switch (e.key) {
            case "ArrowUp":
                this._keyboardState.UpPressed = true;
                break;
            case "ArrowDown":
                this._keyboardState.DownPressed = true;
                break;
            case "ArrowLeft":
                this._keyboardState.LeftPressed = true;
                break;
            case "ArrowRight":
                this._keyboardState.RightPressed = true;
                break;
            default:
                break;
        }

    }

    handleKeyUp( e ) {
        
        switch (e.key) {
            case "ArrowUp":
                this._keyboardState.UpPressed = false;
                break;
            case "ArrowDown":
                this._keyboardState.DownPressed = false;
                break;
            case "ArrowLeft":
                this._keyboardState.LeftPressed = false;
                break;
            case "ArrowRight":
                this._keyboardState.RightPressed = false;
                break;
            default:
                break;
        }

    }

    async load() {

        const tankModel = ResourceManager.instance.getModel( "tank" );

        if( !tankModel ) throw "unable to get tank model";
        
        const tankBodyMesh = tankModel.scene.children.find( m => m.name === "Body");
        const tankTurretMesh = tankModel.scene.children.find( m => m.name === "Turret");

        const tankBodyTexture = ResourceManager.instance.getTexture( "tank-body" );
        const tankTurretTexture = ResourceManager.instance.getTexture( "tank-turret" );

        if( !tankBodyMesh || !tankTurretMesh || !tankBodyTexture || !tankTurretTexture ) throw "unable to load player model or textures";

        const bodyMaterial = new MeshStandardMaterial( { map: tankBodyTexture } );
        const turretMaterial = new MeshStandardMaterial( { map: tankTurretTexture } );

        tankBodyMesh.material = bodyMaterial;
        tankTurretMesh.material = turretMaterial;

        this._mesh.add( tankBodyMesh );
        this._mesh.add( tankTurretMesh );
        
        this._collider =  new Box3().setFromObject( this._mesh ).getBoundingSphere( new Sphere( this._mesh.position.clone() ) )
        this._collider.radius *= .75;

    }


    update( deltaT ) {

        let computedRotation = this._roation;
        let computedMovement = new Vector3();
        const moveSpeed = 2;

        // rotation
        if( this._keyboardState.LeftPressed ) computedRotation += Math.PI * deltaT;
        else if( this._keyboardState.RightPressed ) computedRotation -= Math.PI * deltaT;

        // keep rotation between 0 and 2PI also know as a full circle
        const fullCircle = Math.PI * 2;
        if( computedRotation > fullCircle ) computedRotation -= fullCircle; 
        else if( computedRotation < 0 ) computedRotation += fullCircle; 

        // movement with rotaion adjustment
        const yMovement = moveSpeed * deltaT * Math.cos( computedRotation );
        const xMovement = moveSpeed * deltaT * Math.sin( computedRotation );

        // movement
        if( this._keyboardState.UpPressed ) computedMovement = new Vector3( xMovement, -yMovement, 0 );
        else if( this._keyboardState.DownPressed ) computedMovement = new Vector3( -xMovement, yMovement, 0 );
        

        this._roation = computedRotation;

        this._mesh.setRotationFromAxisAngle( new Vector3( 0, 0, 1 ) , computedRotation );


        const testingSphere = this._collider.clone();

        testingSphere.center.add( computedMovement );

        const collided = Game.instance.entities.filter( e =>  e.collider && e.collider !== this._collider && e.collider.intersectsSphere( testingSphere ) );

        if( collided.length ) return;

        this._mesh.position.add( computedMovement );
        this._collider.center.add( computedMovement );

        Game.instance.camera.position.set(
            this._mesh.position.x,
            this._mesh.position.y,
            Game.instance.camera.position.z
        )

    }

}

export { PlayerTank };