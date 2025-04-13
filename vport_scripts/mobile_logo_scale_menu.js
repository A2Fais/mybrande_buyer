export function mobileLogoScaleMenu(canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const scaleRange = document.querySelector("#mobile-scale-slider");
  const mobileScaleValue = document.querySelector("#mobile-scale-value");
  const scaleRangeMain = document.querySelector("#scale-range")

  if (!scaleRange) return;

  let newMaxScaleValue;
  const scaledWidth = activeObject.getScaledWidth();

  function setMaxScaleValue() {
    const maxScaleValue = scaledWidth;
    newMaxScaleValue = (maxScaleValue - 1) * 2;
    scaleRange.max = newMaxScaleValue;
    scaleRange.min = 0;
    scaleRange.value = maxScaleValue - 1;
    // scaleRange.value = convertToZeroToTwo(maxScaleValue, 0, newMaxScaleValue);
  }

  canvas.on("selection:updated", setMaxScaleValue);
  canvas.on("selection:created", setMaxScaleValue);

  scaleRange.addEventListener("input", (e) => {
    const value = e.target.value;
    scaleRangeMain.value = value * 2;
    const event = new Event("input", { bubbles: true });
    const displayValue = document.querySelector("#scale-value");
    mobileScaleValue.innerText = displayValue.value;
    scaleRangeMain.dispatchEvent(event);
  });
}
