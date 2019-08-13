import { Vector3, Mesh } from "@babylonjs/core";

import { generateVertexData } from "./utils/vertexdata";
import { calcAllVertexPositionsOnce } from "./utils/vertexcalc";
import { figureNodePosFunc } from "./utils/nodepos";
import { getMaterialByID } from "./utils/materials";

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
    this.isVisible = true;
    this.nodes = [];

    // hacky colors
    this.id = id || -1;
    this.material = this.id == -1 ? this.planet.material : getMaterialByID(this.planet.scene, id);

    // constants for node recursion
    this.minNodeSize = 0.5;
    this.nodeUpdateDistance = Math.pow(this.size, 1.5);

    this.onCreate();
  }

  onCreate() {
    this.mesh = this.generateMesh();
    this.mapCubeToShere();
    this.corners = this.getCorners(this.mesh, this.planet.resolution);
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

  generateMesh() {
    const customMesh = new Mesh("", this.planet.scene);
    const vertexData = generateVertexData(this.name, this.position, this.size, this.planet.resolution, this.planet.scene);
    vertexData.applyToMesh(customMesh, true);
    customMesh.material = this.material;
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
      const spX = (x - pos.x) * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3);
      const spY = (y - pos.y) * Math.sqrt(1 - z2 / 2 - x2 / 2 + z2 * x2 / 3);
      const spZ = (z - pos.z) * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3);
      // every distance is radius!
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
    if (this.isVisible && this.size > this.minNodeSize) {
      if (this.distance < this.nodeUpdateDistance) {
        [1, 2, 3, 4].map(figureNodePosFunc(this.name, this.position, this.size))
          .forEach((pos, i) => {
            const node = new Node(this.name, pos, this.size/2, this.planet, i);
            this.nodes.push(node);
            this.planet.nodes.push(node);
          });
        this.mesh.setEnabled(false);
        this.isVisible = false;
        return true;
      }
    } else {
      return false;
    }  
  }

  checkIfDisposeNodes() {
    if (!this.isVisible && this.distance > this.nodeUpdateDistance) {
      this.disposeNodes();
      return true;
    } else {
      return false;
    }
  }

  disposeNodes() {
    this.nodes.forEach(node => {
      node.disposeNodes();
      node.mesh.dispose();
    });
    this.nodes = [];
    this.mesh.setEnabled(true);
    this.isVisible = true;
  }

}
