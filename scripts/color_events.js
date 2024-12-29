import {
  convertRGBtoHex,
  hexToHsl,
  hexToRgb,
  rgbToHex,
} from "./color_converter";
import { querySelect, querySelectAll } from "./selectors";

export const getParsedColor = (color) => {
  if (color && typeof color === "string") {
    if (color?.includes("#")) {
      return color;
    } else if (color && color.colorStops) {
      return rgbToHex(color?.colorStops[0]?.color);
    } else {
      return rgbToHex(color);
    }
  }
};

export function updateColorPickers(canvas, colorPicker) {
  if (!canvas || !colorPicker) throw new Error("couldn't find canvas");
  for (let i = 0; i <= 1; i++) {
    let colorSet = new Set();
    const colorPalette = querySelectAll("#logo_colors_pallete")[i];
    const canvasObjects = canvas?.getObjects();
    if (!canvasObjects) return;
    canvasObjects?.forEach((item) => {
      let itemFill = item.get("fill");
      const colPicker = document.createElement("div");

      if (getParsedColor(itemFill) !== undefined) {
        let color = getParsedColor(itemFill);
        color = color.padEnd(7, "0");

        if (!colorSet.has(color)) {
          colorSet.add(color);
          colPicker.setAttribute("id", "color-layers-pickers");

          colPicker.style.background = itemFill;
          colPicker.className = "color-picker";
          colPicker.style.borderRadius = "5px";
          colorPalette.append(colPicker);
          if (color.includes("#ffffff")) {
            colPicker.style.border = "1px solid #aaaaaa";
          }
        }
        colPicker.addEventListener("click", (event) => {
          const color = rgbToHex(event.target.style.backgroundColor);
          const activeElem = canvas.getActiveObject();

          if (activeElem && activeElem._objects)
            activeElem._objects.forEach((obj) => {
              obj.set("fill", color);
            });

          activeElem.set("fill", color);
          canvas.renderAll();

          colorPicker.color.set(color);
          querySelect("#HEX").value = color;

          let rgbValue = hexToRgb(color);
          let rgbValues = rgbValue.match(/\d+/g);

          if (rgbValues && rgbValues.length === 3) {
            querySelect("#R").value = rgbValues[0];
            querySelect("#G").value = rgbValues[1];
            querySelect("#B").value = rgbValues[2];
          }
          let hslValue = hexToHsl(color);
          let hslValues = hslValue.match(/\d+/g);

          if (hslValues && hslValues.length === 3) {
            querySelect("#H").value = hslValues[0];
            querySelect("#S").value = hslValues[1];
            querySelect("#L").value = hslValues[2];
          }
          canvas.renderAll();
          updatePreview();
          if (activeElem) canvas.save();
        });
      }
    });
  }
}
export function updateColorTextPickers(canvas, updatePreview) {
  let itemFill, colPicker;
  const canvasObjects = canvas?.getObjects();
  canvasObjects?.forEach((item) => {
    itemFill = item.get("fill");

    colPicker = document.createElement("input");
    colPicker.setAttribute("id", "color-layers-pickers");
    colPicker.setAttribute("type", "color");

    if (typeof itemFill === "string") {
      colPicker.setAttribute("value", itemFill);
    } else {
      const gradientColor = itemFill.colorStops[0].color;
      const rgbValues = gradientColor.match(/\d+/g);
      if (rgbValues && rgbValues.length === 3) {
        const hexColor = convertRGBtoHex(
          parseInt(rgbValues[0]),
          parseInt(rgbValues[1]),
          parseInt(rgbValues[2]),
        );
        colPicker.setAttribute("value", hexColor);
      }
    }

    colPicker.className = "color-picker";
    colPicker.style.borderRadius = "5px";

    colPicker.addEventListener("input", (event) => {
      const color = event.target.value;
      item.set("fill", color);
      this.canvas.requestRenderAll();
    });
  });
  updatePreview();
}

function applyColorAction(
  item,
  canvas,
  colorPicker,
  updatePreview,
  hexInputId,
  hslInputs,
  rgbInputs,
) {
  item.addEventListener("click", (event) => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      const bgColor = event.target.style.backgroundColor;
      const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bgColor);
      if (match) {
        const [red, green, blue] = match.slice(1, 4).map(Number);
        const hexColor = convertRGBtoHex(red, green, blue);

        if (activeObj._objects) {
          activeObj._objects.forEach((i) => i.set("fill", hexColor));
        } else {
          activeObj.set("fill", hexColor);
        }

        colorPicker.color.set(hexColor);
        querySelect(hexInputId).value = hexColor;

        const hslValues = hexToHsl(hexColor).match(/\d+/g);
        if (hslValues) {
          hslValues.forEach(
            (val, idx) => (querySelect(hslInputs[idx]).value = val),
          );
        }

        const rgbValues = hexToRgb(hexColor).match(/\d+/g);
        if (rgbValues) {
          rgbValues.forEach(
            (val, idx) => (querySelect(rgbInputs[idx]).value = val),
          );
        }

        querySelectAll("#color-layers-pickers").forEach((i) => i.remove());
        updateColorPickers(canvas, updatePreview);
        canvas.renderAll();
        updatePreview();
        canvas.save();
      }
    }
  });
}

export function solidColorAction(item, canvas, colorPicker, updatePreview) {
  applyColorAction(
    item,
    canvas,
    colorPicker,
    updatePreview,
    "#HEX",
    ["#H", "#S", "#L"],
    ["#R", "#G", "#B"],
  );
}

export function solidColorTextAction(
  item,
  canvas,
  colorPickerText,
  updatePreview,
) {
  applyColorAction(
    item,
    canvas,
    colorPickerText,
    updatePreview,
    "#HEX2",
    ["#H2", "#S2", "#L2"],
    ["#R2", "#G2", "#B2"],
  );
}

export function bgColorAction(
  item,
  canvas,
  updatePreview = null,
  isMobile = false,
) {
  item.addEventListener("click", (event) => {
    if (canvas) {
      const bgColor = event.target.style.backgroundColor;
      const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bgColor);
      if (match) {
        const red = parseInt(match[1]);
        const green = parseInt(match[2]);
        const blue = parseInt(match[3]);
        const hexColor = convertRGBtoHex(red, green, blue);
        canvas.setBackgroundColor(hexColor);
        const hslValue = hexToHsl(hexColor);
        const hslValues = hslValue.match(/\d+/g);

        querySelect("#HEX_BG").value = hexColor;
        if (hslValues && hslValues.length === 3) {
          querySelect("#H_BG").value = hslValues[0];
          querySelect("#S_BG").value = hslValues[1];
          querySelect("#L_BG").value = hslValues[2];
        }
        const rgbValue = hexToRgb(hexColor);
        const rgbValues = rgbValue.match(/\d+/g);

        if (rgbValues && rgbValues.length === 3) {
          querySelect("#R_BG").value = rgbValues[0];
          querySelect("#G_BG").value = rgbValues[1];
          querySelect("#B_BG").value = rgbValues[2];
        }

        const logoColorPickers = querySelectAll("#color-layers-pickers");
        logoColorPickers.forEach((i) => i.remove());
        if (!isMobile) {
          updateColorPickers(canvas, updatePreview);
        }
        canvas.renderAll();
        canvas.save();
      }
      updatePreview && updatePreview();
    }
  });
}
