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
    this.mesh; 
    this.corners;
    this.onCreate();
  }

  onCreate() {
    this.mesh = this.generateMesh();
    this.mapCubeToShere();
    this.corners = this.getCorners(this.mesh, this.planet.resolution);
    console.log(this.corners);
  }

  generateMesh() {
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
    const func = this.figureRoundFunc(this.planet.radius, this.planet.position);
    const positions = calcAllVertexPositionsOnce(this.mesh, func, this.planet.resolution);
    this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    this.mesh.refreshBoundingInfo(true);
  }

  /**
   * Generates a function according to sphere radius
   * @param {number} radius
   * @param {Vector3}
   */
  figureRoundFunc(radius, pos) {
    // Small optimisation available if pos = 0, 0, 0
    const roundFunc = (x, y, z) => {
      // Cube mapping formula by Philip Nowell
      const x2 =  Math.pow((x - pos.x) / radius, 2);
      const y2 =  Math.pow((y - pos.y) / radius, 2);
      const z2 =  Math.pow((z - pos.z) / radius, 2);

      // Coordinates in sphere
      const spX = (x - pos.x) * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3);
      const spY = (y - pos.y) * Math.sqrt(1 - z2 / 2 - x2 / 2 + z2 * x2 / 3);
      const spZ = (z - pos.z) * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3);

      // every distance is radius!
      return [pos.x + spX, pos.y + spY, pos.z + spZ];
    };
    return roundFunc;
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
