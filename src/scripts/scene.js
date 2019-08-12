import Planet from "../components/planet";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import { createSkybox } from "./skybox";
import { createArcRotateCamera, updateCameraSpeed } from "./camera";
import { createMetal, createPlastic } from "./materials";

import { createBall } from "../utils/debugball";

const resolution = 4; // 32 is a good standard even 6 is working
const smallestPart = 0.05;
const planetRadius = 20;
const planetCenter = new BABYLON.Vector3(0, 0, 0);

export function createScene() {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  // Create a basic BJS Scene object.
  const scene = new BABYLON.Scene(engine);
  // Create a basic light, aiming 0,1,0 - meaning, to the sky.
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
  
  // create camera
  const camera = createArcRotateCamera(scene, planetRadius);
  camera.attachControl(canvas, false);

  createSkybox(scene);
  createBall(planetCenter, scene);

  // materials
  scene.glassMaterials = [
    createMetal(scene, new BABYLON.Color3(1.0, 0.1, 0.1)),
    createPlastic(scene, new BABYLON.Color3(0.3, 1.0, 0.3)),
    createPlastic(scene, new BABYLON.Color3(0.3, 1.0, 1.0)),
    createMetal(scene, new BABYLON.Color3(0.3, 0.2, 1.0)),
  ];
  
  scene.planet = new Planet(scene, planetCenter, planetRadius, resolution);
  scene.planet.createSides();

  // render loop
  scene.registerBeforeRender(function() {
    // scene.planet.update();
    // updateCameraSpeed(camera);
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
