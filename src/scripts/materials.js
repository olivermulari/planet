import { PBRMaterial, StandardMaterial, Color3 } from "@babylonjs/core";

export function addMaterialsToScene(scene) {
  // materials
  scene.customMaterials = [
    createMetal(scene, new BABYLON.Color3(1.0, 0.1, 0.1)),
    createPlastic(scene, new BABYLON.Color3(0.3, 1.0, 0.3)),
    createPlastic(scene, new BABYLON.Color3(0.3, 1.0, 1.0)),
    createMetal(scene, new BABYLON.Color3(0.3, 0.2, 1.0)),
  ];
}

export function createGlass(scene, color) {
  const glass = new PBRMaterial("glass", scene);
  glass.reflectionTexture = scene.environmentTexture;
  glass.refractionTexture = scene.environmentTexture;
  glass.linkRefractionWithTransparency = true;
  glass.indexOfRefraction = 0.52;
  glass.alpha = 0;
  glass.microSurface = 1;
  glass.reflectivityColor = new Color3(0.2, 0.2, 0.2);
  glass.albedoColor = color || new Color3(0.3, 1.0, 0.3);
  return glass;
}

function createMetal(scene, color) {
  const metal = new PBRMaterial("metal", scene);
  metal.reflectionTexture = scene.environmentTexture;
  metal.microSurface = 0.96;
  metal.reflectivityColor = color || new Color3(0.85, 0.85, 0.85);
  metal.albedoColor = new Color3(0.01, 0.01, 0.01);
  return metal;
}

function createPlastic(scene, color) {
  const plastic = new PBRMaterial("plastic", scene);
  plastic.reflectionTexture = scene.environmentTexture;
  plastic.microSurface = 0.96;
  plastic.albedoColor = color || new Color3(0.206, 0.94, 1);
  plastic.reflectivityColor =  new Color3(0.003, 0.003, 0.003);
  return plastic;
}

export function createWireframe(scene) {
  const material = new StandardMaterial("Wireframe", scene);
  material.diffuseColor = new Color3.White();
  material.wireframe = true;
  return material;
}
