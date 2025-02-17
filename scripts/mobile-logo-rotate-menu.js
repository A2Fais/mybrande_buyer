export function mobileLogoRotateMenu(canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const rotateSlider = document.querySelector("#mobile-rotate-slider");
  const rotateValue = document.querySelector("#mobile-rotate-value");
  const rotateBar = document.querySelector("#rotate-bar");

  rotateSlider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value, 10);
    rotateBar.value = value;
    const event = new Event("input", { bubbles: true });
    rotateBar.dispatchEvent(event)
    rotateValue.innerText = `Rotate: ${value}°`;
  });
}
