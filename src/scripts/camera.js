import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";

export function createArcRotateCamera(scene, planetRadius) {
  // Creates, angles, distances and targets the camera
  const camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 0, 0), scene);
  camera.setPosition(new Vector3(0, 40, -300));
  camera.allowUpsideDown = false;
  camera.lowerRadiusLimit = planetRadius + 2;
  camera.angularSensibilityX = 2000;
  camera.angularSensibilityy = 2000;
  return camera;
}

export function updateCameraSpeed(camera) {
  const speed = (planetCenter.negate().add(camera.getFrontPosition(0)).length() - planetRadius) * 0.005;
  camera.angularSensibilityX = Math.max(500 / speed, 1000);
  camera.angularSensibilityY = Math.max(500 / speed, 1000);
  camera.wheelPrecision = Math.max(3 / speed, 3);
  camera.pinchPrecision = Math.max(3 / speed, 3);
  camera.speed = Math.max(3 / speed, 3);
}

/*
// Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 15,-50), scene);
camera.setTarget(BABYLON.Vector3.Zero());
*/
