import { OimoJSPlugin } from "@babylonjs/core";

export function enablePhysics(scene) {
  window.OIMO = require( 'oimo' );
  scene.enablePhysics(undefined, new OimoJSPlugin());
  scene.gravity = scene.activeCamera.globalPosition.negate().normalize().scale(3);
  scene.collisionsEnabled = true;
  scene.activeCamera.checkCollisions = true;
  scene.activeCamera.applyGravity = true;
  //Set the ellipsoid around the camera (e.g. your player's size)
  scene.activeCamera.ellipsoid = new BABYLON.Vector3(1, 2, 1);
}

function createPlayer() {

  /*
  player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
    mass: 1,
    friction: 4,
    restitution: 0.5,
    nativeOptions: {
      move: true
    }
  });
  */
}
