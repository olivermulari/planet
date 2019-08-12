import { generatePlaneMesh } from "../scripts/mesh";
import { Vector3 } from "@babylonjs/core";

import { createBall } from "../utils/debugball";

export default class Node {
  constructor(name, position, size, planet) {
    this.name = name;
    this.position = position;
    this.size = size;
    this.planet = planet;
    this.mesh = this.createMesh();
    this.corners = this.getCorners();
    this.drawCorners();
    console.log(this.corners);
    this.calcAllVertexPositionsOnce();
  }

  createMesh() {
    const mesh = generatePlaneMesh(this.name, this.position, this.size, this.planet.resolution, this.planet.scene);
    mesh.material = this.planet.material;
    return mesh;
  }

  getCorners() {
    const positions = this.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const n = this.planet.resolution;
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

  calcAllVertexPositionsOnce() {
    const p = this.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const m = this.planet.resolution;
    const n = m * 2 + 1;
    // indexes
    let indexes;
    for (let y = 0; y < n - 1; y++) {
      for (let x = 0; x < n - 1; x++) {
        const xBorder = x == 0 || x == n;
        const yBorder = y == 0 || y == n;
        const xSide = x % 2 == 0;
        const ySide = y % 2 == 0;
        if (xBorder || yBorder) {
          // handle border
        } else {
          // block center indexes!
          if (xSide && ySide) {
            // data from four different blocks
            const a = ((x/2 - 1) + m * (y/2 - 1)) * 24 * 3;
            const b = ((x/2) + m * (y/2 - 1)) * 24 * 3;
            const c = ((x/2 - 1) + m * (y/2)) * 24 * 3;
            const d = ((x/2) + m * (y/2)) * 24 * 3;
            indexes = [
              a + 13 * 3,
              a + 17 * 3,
              b + 19 * 3,
              b + 23 * 3,
              c + 7 * 3,
              c + 11 * 3,
              d + 1 * 3,
              d + 5 * 3
            ];
            // indexes.forEach((x) => console.log(p[x], p[x+1], p[x+2]));
          } else if (xSide && !ySide) {
            const a = ((x/2 - 1) + m * (y-1)/2) * 24 * 3;
          } else if (!xSide && ySide) {

          } else if (!xSide && !ySide) {

          }
        }
      }
    }
  }
}
