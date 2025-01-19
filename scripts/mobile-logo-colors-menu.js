import { applyColorActionMobile } from "./color_events.js";
import { applyLinearGradient } from "./apply_linear_grad.js";
import { convertRGBtoHex } from "./color_converter.js";

export function mobileLogoColorsMenu(canvas) {
  if (!canvas) return;

  const colorCategories = document?.getElementById(
    "mobile-logo-color-categories",
  );
  const solidCategory = document.querySelector("#mobile-logo-solid-category");
  const linearCategory = document.querySelector("#mobile-logo-linear-category");
  const noneCategory = document.querySelector("#mobile-logo-none-category");

  const solidSection = document.getElementById(
    "mobile-logo-solid-color-section",
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
    linearSection.style.display = "none";
    noneSection.style.display = "none";
  });

  // Add Button Action
  document
    ?.querySelector("#mobile-bg-add-item")
    ?.addEventListener("click", () => {
      document.querySelector("#upload-file").click();
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
      target.querySeleor("#grad-1").value,
      target.querySeleor("#grad-2").value,
    ];
  });

  if (!mobileBgPalleteComponent) return;
  mobileBgPalleteComponent
    ?.querySelector(".color-palette-gradient")
    ?.addEventListener("click", () => {
      const applyColor = new applyLinearGradient(
        canvas,
        bgGrad1,
        bgGrad2,
        false,
      );
      applyColor.setColor(false);
    });

  // None Background
  noneCategory?.addEventListener("click", () => {
    canvas.setBackgroundColor("#fff");
    canvas.renderAll();
  });
}
