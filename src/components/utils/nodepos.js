import { Vector3 } from "@babylonjs/core";

/**
 * Helps to determine position of child nodes
 * @param {string} name 
 * @param {Vector3} position 
 * @param {number} size
 * @returns {(index: number) => Vector3}
 */
export function figureNodePosFunc(name, position, size) {
  const pos = position;
  const offSet = size/4;
  switch(name) {
  case "Front":
    return (num) => {
      switch (num) {
      case 1:
        return pos.add(new Vector3(-offSet, offSet, 0));
      case 2:
        return pos.add(new Vector3(offSet, offSet, 0));
      case 3:
        return pos.add(new Vector3(-offSet, -offSet, 0));
      case 4:
        return pos.add(new Vector3(offSet, -offSet, 0));
      }
    };
  case "Back":
    return (num) => {
      switch (num) {
      case 1:
        return pos.add(new Vector3(offSet, offSet, 0));
      case 2:
        return pos.add(new Vector3(-offSet, offSet, 0));
      case 3:
        return pos.add(new Vector3(offSet, -offSet, 0));
      case 4:
        return pos.add(new Vector3(-offSet, -offSet, 0));
      }
    };
  case "Up":
    return (num) => {
      switch (num) {
      case 1:
        return pos.add(new Vector3(-offSet, 0, offSet));
      case 2:
        return pos.add(new Vector3(offSet, 0, offSet));
      case 3:
        return pos.add(new Vector3(-offSet, 0, -offSet));
      case 4:
        return pos.add(new Vector3(offSet, 0, -offSet));
      }
    };
  case "Down":
    return (num) => {
      switch (num) {
      case 1:
        return pos.add(new Vector3(-offSet, 0, -offSet));
      case 2:
        return pos.add(new Vector3(offSet, 0, -offSet));
      case 3:
        return pos.add(new Vector3(-offSet, 0, offSet));
      case 4:
        return pos.add(new Vector3(offSet, 0, offSet));
      }
    };
  case "Right":
    return (num) => {
      switch (num) {
      case 1:
        return pos.add(new Vector3(0, offSet, -offSet));
      case 2:
        return pos.add(new Vector3(0, offSet, offSet));
      case 3:
        return pos.add(new Vector3(0, -offSet, -offSet));
      case 4:
        return pos.add(new Vector3(0, -offSet, offSet));
      }
    };
  case "Left":
    return (num) => {
      switch (num) {
      case 1:
        return pos.add(new Vector3(0, offSet, offSet));
      case 2:
        return pos.add(new Vector3(0, offSet, -offSet));
      case 3:
        return pos.add(new Vector3(0, -offSet, offSet));
      case 4:
        return pos.add(new Vector3(0, -offSet, -offSet));
      }
    };
  }
}
