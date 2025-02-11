export function attachRGBHandlers(colorPicker, canvas, prefix = '') {
    [`#R${prefix}`, `#G${prefix}`, `#B${prefix}`].forEach((id) => {
      document.querySelector(id).addEventListener("input", () => {
        const r = document.querySelector(`#R${prefix}`).value;
        const g = document.querySelector(`#G${prefix}`).value;
        const b = document.querySelector(`#B${prefix}`).value;
        
        colorPicker.color.rgb = { r, g, b };
        updateActiveObjectColor(canvas, colorPicker.color.hexString);
      });
    });
  }

  export function attachHSLHandlers(colorPicker, canvas, prefix = '') {
    [`#H${prefix}`, `#S${prefix}`, `#L${prefix}`].forEach((id) => {
      document.querySelector(id).addEventListener("input", () => {
        const h = document.querySelector(`#H${prefix}`).value;
        const s = document.querySelector(`#S${prefix}`).value;
        const l = document.querySelector(`#L${prefix}`).value;
        
        colorPicker.color.hsl = { h, s, l };
        updateActiveObjectColor(canvas, colorPicker.color.hexString);
      });
    });
  }

  function updateActiveObjectColor(canvas, color) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
  
    if (activeObj._objects) {
      activeObj._objects.forEach(obj => obj.set("fill", color));
    }
    activeObj.set("fill", color);
    canvas.requestRenderAll();
  }