import { Mesh, VertexData, Vector3 } from "@babylonjs/core";

/**
 * Generates a single plane with resolution options
 * 
 * @param {string} direction Eighter Up, Down, Front, Back, Right, Left
 * @param {Vector3} position
 * @param {number} size 
 * @param {number} resolution
 * @param {AbstractScene} scene
 * @returns {BABYLON.Mesh} customMesh
 */

export function generatePlaneMesh(direction, position, size, resolution, scene) {
  const amountOfBlocks = Math.pow(resolution, 2);
  const blockSize = size / resolution;

  const customMesh = new Mesh("", scene);
  const indices = Array.from(Array(amountOfBlocks * 24).keys());

  let generateVertexData;
  switch (direction) {
  case "Front":
    generateVertexData = generateVertexDataFront;
    break;
  case "Back": 
    generateVertexData = generateVertexDataBack;
    break;
  case "Up":
    generateVertexData = generateVertexDataUp;
    break;
  case "Down":
    generateVertexData = generateVertexDataDown;
    break;
  case "Right":
    generateVertexData = generateVertexDataRight;
    break;
  case "Left":
    generateVertexData = generateVertexDataLeft;
    break;
  }

  const vertexData = new VertexData();
  vertexData.positions = generateVertexData(position, size, blockSize, resolution);
  vertexData.indices = indices;
  vertexData.applyToMesh(customMesh, true);

  return customMesh;
}

// Repeat beacuse all sides require different 2-dim array configurations
// starts from -x : y
function generateVertexDataFront(position, size, blockSize, resolution) {
  const positions = [];
  for (let y = resolution - 1; y >= 0; y--) {
    for (let x = 0; x < resolution; x++) {
      const xPos = x * blockSize - (size/2) + (blockSize/2);
      const yPos = y * blockSize - (size/2) + (blockSize/2);
      const pos = position.add(new Vector3(xPos, yPos, 0));
      const vertexData = generateSingleVertexDataFront(pos, blockSize);
      positions.push(vertexData);
    }  
  }
  return positions.flat();
}

// starts from x : y
function generateVertexDataBack(position, size, blockSize, resolution) {
  const positions = [];
  for (let y = resolution - 1; y >= 0; y--) {
    for (let x = resolution - 1; x >= 0; x--) {
      const xPos = x * blockSize - (size/2) + (blockSize/2);
      const yPos = y * blockSize - (size/2) + (blockSize/2);
      const pos = position.add(new Vector3(xPos, yPos, 0));
      const vertexData = generateSingleVertexDataBack(pos, blockSize);
      positions.push(vertexData);
    }  
  }
  return positions.flat();
}

// starts from -x : z
function generateVertexDataUp(position, size, blockSize, resolution) {
  const positions = [];
  for (let z = resolution - 1; z >= 0; z--) {
    for (let x = 0; x < resolution; x++) {
      const xPos = x * blockSize - (size/2) + (blockSize/2);
      const zPos = z * blockSize - (size/2) + (blockSize/2);
      const pos = position.add(new Vector3(xPos, 0, zPos));
      const vertexData = generateSingleVertexDataUp(pos, blockSize);
      positions.push(vertexData);
    }  
  }
  return positions.flat();
}

// starts from -x : -z
function generateVertexDataDown(position, size, blockSize, resolution) {
  const positions = [];
  for (let z = 0; z < resolution; z++) {
    for (let x = 0; x < resolution; x++) {
      const xPos = x * blockSize - (size/2) + (blockSize/2);
      const zPos = z * blockSize - (size/2) + (blockSize/2);
      const pos = position.add(new Vector3(xPos, 0, zPos));
      const vertexData = generateSingleVertexDataDown(pos, blockSize);
      positions.push(vertexData);
    }  
  }
  return positions.flat();
}

// starts from -z : y
function generateVertexDataRight(position, size, blockSize, resolution) {
  const positions = [];
  for (let y = resolution - 1; y >= 0; y--) {
    for (let z = 0; z < resolution; z++) {
      const zPos = z * blockSize - (size/2) + (blockSize/2);
      const yPos = y * blockSize - (size/2) + (blockSize/2);
      const pos = position.add(new Vector3(0, yPos, zPos));
      const vertexData = generateSingleVertexDataRight(pos, blockSize);
      positions.push(vertexData);
    }  
  }
  return positions.flat();
}

// starts from z : y
function generateVertexDataLeft(position, size, blockSize, resolution) {
  const positions = [];
  for (let y = resolution - 1; y >= 0; y--) {
    for (let z = resolution - 1; z >= 0; z--) {
      const zPos = z * blockSize - (size/2) + (blockSize/2);
      const yPos = y * blockSize - (size/2) + (blockSize/2);
      const pos = position.add(new Vector3(0, yPos, zPos));
      const vertexData = generateSingleVertexDataLeft(pos, blockSize);
      positions.push(vertexData);
    }  
  }
  return positions.flat();
}

// Manually written to optimise limited performance

