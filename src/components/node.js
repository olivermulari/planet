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
    this.corners = this.getCorners(this.mesh, this.planet.resolution);
    this.calcAllVertexPositionsOnce(this.figureCalcFunction());
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

  /**
   * Agorithm that does vector calculations to each point only once
   * If a vertex belongs to 8 triangles, all triangels are updated with single calculation
   * 
   * Works with my mesh data-structure with logical but complex indexing
   * 
   * @param {(number, number, number) => [number, number, number]} calc Function that gets applied to all.
   */
  calcAllVertexPositionsOnce(calc) {
    const p = this.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const m = this.planet.resolution;
    const n = m * 2 + 1;
    // indexes
    for (let y = 0; y < n - 1; y++) {
      for (let x = 0; x < n - 1; x++) {
        // Array for all same points
        let indexes = [];
        const xBorder = x == 0 || x == n;
        const yBorder = y == 0 || y == n;
        const xSide = x % 2 == 0;
        const ySide = y % 2 == 0;
        if (xBorder || yBorder) {
          // handle border
        } else {
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

          } else if (xSide && !ySide) {

            const a = ((x/2 - 1) + m * ((y+1)/2 - 1)) * 24 * 3;
            const b = ((x/2) + m * ((y+1)/2 - 1)) * 24 * 3;
            indexes = [
              a + 10 * 3,
              a + 14 * 3,
              b + 2 * 3,
              b + 22 * 3
            ];

          } else if (!xSide && ySide) {

            const a = (((x+1)/2 - 1) + m * (y/2 - 1)) * 24 * 3;
            const b = (((x+1)/2 - 1) + m * (y/2)) * 24 * 3;
            indexes = [
              a + 16 * 3,
              a + 20 * 3,
              b + 4 * 3,
              b + 8 * 3
            ];

          } else if (!xSide && !ySide) {

            // center point from a block
            const a = (((x+1)/2 - 1) + m * ((y+1)/2 - 1)) * 24 * 3;
            indexes = [
              a,
              a + 3 * 3,
              a + 6 * 3,
              a + 9 * 3,
              a + 12 * 3,
              a + 15 * 3,
              a + 18 * 3,
              a + 21 * 3
            ];
            
          }
        }

        // calculte first element and apply foreach
        const f = indexes[0];
        const res = calc(p[f], p[f+1], p[f+2]); // returns [] of new values
        indexes.forEach((i) => {
          p[i] = res[0];
          p[i+1] = res[1];
          p[i+2] = res[2];
        });
      }
    }

    // applies updates to the mesh
    this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, p);
    this.mesh.refreshBoundingInfo(true);
  }
}
