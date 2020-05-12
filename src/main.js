import { createScene } from "./scripts/scene";
import { addDebugKeycodes } from "./utils/controls";

import './styles/style.css';

window.addEventListener('DOMContentLoaded', function() {
  const scene = createScene();
  // add keycodes
  addDebugKeycodes(scene);

  setTimeout(() => {
    document.getElementById("loading").style.opacity = 0;
  }, 1000);

});