function generateSingleVertexDataFront(pos, size) {
  const x = pos.x;
  const y = pos.y;
  const z = pos.z;
  const n = size/2;

  return [
    // 1
    x    , y    , z,
    x - n, y + n, z,
    x - n, y    , z,
    // 2
    x    , y    , z,
    x    , y + n, z,
    x - n, y + n, z,
    // 3
    x    , y    , z,
    x + n, y + n, z,
    x    , y + n, z,
    // 4
    x    , y    , z,
    x + n, y    , z,
    x + n, y + n, z,
    // 5
    x    , y    , z,
    x + n, y - n, z,
    x + n, y    , z,
    // 6
    x    , y    , z,
    x    , y - n, z,
    x + n, y - n, z,
    // 7
    x    , y    , z,
    x - n, y - n, z,
    x    , y - n, z,
    // 8
    x    , y    , z,
    x - n, y    , z,
    x - n, y - n, z,
  ];
}

function generateSingleVertexDataBack(pos, size) {
  const x = pos.x;
  const y = pos.y;
  const z = pos.z;
  const n = size/2;

  return [
    // 1
    x    , y    , z,
    x + n, y + n, z,
    x + n, y    , z,
    // 2
    x    , y    , z,
    x    , y + n, z,
    x + n, y + n, z,
    // 3
    x    , y    , z,
    x - n, y + n, z,
    x    , y + n, z,
    // 4
    x    , y    , z,
    x - n, y    , z,
    x - n, y + n, z,
    // 5
    x    , y    , z,
    x - n, y - n, z,
    x - n, y    , z,
    // 6
    x    , y    , z,
    x    , y - n, z,
    x - n, y - n, z,
    // 7
    x    , y    , z,
    x + n, y - n, z,
    x    , y - n, z,
    // 8
    x    , y    , z,
    x + n, y    , z,
    x + n, y - n, z,
  ];
}

function generateSingleVertexDataUp(pos, size) {
  const x = pos.x;
  const y = pos.y;
  const z = pos.z;
  const n = size/2;

  return [
    // 1
    x    , y, z    ,
    x - n, y, z + n,
    x - n, y, z    ,
    // 2
    x    , y, z,
    x    , y, z + n,
    x - n, y, z + n,
    // 3
    x    , y, z    ,
    x + n, y, z + n,
    x    , y, z + n,
    // 4
    x    , y, z    ,
    x + n, y, z    ,
    x + n, y, z + n,
    // 5
    x    , y, z    ,
    x + n, y, z - n,
    x + n, y, z    ,
    // 6
    x    , y, z    ,
    x    , y, z - n,
    x + n, y, z - n,
    // 7
    x    , y, z    ,
    x - n, y, z - n,
    x    , y, z - n,
    // 8
    x    , y, z    ,
    x - n, y, z    ,
    x - n, y, z - n,
  ];
}

function generateSingleVertexDataDown(pos, size) {
  const x = pos.x;
  const y = pos.y;
  const z = pos.z;
  const n = size/2;

  return [
    // 1
    x    , y, z    ,
    x - n, y, z - n,
    x - n, y, z    ,
    // 2
    x    , y, z    ,
    x    , y, z - n,
    x - n, y, z - n,
    // 3
    x    , y, z    ,
    x + n, y, z - n,
    x    , y, z - n,
    // 4
    x    , y, z    ,
    x + n, y, z    ,
    x + n, y, z - n,
    // 5
    x    , y, z    ,
    x + n, y, z + n,
    x + n, y, z    ,
    // 6
    x    , y, z    ,
    x    , y, z + n,
    x + n, y, z + n,
    // 7
    x    , y, z    ,
    x - n, y, z + n,
    x    , y, z + n,
    // 8
    x    , y, z    ,
    x - n, y, z    ,
    x - n, y, z + n,
  ];
}

function generateSingleVertexDataRight(pos, size) {
  const x = pos.x;
  const y = pos.y;
  const z = pos.z;
  const n = size/2;

  return [
    // 1
    x, y    , z    ,
    x, y + n, z - n,
    x, y    , z - n,
    // 2
    x, y    , z    ,
    x, y + n, z    ,
    x, y + n, z - n,
    // 3
    x, y    , z    ,
    x, y + n, z + n,
    x, y + n, z    ,
    // 4
    x, y    , z    ,
    x, y    , z + n,
    x, y + n, z + n,
    // 5
    x, y    , z    ,
    x, y - n, z + n,
    x, y    , z + n,
    // 6
    x, y    , z    ,
    x, y - n, z    ,
    x, y - n, z + n,
    // 7
    x, y    , z    ,
    x, y - n, z - n,
    x, y - n, z    ,
    // 8
    x, y    , z    ,
    x, y    , z - n,
    x, y - n, z - n,
  ];
}

function generateSingleVertexDataLeft(pos, size) {
  const x = pos.x;
  const y = pos.y;
  const z = pos.z;
  const n = size/2;

  // not done
  return [
    // 1
    x, y    , z    ,
    x, y + n, z + n,
    x, y    , z + n,
    // 2
    x, y    , z    ,
    x, y + n, z    ,
    x, y + n, z + n,
    // 3
    x, y    , z    ,
    x, y + n, z - n,
    x, y + n, z    ,
    // 4
    x, y    , z    ,
    x, y    , z - n,
    x, y + n, z - n,
    // 5
    x, y    , z    ,
    x, y - n, z - n,
    x, y    , z - n,
    // 6
    x, y    , z    ,
    x, y - n, z    ,
    x, y - n, z - n,
    // 7
    x, y    , z    ,
    x, y - n, z + n,
    x, y - n, z    ,
    // 8
    x, y    , z    ,
    x, y    , z + n,
    x, y - n, z + n,
  ];
}
