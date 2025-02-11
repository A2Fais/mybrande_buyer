export function mobileLogoRotateMenu(canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const rotateSlider = document.querySelector("#mobile-rotate-slider");
  const rotateValueElement = document.getElementById("mobile-rotate-value");

  rotateSlider?.addEventListener("input", (event) => {
    const rotateValue = parseInt(event.target.value, 100);
    activeObject.set("angle", rotateValue);
    canvas.requestRenderAll();
    rotateValueElement.innerText = `Rotate: ${rotateValue}°`;
  });
}
