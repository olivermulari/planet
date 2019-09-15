import { Vector3, Mesh, AbstractMesh } from "@babylonjs/core";

import { generateVertexData } from "./utils/vertexdata";
import { calcAllVertexPositionsOnce } from "./utils/vertexcalc";
import { figureNodePosFunc } from "./utils/nodepos";
import { getMaterialByID } from "./utils/materials";

/**
 * TODO:
 * 1. dont update node if it's not visible
 * 2. dispose node if its not visible
 */
export default class Node {
  constructor(name, position, size, planet, id) {
    this.name = name;
    this.position = position;
    this.size = size;
    this.planet = planet;
    this.isSide = size === this.planet.radius * 2;
    this.mesh;
    this.corners;
    this.distance;
    this.isVisible = false; //visible to camera
    this.isInFrustum = false;
    this.isActive = true;
    this.nodes = null; // []

    // hacky colors
    this.id = id || -1;
    this.material = this.planet.material;//this.id == -1 ? this.planet.material : getMaterialByID(this.planet.scene, id);

    // constants for node recursion
    this.minNodeSize = 1;
    this.nodeUpdateDistance = Math.pow(this.size, 1.25);

    /**
     * Terrain generation options:
     */
    this.generateTerrain = true;
    this.perlinFreq = 8 / this.planet.radius;
    this.perlinDir = 1.25 * this.planet.radius;
    this.perlinAmp = 0.05;

    this.onCreate();
  }

  onCreate() {
    this.mesh = this.generateMesh();
    this.mapCubeToShere();
  }

  /**
   * Sets the distance from the closest corner
   * @param {*} camera 
   */
  setDistance(camera) {
    const pos = camera.globalPosition;
    this.distance = this.corners.map(c => BABYLON.Vector3.Distance(c, pos))
      .reduce((l, r) => l < r ? l : r);
  }

  /**
   * Sets isVisible true if nodes closest corner is closer than planet center
   * @param {*} camera 
   */
  setIsVisible(camera) {
    const pos = camera.globalPosition;
    this.isInFrustum = camera.isInFrustum(this.mesh);
    this.isVisible = this.distance < BABYLON.Vector3.Distance(this.planet.position, pos);
  }

  isRenderable() {
    return this.isVisible && this.isInFrustum;
  }

  generateMesh() {
    const customMesh = new Mesh("", this.planet.scene);
    const vertexData = generateVertexData(this.name, this.position, this.size, this.planet.resolution, this.planet.scene);
    vertexData.applyToMesh(customMesh, true);
    customMesh.material = this.material;
    customMesh.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
    // applies collisions
    customMesh.checkCollisions = true;
    return customMesh;
  }

  /**
   * Gets the corner vertices of the mesh
   * @param {*} mesh 
   * @param {number} resolution 
   */
  getCorners(mesh, resolution) {
    const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const n = resolution;
    // according to my data structure:
    const corners = [
      0                                + 1 * 3,
      (n - 1) * 24 * 3                 + 7 * 3,
      n * (n - 1) * 24 * 3             + 19 * 3,
      ((n - 1) + n * (n - 1)) * 24 * 3 + 13 * 3
    ].map(i => {
      const x = positions[i];
      const y = positions[i+1];
      const z = positions[i+2];
      return new Vector3(x, y, z);
    });
    return corners;
  }

  mapCubeToShere() {
    const func = this.figureRoundFunc(this.planet.radius, this.planet.position);
    const positions = calcAllVertexPositionsOnce(this.mesh, func, this.planet.resolution);
    this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    this.mesh.refreshBoundingInfo(true);
    this.corners = this.getCorners(this.mesh, this.planet.resolution);
  }

  /**
   * Generates a function according to sphere radius
   * @param {number} radius
   * @param {Vector3} pos
   * @returns {(number, number, number) => [number, number, number]} function that modifies points
   */
  figureRoundFunc(radius, pos) {
    // Small optimisation available if pos = 0, 0, 0
    const roundFunc = (x, y, z) => {
      // Cube mapping formula by Philip Nowell
      const x2 =  Math.pow((x - pos.x) / radius, 2);
      const y2 =  Math.pow((y - pos.y) / radius, 2);
      const z2 =  Math.pow((z - pos.z) / radius, 2);
      let spX = (x - pos.x) * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3);
      let spY = (y - pos.y) * Math.sqrt(1 - z2 / 2 - x2 / 2 + z2 * x2 / 3);
      let spZ = (z - pos.z) * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3);

      if (this.generateTerrain) {
        const x = (spX + this.perlinDir) * this.perlinFreq;
        const y = (spY + this.perlinDir) * this.perlinFreq;
        const z = (spZ + this.perlinDir) * this.perlinFreq;
        const noise = 1 + this.perlinAmp * this.planet.perlin.noise(x, y, z);
        spX *= noise;
        spY *= noise;
        spZ *= noise;
      }
      return [pos.x + spX, pos.y + spY, pos.z + spZ];
    };
    return roundFunc;
  }

  checkIfUpdates() {
    const generated = this.checkIfGenerateNodes();
    const disposed = this.checkIfDisposeNodes();
    return generated || disposed;
  }

  checkIfGenerateNodes() {
    if (this.isActive && this.size > this.minNodeSize) {
      if (this.distance < this.nodeUpdateDistance) {
        const arr = [1, 2, 3, 4].map(figureNodePosFunc(this.name, this.position, this.size))
          .map((pos, i) => {
            const node = new Node(this.name, pos, this.size/2, this.planet, i);
            this.planet.nodes.push(node);
            return node;
          });
        this.nodes = arr;
        this.mesh.setEnabled(false);
        this.isActive = false;
        return true;
      }
    } else {
      return false;
    }  
  }

  checkIfDisposeNodes() {
    if (!this.isActive && this.distance > this.nodeUpdateDistance) {
      this.disposeNodes();
      return true;
    } else {
      return false;
    }
  }

  disposeNodes() {
    if (this.nodes) {
      this.nodes.forEach(node => {
        node.disposeNodes();
        node.mesh.dispose();
        this.removeNodeFromNodesArray(node);
      });
      this.nodes = null;
      this.mesh.setEnabled(true);
      this.isActive = true;
    }
  }

  /**
   * Removes element from planet nodes and from main loop
   * @param {Node} node 
   */
  removeNodeFromNodesArray(node) {
    const arr = this.planet.nodes;
    arr.splice(arr.indexOf(node), 1);
  }

}
