import * as BABYLON from "@babylonjs/core/Legacy/legacy";

export function addDebugKeycodes(scene) {
    let isWireframeOn = false;
    let isBoundingBoxesShowing = false;
    scene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case BABYLON.KeyboardEventTypes.KEYDOWN:
				switch (kbInfo.event.key) {
                    case "w":
                    case "W":
                        isWireframeOn = !isWireframeOn;
                        scene.materials.forEach((material) => {
                            material.wireframe = isWireframeOn;
                        });
                    break;
                    case "b":
                    case "B":
                        isBoundingBoxesShowing = !isBoundingBoxesShowing;
                        scene.meshes.forEach((mesh) => {
                            mesh.showBoundingBox = isBoundingBoxesShowing;
                        });
                    break;
                    case "I":
                    case "i":
                        // inspector
                        if (scene.debugLayer.isVisible()) {
                            scene.debugLayer.hide();
                        } else {
                            scene.debugLayer.show();
                        }
                    break;
                }
			break;
		}
	});
}