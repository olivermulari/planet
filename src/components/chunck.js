// how many times to distance
const sharpenRatio = 8;

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
      this.material = material;
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

  /*
  update() {
      if (this.size / this.planet.resolution > smallestPart) {
          this.checkIfShowChucks()
          if (this.showChuncks) {
              if (this.chuncks.length <= 0) {
                  this.makeChuncks();
              } else {
                  this.chuncks.forEach((chunck) => {
                      chunck.update();
                  });
              }
              this.mesh.setEnabled(false);
          } else {
              this.chuncks.forEach((chunck) => { chunck.mesh.dispose(); });
              this.mesh.setEnabled(true);
              this.chuncks = [];
          }
      }
  }

  checkIfShowChucks() {
      const d = this.planet.scene.activeCamera.globalPosition;
      if (BABYLON.Vector3.Distance(d, this.mesh.position) < this.size * 6) {
          this.showChuncks = true;
      } else {
          this.showChuncks = false;
      }
  }
  */

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

  // not in use
  checkIfDisposeChuncks(dist) {
      if (dist > sharpenRatio * this.parent.size) {
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
      }
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
      }
  }

  disposeChuncks() {
      this.chuncks.forEach((chunck) => {
          chunck.disposeChuncks();
          chunck.mesh.dispose(); 
      });
      this.chuncks = [];
      this.mesh.setEnabled(true);
  }

  isSide() {
      return false;
  }
}