/**
* Agorithm that does vector calculations to each point only once
* If a vertex belongs to 8 triangles, all triangels are updated with single calculation 
* 
* Works with my mesh data-structure with logical but complex indexing
* 
* @param {(number, number, number) => [number, number, number]} calc Function that gets applied to all.
* @return {number[]} vertexData
*/
export function calcAllVertexPositionsOnce(mesh, calc, resolution) {
  const p = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  const m = resolution;
  const n = m * 2 + 1;
  // indexes
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // Array for all same points
      let indexes = [];
      const xBorder = x == 0 || x == n - 1;
      const yBorder = y == 0 || y == n - 1;
      const xSide = x % 2 == 0;
      const ySide = y % 2 == 0;
      if (xBorder || yBorder) {
        // border cases require special care
        if (xBorder && yBorder) {
          // corner-cases
          if (x == 0 && y == 0) {
            indexes = [
              3,
              5 * 3
            ];
          } else if (x == n - 1 && y == 0) {
            const a = (m - 1) * 24 * 3;
            indexes = [
              a + 7 * 3,
              a + 11 * 3
            ];
          } else if (x == 0 && y == n - 1) {
            const a = m * (m - 1) * 24 * 3;
            indexes = [
              a + 19 * 3,
              a + 23 * 3
            ];
          } else { // if (x == n-2 && y == n-2)
            const a = ((m - 1) + m * (m - 1)) * 24 * 3;
            indexes = [
              a + 13 * 3,
              a + 17 * 3
            ];
          }

        } else if (xBorder && !yBorder) {
          // side-case
          if (x == 0) {
            if (ySide) {
              const a = m * (y/2 - 1) * 24 * 3;
              const b = m * (y/2) * 24 * 3;
              indexes = [
                a + 19 * 3,
                a + 23 * 3,
                b + 1 * 3,
                b + 5 * 3
              ];
            } else {
              const a = m * ((y+1)/2 - 1) * 24 * 3;
              indexes = [
                a + 2 * 3,
                a + 22 * 3
              ];
            }
              
          } else { // if (x == n-2) {
            if (ySide) {
              const a = ((m - 1) + m * (y/2 - 1)) * 24 * 3;
              const b = ((m - 1) + m * (y/2)) * 24 * 3;
              indexes = [
                a + 13 * 3,
                a + 17 * 3,
                b + 7 * 3,
                b + 11 * 3
              ];
            } else {
              const a =((m - 1) + m * ((y+1)/2 - 1)) * 24 * 3;
              indexes = [
                a + 10 * 3,
                a + 14 * 3
              ];

            }
          }

        } else { // if (!xBorder && yBorder) {
          // bottom-side-case
          if (y == 0) {
            if (xSide) {
              const a = (x/2 - 1) * 24 * 3;
              const b = (x/2) * 24 * 3;
              indexes = [
                a + 7 * 3,
                a + 11 * 3,
                b + 1 * 3,
                b + 5 * 3
              ];
            } else {
              const a = ((x+1)/2 - 1) * 24 * 3;
              indexes = [
                a + 4 * 3,
                a + 8 * 3
              ];
            }
          } else { // if (y == n-2) {
            if (xSide) {
              const a = ((x/2 - 1) + m * (m - 1)) * 24 * 3;
              const b = ((x/2) + m * (m - 1)) * 24 * 3;
              indexes = [
                a + 13 * 3,
                a + 17 * 3,
                b + 19 * 3,
                b + 23 * 3
              ];
            } else {
              const a = (((x+1)/2 - 1) + m * (m - 1)) * 24 * 3;
              indexes = [
                a + 16 * 3,
                a + 20 * 3
              ];
            }
          }
        }

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

        } else { // if (!xSide && !ySide) {
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

  return p;
}
