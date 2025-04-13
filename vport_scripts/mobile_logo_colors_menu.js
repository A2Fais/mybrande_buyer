import { applyColorActionMobile } from "../scripts/color_events.js";
import { ApplyLinearGradient } from "../scripts/apply_linear_grad.js";
import { convertRGBtoHex } from "../scripts/color_converter.js";
import iro from "@jaames/iro";

export function mobileLogoColorsMenu(canvas) {
  if (!canvas) return;

  const colorCategories = document?.getElementById(
    "mobile-logo-color-categories",
  );
  const solidCategory = document.querySelector("#mobile-logo-solid-category");
  const pickerCategory = document.querySelector(
    "#mobile-logo-color-picker-category",
  );
  const linearCategory = document.querySelector("#mobile-logo-linear-category");
  const noneCategory = document.querySelector("#mobile-logo-none-category");

  const solidSection = document.getElementById(
    "mobile-logo-solid-color-section",
  );
  const pickerSection = document.getElementById(
    "mobile-logo-picker-color-section",
  );
  const linearSection = document.getElementById(
    "mobile-logo-linear-color-section",
  );
  const noneSection = document.getElementById("mobile-logo-none-color-section");

  // Categories event listeners
  solidCategory.addEventListener("click", () => {
    colorCategories.style.display = "none";
    solidSection.style.display = "grid";
    solidSection.style.gridTemplateColumns = "repeat(4, 1fr)";
    solidSection.style.padding = "15px";
    document.querySelector("#content-container").style.height = "100px";

    const layerBar = document.querySelector("#mobile-logo-layers-bar");
    layerBar.style.bottom = "100px"
    linearSection.style.display = "none";
    noneSection.style.display = "none";
  });

  // Solid Colors Action
  const solidColors = document.querySelectorAll("#solid_color-bg-mobile");
  solidColors.forEach((item) => {
    item.addEventListener("click", (event) => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      const bgColor = event.target.style.backgroundColor;

      const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bgColor);
      if (!match) return;

      const [red, green, blue] = match.slice(1, 4).map(Number);
      const hexColor = convertRGBtoHex(red, green, blue);

      if (activeObject._objects) {
        activeObject._objects.forEach((i) => i.set("fill", hexColor));
      } else {
        activeObject.set("fill", hexColor);
      }

      // if (colorPicker) {
      //   colorPicker.color.set(hexColor);
      // }

      canvas.renderAll();
      canvas.save();
    });
    // applyColorActionMobile(item, canvas, activeObject);
  });

  // Color picker event listeners
  pickerCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    pickerSection.style.display = "flex";
    solidSection.style.display = "none";
    linearSection.style.display = "none";
    noneSection.style.display = "none";
    const layerBar = document.querySelector("#mobile-logo-layers-bar");
    layerBar.style.bottom = "160px"
  });

  // Linear event listeners
  linearCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    solidSection.style.display = "none";
    linearSection.style.display = "flex";
    noneSection.style.display = "none";
  });

  // Linear Colors Actions
  let bgGrad1, bgGrad2;
  const mobileBgPalleteComponent = document.querySelector("#mobile-bg-pallete");
  mobileBgPalleteComponent?.addEventListener("colorChanged", ({ target }) => {
    [bgGrad1, bgGrad2] = [
      target.querySelector("#grad-1").value,
      target.querySelector("#grad-2").value,
    ];
  });

  if (!mobileBgPalleteComponent) return;
  mobileBgPalleteComponent
    ?.querySelector(".color-palette-gradient")
    ?.addEventListener("click", () => {
      const applyColor = new ApplyLinearGradient(
        canvas,
        bgGrad1,
        bgGrad2,
        false,
      );
      applyColor.setColor();
    });

  // None Background
  noneCategory?.addEventListener("click", () => {
    canvas.setBackgroundColor("#fff");
    canvas.renderAll();
  });

  const colorPicker = new iro.ColorPicker("#mobile-logo-picker-color-section", {
    width: 130,
    layoutDirection: "horizontal",
    color: "#ffffff",
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "hue",
        },
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "alpha",
        },
      },
    ],
  });

  colorPicker.on("color:change", (color) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const hexColor = color.hexString;
    const rgbaColor = color.rgbaString

    if (activeObject._objects) {
      activeObject._objects.forEach((i) => i.set("fill", rgbaColor));
    } else {
      activeObject.set("fill", rgbaColor);
    }

    canvas.renderAll();
    canvas.save();
  });
}
