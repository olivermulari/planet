import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";

export function createArcRotateCamera(camera, scene, planetRadius) {
  // Creates, angles, distances and targets the camera
  camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 0, 0), scene);
  camera.setPosition(new Vector3(0, 40, -170));
  camera.allowUpsideDown = false;
  camera.lowerRadiusLimit = planetRadius + 2;
  camera.angularSensibilityX = 500;
  camera.angularSensibilityy = 500;
  return camera;
}

/*
// Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 15,-50), scene);
camera.setTarget(BABYLON.Vector3.Zero());
*/
