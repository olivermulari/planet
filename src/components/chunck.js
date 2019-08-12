// how many times to distance
const sharpenRatio = 4;

export default class Chunck {
  constructor(name, side, parent, material, relPos) {
    this.planet = parent.planet;
    this.side = side;
    this.parent = parent;
    this.parents = parent.parents.concat([this.parent]);
    this.name = name;
    this.depth = parent.depth + 1;
    this.direction = parent.direction;
    this.rotX = parent.rotX;
    this.rotY = parent.rotY;
    this.relativePosition = relPos;
    this.size = parent.size / 2;
    this.mesh = null;
    this.distance = null;
    this.material = material;
    this.isShowing = true;
    this.chuncks = [];
    this.create();
  }
  create() {
    this.mesh = BABYLON.MeshBuilder.CreateGround(this.name, {height: this.size, width: this.size, subdivisions: this.planet.resolution, updatable: true}, this.planet.scene);
    this.mesh.position = this.parent.mesh.position;
    this.mesh.rotate(new BABYLON.Vector3(1, 0, 0), this.rotX, BABYLON.Space.WORLD);
    this.mesh.rotate(new BABYLON.Vector3(0, 1, 0), this.rotY, BABYLON.Space.WORLD);
    this.mesh.material = this.material;
    this.moveVertexData(this.mesh);
    this.mesh.chunck = this;

    // methods in side-class
    this.side.round(this.mesh);
    this.side.calculateNormals(this.mesh);
  }

  moveVertexData(mesh) {
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    if (!this.parent.isSide()) this.relativePosition.addInPlace(this.parent.relativePosition);
    for(let i = 0; i<positions.length/3; i++) {
      const v = new BABYLON.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]);
      positions[i*3] = v.x + this.relativePosition.x;
      positions[i*3+1] = v.y + this.relativePosition.y;
      positions[i*3+2] = v.z + this.relativePosition.z;
    }
    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
  }

  updateDistance(camera) {
    const dist = BABYLON.Vector3.Distance(camera.globalPosition, this.mesh.getBoundingInfo().boundingBox.centerWorld);
    this.distance = dist;
    return dist;
  }

  checkIfMakeChuncks(dist) {
    if (dist < sharpenRatio * this.size) {
      this.makeChuncks();
      this.mesh.setEnabled(false);
      return true;
    } else if (dist > sharpenRatio * this.parent.size) {
      this.parent.disposeChuncks();
      this.parent.checkIfMakeChuncks(dist);
      return true;
    } else {
      return false;
    }
  }

  makeChuncks() {
    const offSet = this.size / 4.0;
    const relativePositions = {
      1: (new BABYLON.Vector3(-1.0, 0, 1.0).scale(offSet)),
      2: (new BABYLON.Vector3(1.0, 0, 1.0).scale(offSet)),
      3: (new BABYLON.Vector3(-1.0, 0, -1.0).scale(offSet)),
      4: (new BABYLON.Vector3(1.0, 0, -1.0).scale(offSet)),
    };
      /*
      const materials = {
          1: createPlastic(this.planet.scene),
          2: this.side.material,
          3: createMetal(this.planet.scene),
          4: createGlass(this.planet.scene),
      };
      */

    // tee neljä pienempää tasoa samalla resoluutiolla
    for (let i = 1; i <= 4; i++) {
      const chunck = new Chunck(`${this.name}_Chunck${i}`, this.side, this, this.planet.scene.glassMaterials[i - 1], relativePositions[i]);
      this.chuncks.push(chunck);
      this.planet.nodes.push(chunck);
    }
    this.isShowing = false;
  }

  disposeChuncks() {
    this.chuncks.forEach((chunck) => {
      chunck.disposeChuncks();
      chunck.mesh.dispose(); 
    });
    this.chuncks = [];
    this.mesh.setEnabled(true);
    this.isShowing = true;
  }

  isSide() {
    return false;
  }
}
