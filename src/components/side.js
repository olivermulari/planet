import Chunck from './chunck';

// how many times to distance
const sharpenRatio = 4;

export default class Side {
  constructor(info, planet, resolution) {
    this.planet = planet;
    this.parent = planet;
    this.parents = [];
    this.name = info.name;
    this.depth = 1;
    this.direction = info.dir;
    this.rotX = info.rotX;
    this.rotY = info.rotY;
    this.size = ((1.0 / Math.sqrt(3)) * this.planet.size) * 2.0;
    this.mesh = null;
    this.distance = null;
    this.roundingVector = new BABYLON.Vector3(0, 1.0, 0).scale(this.size / 2.0); // assistent of rounding vertex data
    this.material = this.planet.material;
    this.isShowing = true;
    this.resolution = resolution;
    this.chuncks = [];
    this.create(info);
  }
  create(info) {
    this.mesh = BABYLON.MeshBuilder.CreateGround(this.name, {height: this.size, width: this.size, subdivisions: this.planet.resolution, updatable: true}, this.planet.scene);
    this.mesh.position = this.planet.position.add(info.dir.scale(this.size / 2.0));
    this.mesh.rotate(new BABYLON.Vector3(1, 0, 0), info.rotX, BABYLON.Space.WORLD);
    this.mesh.rotate(new BABYLON.Vector3(0, 1, 0), info.rotY, BABYLON.Space.WORLD);
    this.mesh.material = this.material;
    this.mesh.chunck = this;

    // this.round();
    // this.calculateNormals();
  }

  round(mesh) {
    const getLocalPos = (x, y, z) => {
      const localPos = new BABYLON.Vector3(x, y, z);
      const pos = localPos.add(this.roundingVector);
      const scale2 = this.planet.size / pos.length();
      return pos.scale(scale2).add(this.roundingVector.negate());
    };
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for(let i = 0; i<positions.length/3; i++) {
      const v = getLocalPos(positions[i*3], positions[i*3+1], positions[i*3+2]);
      /*
          const x = positions[i*3];
          const y = positions[i*3+1];
          const z = positions[i*3+2];
          const v = {
            x: x * Math.sqrt(1 - (Math.pow(y, 2) / 2) - (Math.pow(z, 2) / 2) + ((Math.pow(y, 2) * Math.pow(z, 2)) / 3)),
            y: y * Math.sqrt(1 - (Math.pow(z, 2) / 2) - (Math.pow(x, 2) / 2) + ((Math.pow(z, 2) * Math.pow(x, 2)) / 3)),
            z: z * Math.sqrt(1 - (Math.pow(x, 2) / 2) - (Math.pow(y, 2) / 2) + ((Math.pow(x, 2) * Math.pow(y, 2)) / 3))
          }
      */
      positions[i*3] = v.x;
      positions[i*3+1] = v.y;
      positions[i*3+2] = v.z;
    }
    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

    // working!! makes a box around object
    mesh.refreshBoundingInfo(true);
  }

  calculateNormals(mesh) {
    const getAngle = (x, y, z) => {
      const localPos = new BABYLON.Vector3(x, y, z);
      const pos = localPos.add(this.roundingVector);
      return pos.scale(1.0 / pos.length());
    };
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for(var i = 0; i<normals.length/3; i++) {
      const v = getAngle(positions[i*3], positions[i*3+1], positions[i*3+2]);
      normals[i*3] = v.x;
      normals[i*3+1] = v.y;
      normals[i*3+2] = v.z;
    }
    mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  }

  updateDistance(camera) {
    // must find the closest vertex pos of mesh !
    // because all meshes are same, the closest of four?
    const dist = BABYLON.Vector3.Distance(camera.globalPosition, this.mesh.getBoundingInfo().boundingBox.centerWorld);
    this.distance = dist;
    return dist;
  }

  checkIfMakeChuncks() {
    if (this.distance < sharpenRatio * this.size) {
      this.makeChuncks();
      this.mesh.setEnabled(false);
      return true;
    } else {
      this.disposeChuncks();
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
          2: this.material,
          3: createMetal(this.planet.scene),
          4: createGlass(this.planet.scene),
      };
      */

    // tee neljä pienempää tasoa samalla resoluutiolla
    for (let i = 1; i <= 4; i++) {
      const chunck = new Chunck(`${this.name}_Chunck${i}`, this, this, this.planet.scene.glassMaterials[i - 1], relativePositions[i]);
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
    return true;
  }
}
