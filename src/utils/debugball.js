// ball to the center for debugging purposes
export function createBall(pos, scene) {
  // center ball
  let ball = BABYLON.MeshBuilder.CreateSphere("", {diameter: 0.2}, scene);
  ball.position = pos;
  let ballMaterial = new BABYLON.StandardMaterial("", scene);
  ballMaterial.diffuseColor = new BABYLON.Color3(1.0, 0, 0);
  ball.material = ballMaterial;

  // not pickable
  ball.isPickable = false;

  // Apply gravity to ball
  ball.checkCollisions = true;
  ball.applyGravity = true;
}
