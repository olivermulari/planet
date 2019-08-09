import Side from './side';
import { createGlass } from '../scripts/materials';

export default class Planet {
  constructor(scene, position, size, resolution) {
    this.size = size; // radius
    this.resolution = resolution;
    this.position = position;
    this.scene = scene;
    this.material = createGlass(scene, new BABYLON.Color3(0.3, 0.2, 1.0));
    this.sides = [];
    this.activeChunck = null;
  }

  createSides() {
    const sideInfo = {
      1: {name: 'Up', dir: new BABYLON.Vector3(0, 1.0, 0), rotX: 0, rotY: 0}, 
      2: {name: 'Front', dir: new BABYLON.Vector3(0, 0, -1.0), rotX: -Math.PI/2, rotY: 0},
      3: {name: 'Right', dir: new BABYLON.Vector3(1.0, 0, 0), rotX: -Math.PI/2, rotY: 1.5 * Math.PI},
      4: {name: 'Left', dir: new BABYLON.Vector3(-1.0, 0, 0), rotX: -Math.PI/2, rotY: Math.PI/2},
      5: {name: 'Back', dir: new BABYLON.Vector3(0, 0, 1.0), rotX: -Math.PI/2, rotY: Math.PI},
      6: {name: 'Down', dir: new BABYLON.Vector3(0, -1.0, 0), rotX: -Math.PI, rotY: 0},
    };

    for (let i = 1; i <= 6; i++) {
      const side = new Side(sideInfo[i], this, this.resolution);
      this.sides.push(side);
    }

    this.pushSides(this.sides);
    this.calculateNormals(this.sides);
  }

  pushSides(sidesArray) {
    sidesArray.forEach((side) => {
      side.round(side.mesh);
    });
  }

  calculateNormals(sidesArray) {
    sidesArray.forEach((side) => {
      side.calculateNormals(side.mesh);
    });
  }

  update() {
    this.castRayFromCamera(this.scene);
  }

  rayFromCamera(scene) {
    const camPosition = scene.activeCamera.globalPosition;
    const dir = camPosition.negate().add(this.position);
    const dist = dir.length();
    return new BABYLON.Ray(camPosition, dir, dist);
  }

  pickResult(ray, scene) {
    const predicate = function (mesh) {
      return mesh.isPickable;
    };

    const hit = scene.pickWithRay(ray, predicate);
    if (hit.hit) {
      if (hit.pickedMesh) {
        if (hit.pickedMesh.chunck) {
          return hit;
        }
      }
    }
    return null;
  }

  castRayFromCamera(scene) {
    const ray = this.rayFromCamera(scene);
    const hit = this.pickResult(ray, scene);
    if (hit) {
      this.figureActiveChunck(hit);
    }
  }

  setActiveChunck(chunck) {
    this.activeChunck = chunck;
  }

  // Must be simplified
  figureActiveChunck(hit) {
    const hitLength = hit.distance;

    // init
    if (!this.activeChunck) {this.setActiveChunck(hit.pickedMesh.chunck); console.log('init', this.activeChunck);}

    if (hit.pickedMesh.chunck !== this.activeChunck) {
      console.log(hit.pickedMesh.chunck);

      const depth = this.activeChunck.depth;
      const hitDepth = hit.pickedMesh.chunck.depth;

      // try next the first uncommon parent again

      /*
            const pa = this.commonParent(this.activeChunck, hit.pickedMesh.chunck);
                if (pa) {
                    // find first common parent to dispose chuncks this.activeChunck.parents.includes((p) => { return p === hit.pickedMesh.chunck})
                    pa.disposeChuncks();
                } else if (!this.activeChunck.isSide()) {
                    // else side dispose chuncks (first parent)
                    this.activeChunck.parents[0].disposeChuncks();
                }
            */

      /*
            if (hitDepth == depth) {
                // do not dispose chuncks
            } else if (hitDepth < depth) {
                // check if hit.picked mesh is a parent
            } else {
                // console.log("should be impossible");
            }
            */

      this.setActiveChunck(hit.pickedMesh.chunck);
    }
    this.activeChunck.checkIfMakeChuncks(hitLength);
  }

  commonParent(x, y) {
    let parent = null;
    let count = y.parents.length - 1;
    while (count > 0) {
      const cur = y.parents[count];
      if (x.parents.includes(cur)) return cur;
      count--;
    }
    return parent;
  }
}
