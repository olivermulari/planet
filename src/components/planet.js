import Side from './side';
import { createGlass } from '../scripts/materials';


/** WRONG NODES ARE CHECK IF MAKE CHUNCKS!!! 
 * 
 * New order:
 * 
 * 1. iterate through ALL chunks
 * 2. until you find chunck that has to be changed
 * 3. then change chunck mesh and stop iterating
 * 4. check cracks!
 * 
*/


export default class Planet {
  constructor(scene, position, size, resolution) {
    this.size = size; // radius
    this.resolution = resolution;
    this.position = position;
    this.scene = scene;
    this.material = createGlass(scene, new BABYLON.Color3(0.3, 0.2, 1.0));
    this.sides = [];
    this.nodes = [];
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
      this.nodes.push(side);
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
    // this.updateSides();
    this.updateNodes();
  }

  updateSides() {
    this.sides.forEach(side => {
      const dist = side.updateDistance(this.scene.activeCamera);
      side.checkIfMakeChuncks(dist);
    });
  }

  updateNodes() {
    // update all distances but
    if (this.nodes[0]) {
      const cam = this.scene.activeCamera;
      let closestNode = this.nodes[0];
      let closestDist = this.nodes[0].updateDistance(cam);
      for (let i = 1; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        if (node.isShowing) {
          const dist = this.nodes[i].updateDistance(cam);
          const isCloser = dist < closestDist;
          closestNode = isCloser ? node : closestNode;
          closestDist = isCloser ? dist : closestDist;
        } else {
          this.nodes.splice(i, 1);
          i--;
        }
      }
      // make only one set of chuncks
      closestNode.checkIfMakeChuncks(closestDist);
    }
  }
}
