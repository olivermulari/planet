import Node from './node';

import { createGlass } from '../scripts/materials';
import { Vector3 } from '@babylonjs/core';


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
    this.nodes = [];
  }

  createSides() {
    const sides = [
      ["Up",    this.position.add(new Vector3(0, this.size/2, 0))],
      ["Down",  this.position.add(new Vector3(0, -this.size/2, 0))], 
      ["Front", this.position.add(new Vector3(0, 0, -this.size/2))], 
      ["Back",  this.position.add(new Vector3(0, 0, this.size/2))],
      ["Right",  this.position.add(new Vector3(this.size/2, 0, 0))],
      ["Left",  this.position.add(new Vector3(-this.size/2, 0, 0))],
    ];
    sides.forEach(side => {
      const node = new Node(side[0], side[1], this.size, this);
      this.nodes.push(node);
    });
  }
}
