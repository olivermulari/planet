import Planet from "../components/planet";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import { createSkybox } from "./skybox";
import { createArcRotateCamera, createFreeCamera, updateCameraSpeed } from "./camera";
import { addMaterialsToScene } from "./materials";
import { enablePhysics } from "./physics";

import * as MobileCheck from "../utils/mobile";
import { createBall } from "../utils/debugball";

const resolution = MobileCheck.isMobile.any() ? 4 : 8;
const planetRadius = 200;
const planetCenter = new BABYLON.Vector3(0, 0, 0);

export function createScene() {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  // Create a basic BJS Scene object.
  const scene = new BABYLON.Scene(engine);
  // Create a basic light, aiming 0,1,0 - meaning, to the sky.
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
  
  // create camera
  //const camera = createArcRotateCamera(scene, planetRadius);
  const camera = createFreeCamera(scene);
  camera.attachControl(canvas, false);

  // creates gravity
  const physicsEngine = enablePhysics(scene);

  createSkybox(scene);
  createBall(planetCenter, scene);
  scene.planet = new Planet(scene, planetCenter, planetRadius, resolution);

  // materials
  addMaterialsToScene(scene);

  // render loop
  scene.registerBeforeRender(function() {
    scene.planet.update();
    // updateCameraSpeed(camera);
    scene.gravity = scene.activeCamera.globalPosition.negate().normalize().scale(3);
  });

  engine.runRenderLoop(function() {
    scene.render();
  });

  window.addEventListener('resize', function() {
    engine.resize();
  });

  // Return the created scene.
  return scene;
};
