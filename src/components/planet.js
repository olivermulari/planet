import { Vector3 } from '@babylonjs/core';

import Node from './node';
import { createGlass } from '../scripts/materials';

/**
 * TODO: way to handle unEnabled nodes
 * 1. a separate dispose array for inactive nodes that check every once in a while
 *    are there any chuncks to dispose -> furthest first
 * 2. dispose loop?
 * 3. update queue more often when there is strong movements? 
*/
export default class Planet {
  constructor(scene, position, size, resolution) {
    this.radius = size; // radius
    this.resolution = resolution;
    this.position = position;
    this.scene = scene;
    this.material = createGlass(scene, new BABYLON.Color3(0.3, 0.2, 1.0));
    this.nodes = [];
    this.queue = [];
    this.createSides();

    // for keykodes
    this.scene.updatePlanet = true;
  }

  createSides() {
    const sides = [
      ["Up",    this.position.add(new Vector3(0, this.radius, 0))],
      ["Down",  this.position.add(new Vector3(0, -this.radius, 0))], 
      ["Front", this.position.add(new Vector3(0, 0, -this.radius))], 
      ["Back",  this.position.add(new Vector3(0, 0, this.radius))],
      ["Right",  this.position.add(new Vector3(this.radius, 0, 0))],
      ["Left",  this.position.add(new Vector3(-this.radius, 0, 0))],
    ];
    sides.forEach(side => {
      const node = new Node(side[0], side[1], this.radius*2, this);
      this.nodes.push(node);
    });
  }

  update() {
    if (this.scene.updatePlanet) {
      this.updateQueue();
    }
  }

  /**
   * Updates queue so that closest nodes are updated first
   * Rules:
   * 1. If queue is empty set active nodes to the queue, closest first
   * 2. Else go through queue and check if a node can be updated
   * 3. If node can't be updated, move to the next node
   * 4. If node can be updated 
   *    -> update 
   *    -> place child nodes in queue (in correct place) 
   *    -> end of function
   * Update only one at a time!
   */
  updateQueue() {
    if (this.queue.length == 0) {
      this.queue = this.makeQueueFromNodes(this.nodes);
    } else {
      let current;
      let updated = false; 
      while (this.queue.length > 0 && !updated) {
        current = this.queue.shift();
        updated = current.checkIfUpdates();
      }
      if (updated) {
        this.queue = this.insertNodesToQueue(current.nodes, this.queue);
      }
    }
  }

  makeQueueFromNodes(nodes) {
    this.setDistances(nodes);
    const copy = Array.from(nodes);
    copy.sort((l, r) => l.distance - r.distance);
    return copy;
  }

  insertNodesToQueue(nodes, queue) {
    this.setDistances(nodes);
    const newQueue = [];
    let n = 0;
    let q = 0;
    while (n < nodes.length && q < queue.length) {
      if (nodes[n].distance < queue[q].distance) {
        newQueue.push(nodes[n]);
        n++;
      } else {
        newQueue.push(queue[q]);
        q++;
      }
    }
    // iterate throught the rest
    for (let i = n; i < nodes.length; i++) {
      newQueue.push(nodes[i]);
    }
    for (let i = q; i < queue.length; i++) {
      newQueue.push(queue[i]);
    }
    return newQueue;
  }

  setDistances(nodes) {
    nodes.forEach(node => {
      node.setDistance(this.scene.activeCamera);
    });
  }
}
