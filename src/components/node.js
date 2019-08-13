import { generatePlaneMesh } from "../scripts/mesh";
import { Vector3 } from "@babylonjs/core";

import { calcAllVertexPositionsOnce } from "../scripts/vertexcalc";

import { createBall } from "../utils/debugball";

export default class Node {
  constructor(name, position, size, planet) {
    this.name = name;
    this.position = position;
    this.size = size;
    this.planet = planet;
    this.mesh = this.createMesh();
    this.corners = this.getCorners(this.mesh, this.planet.resolution);
    this.mapCubeToShere();
  }

  createMesh() {
    const mesh = generatePlaneMesh(this.name, this.position, this.size, this.planet.resolution, this.planet.scene);
    mesh.material = this.planet.material;
    return mesh;
  }

  /**
   * Gets the corner vertices of the mesh
   * 
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

  drawCorners() {
    this.corners.forEach(c => {createBall(c, this.planet.scene);});
  }

  mapCubeToShere() {
    const positions = calcAllVertexPositionsOnce(this.mesh, this.roundFunc, this.planet);
    this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    this.mesh.refreshBoundingInfo(true);
  }

  roundFunc(x, y, z, size) {
    // Cube mapping formula by Philip Nowell
    const x2 =  x * x / (size * size / 4);
    const y2 =  y * y / (size * size / 4);
    const z2 =  z * z / (size * size / 4);
    return [
      size/2 * x * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3),
      size/2 * y * Math.sqrt(1 - z2 / 2 - x2 / 2 + z2 * x2 / 3),
      size/2 * z * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3),
    ];
  }

  // returns a function depending on node name
  figureCalcFunction() {
    const a = 2;
    switch(this.name) {
    case "Front":
      return (x, y, z) => [x, y, z-a];
    case "Back":
      return (x, y, z) => [x, y, z+a];
    case "Up":
      return (x, y, z) => [x, y+a, z];
    case "Down":
      return (x, y, z) => [x, y-a, z];
    case "Right":
      return (x, y, z) => [x+a, y, z];
    case "Left":
      return (x, y, z) => [x-a, y, z];
    }
  }
}
