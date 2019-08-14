import { Vector3 } from '@babylonjs/core';

import Node from './node';
import { createGlass } from '../scripts/materials';
import Perlin from './utils/perlin';

/**
 * TODO: way to handle unEnabled nodes
 * 1. a separate dispose array for inactive nodes that check every once in a while
 *    are there any chuncks to dispose -> furthest first
 * 2. dispose loop?
 * 3. update queue more often when there is strong movements?
 * 4. implement advanced pooling instead of disposing nodes?
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
    this.disposeQueue = [];

    // for keykodes
    this.scene.updatePlanet = true;

    // terrain generation object
    this.perlin = new Perlin();

    this.onCreate();
  }

  onCreate() {
    this.createSides();
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
   * 1.1 dispose the one that can be
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
      this.disposeAllInQueue();
      this.queue = this.makeQueuesFromNodes(this.nodes);
    } else {
      let current;
      let updated = false; 
      while (this.queue.length > 0 && !updated) {
        current = this.queue.shift();
        updated = current.checkIfUpdates();
      }
      if (updated) {
        // if nodes disposed insert to queue
        if (current.nodes) {
          this.queue = this.insertNodesToQueue(current.nodes, this.queue);
        }
      }
    }
    // dispose one in the dispose queue
    if (this.disposeQueue.length > 0) {
      this.disposeQueue.shift().checkIfDisposeNodes();
    }
  }

  makeQueuesFromNodes(nodes) {
    this.setDistances(nodes);
    const copy = nodes.filter(node => {
      const term = node.isRenderable();
      if (!term) {
        this.disposeQueue.push(node);
        return false;
      } return true;
    });
    copy.sort((l, r) => l.distance - r.distance);
    this.disposeQueue.sort((l, r) => l.distance - r.distance);
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
      node.setIsVisible(this.scene.activeCamera);
    });
  }

  disposeAllInQueue() {
    while (this.disposeQueue.length > 0) {
      this.disposeQueue.shift().checkIfDisposeNodes();
    }
  }
}
