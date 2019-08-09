import Planet from "./components/planet";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import { createSkybox } from "./scripts/skybox";
import { createArcRotateCamera } from "./scripts/camera";
import { addDebugKeycodes } from "./scripts/controls";
import { createMetal, createPlastic } from "./scripts/materials";

import './styles/style.css';

const resolution = 12; // 32 is a good standard even 6 is working
const smallestPart = 0.05;
const planetRadius = 20;
const planetCenter = new BABYLON.Vector3(0, 0, 0);

// Time for debugging purposes
const startTime = new Date().getTime() / 1000.0;
var nowTime = startTime / 1000.0;

//debugging
function logTime(msg) {
  nowTime = new Date().getTime() / 1000.0;
  console.log(msg + ' in ' + String(nowTime - startTime).substring(0, 5) + 's.');
}

window.addEventListener('DOMContentLoaded', function() {

  const canvas = document.getElementById("renderCanvas");
    
  const engine = new BABYLON.Engine(canvas, true);

  let camera = null;

  var createScene = function() {
    // Create a basic BJS Scene object.
    const scene = new BABYLON.Scene(engine);
    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
    
    // create camera
    camera = createArcRotateCamera(camera, scene, planetRadius);
    camera.attachControl(canvas, false);

    createSkybox(scene);
    createBall(scene);

    logTime('Start');
    scene.planet = new Planet(scene, planetCenter, planetRadius, resolution);
    scene.planet.createSides();
    logTime('Planes rendered');

    // add keycodes
    addDebugKeycodes(scene);

    // Return the created scene.
    return scene;
  };

  const scene = createScene();
  scene.glassMaterials = [
    createMetal(scene, new BABYLON.Color3(1.0, 0.1, 0.1)),
    createPlastic(scene, new BABYLON.Color3(0.3, 1.0, 0.3)),
    createPlastic(scene, new BABYLON.Color3(0.3, 1.0, 1.0)),
    createMetal(scene, new BABYLON.Color3(0.3, 0.2, 1.0)),
  ];

  function updateCameraSpeed(camera) {
    const speed = (planetCenter.negate().add(camera.getFrontPosition(0)).length() - planetRadius) * 0.005;
    camera.angularSensibilityX = Math.max(500 / speed, 1000);
    camera.angularSensibilityY = Math.max(500 / speed, 1000);
    camera.wheelPrecision = Math.max(3 / speed, 3);
    camera.pinchPrecision = Math.max(3 / speed, 3);
    camera.speed = Math.max(3 / speed, 3);
  }

  engine.runRenderLoop(function() {
    scene.render();
  });

  window.addEventListener('resize', function() {
    engine.resize();
  });

  // after first render
  let count = 0;
  const updateBreak = 1;
  scene.registerBeforeRender(function() {
    if (count % updateBreak === 0) { // %60
      scene.planet.update();
    }
    count++;

    updateCameraSpeed(camera);
  });
});

// ball to the center for debugging purposes
function createBall(scene) {
  // center ball
  let ball = BABYLON.MeshBuilder.CreateSphere("", {diameter: 0.2}, scene);
  ball.position = new BABYLON.Vector3(0, 0, 0);
  let ballMaterial = new BABYLON.StandardMaterial("", scene);
  ballMaterial.diffuseColor = new BABYLON.Color3(1.0, 0, 0);
  ball.material = ballMaterial;

  // not pickable
  ball.isPickable = false;

  // Apply gravity to ball
  ball.checkCollisions = true;
  ball.applyGravity = true;
}
