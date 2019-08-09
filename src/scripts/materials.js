import * as BABYLON from "@babylonjs/core/Legacy/legacy";

// Create materials
export function createGlass(scene, color) {
  const glass = new BABYLON.PBRMaterial("glass", scene);
  glass.reflectionTexture = scene.environmentTexture;
  glass.refractionTexture = scene.environmentTexture;
  glass.linkRefractionWithTransparency = true;
  glass.indexOfRefraction = 0.52;
  glass.alpha = 0;
  glass.microSurface = 1;
  glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  glass.albedoColor = color || new BABYLON.Color3(0.3, 1.0, 0.3);
  return glass;
}

export function createMetal(scene, color) {
  const metal = new BABYLON.PBRMaterial("metal", scene);
  metal.reflectionTexture = scene.environmentTexture;
  metal.microSurface = 0.96;
  metal.reflectivityColor = color || new BABYLON.Color3(0.85, 0.85, 0.85);
  metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
  return metal;
}

export function createPlastic(scene, color) {
  const plastic = new BABYLON.PBRMaterial("plastic", scene);
  plastic.reflectionTexture = scene.environmentTexture;
  plastic.microSurface = 0.96;
  plastic.albedoColor = color || new BABYLON.Color3(0.206, 0.94, 1);
  plastic.reflectivityColor =  new BABYLON.Color3(0.003, 0.003, 0.003);
  return plastic;
}

export function createWireframe(scene) {
  const material = new BABYLON.StandardMaterial("Wireframe", scene);
  material.diffuseColor = new BABYLON.Color3.White();
  material.wireframe = true;
  return material;
}
