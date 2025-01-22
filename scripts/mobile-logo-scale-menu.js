function convertToZeroToTwo(value, minOriginal, maxOriginal) {
  let rangeOriginal = maxOriginal - minOriginal;
  let newValue = ((value - minOriginal) / rangeOriginal) * 2;
  const res = Math.min(newValue, 2);
  return res.toFixed(3);
}

export function mobileLogoScaleMenu(canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const scaleRange = document.getElementById("mobile-scale-slider");
  const scaleValueElement = document.getElementById("mobile-scale-value");

  let newMaxScaleValue;

  function setMaxScaleValue() {
    const maxScaleValue = activeObject.getScaledWidth();
    newMaxScaleValue = (maxScaleValue - 1) * 2;
    scaleRange.max = newMaxScaleValue;
    scaleRange.min = 0;
    scaleRange.value = maxScaleValue - 1;
    scaleRange.value = convertToZeroToTwo(maxScaleValue, 0, newMaxScaleValue);
  }

  canvas.on("selection:updated", setMaxScaleValue);
  canvas.on("selection:created", setMaxScaleValue);

  if (!scaleRange) return;
  scaleRange.addEventListener("input", (e) => {
    const scaleValue = e.target.value;
    scaleValueElement.innerText = (scaleValue / 100) * 2;
    activeObject.scale(scaleValue);
    canvas.requestRenderAll();
  });
}
