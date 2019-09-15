import { ArcRotateCamera, FreeCamera } from "@babylonjs/core/Cameras";
import { Vector3 } from "@babylonjs/core/Maths/math";

export function createFreeCamera(scene) {
  var camera = new FreeCamera("FlyCamera", new Vector3(0, 0, 0), scene);
  camera.position = new Vector3(0, 40, -1000);
  camera.minZ = 1;
  camera.maxZ = 50000;

  camera.updateUpVectorFromRotation = true;
  return camera;
}

export function updateFreeCameraRotation(camera, planetRadius) {
  const pos = camera.globalPosition;
  camera.rotation.x = Math.cos(pos.x);
  camera.rotation.y = Math.cos(pos.y);
  camera.rotation.z = Math.cos(pos.z);
}

export function createArcRotateCamera(scene, planetRadius) {
  // Creates, angles, distances and targets the camera
  const camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 0, 0), scene);
  camera.setPosition(new Vector3(0, 40, -1000));
  camera.allowUpsideDown = false;
  camera.minZ = 1;
  camera.maxZ = 50000;
  camera.lowerRadiusLimit = planetRadius + 10;
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
