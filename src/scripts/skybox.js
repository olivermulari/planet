import * as BABYLON from "@babylonjs/core/Legacy/legacy";

export function createSkybox(scene) {
  // Environment Texture
  var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
  scene.environmentTexture = hdrTexture;

  scene.imageProcessingConfiguration.exposure = 0.6;
  scene.imageProcessingConfiguration.contrast = 1.6;

  // Skybox
  var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
  var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
  hdrSkyboxMaterial.backFaceCulling = false;
  hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
  hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	  hdrSkyboxMaterial.microSurface = 0.3; // BLUR
  hdrSkyboxMaterial.disableLighting = true;
  hdrSkybox.material = hdrSkyboxMaterial;
  hdrSkybox.infiniteDistance = true;
}
