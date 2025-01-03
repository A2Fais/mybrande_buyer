import { canvas } from "./main.js";
import { rotateReset } from "./rotate_reset";

export function mobileLogoRotateMenu(activeObject) {
  if (!activeObject) return;

  const rotateSlider = document.querySelector("#mobile-rotate-slider");
  const rotateValueElement = document.getElementById("mobile-rotate-value");

  rotateSlider.addEventListener("input", (event) => {
    const rotateValue = event.target.value;
    activeObject.rotate(rotateValue);
    canvas.requestRenderAll();
    rotateValueElement.innerText = `Rotate: ${rotateValue}°`;
  });
}
