export function getMaterialByID(scene, id) {
  switch(id) {
  case 0:
    return scene.customMaterials[0];
  case 1:
    return scene.customMaterials[1];
  case 2:
    return scene.customMaterials[2];
  case 3:
    return scene.customMaterials[3];
  }
}
