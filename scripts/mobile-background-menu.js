import { canvas } from "./main.js";
import {
  solidColorAction,
  solidColorTextAction,
  updateColorPickers,
  updateColorTextPickers,
  bgColorAction,
} from "./color_events.js";
import { applyLinearGradient } from "./apply_linear_grad.js";

export function mobileBackgroundMenu() {
  const colorCategories = document?.getElementById(
    "mobile-background-view-categories",
  );
  const solidCategory = document?.getElementById("mobile-solid-category");
  const linearCategory = document?.getElementById("mobile-linear-category");
  const noneCategory = document?.getElementById("mobile-none-category");

  const solidSection = document.getElementById("mobile-solid-color-section");
  const linearSection = document.getElementById("mobile-linear-color-section");
  const noneSection = document.getElementById("mobile-none-color-section");

  // Categories event listeners
  solidCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    solidSection.style.display = "grid";
    solidSection.style.gridTemplateColumns = "repeat(4, 1fr)";
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
  const bgColors = document.querySelectorAll("#solid_color-bg-mobile");
  bgColors.forEach((item) => {
    bgColorAction(item, canvas, null, true);
  });

  // Linear event listeners
  linearCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    solidSection.style.display = "none";
    linearSection.style.display = "flex";
    noneSection.style.display = "none";
  });

  // Linear Colors Actions
  var bgGrad1, bgGrad2;
  const mobileBgPalleteComponent = document.querySelector("#mobile-bg-pallete");
  mobileBgPalleteComponent?.addEventListener("colorChanged", (c) => {
    [bgGrad1, bgGrad2] = [
      c.target.querySelector("#grad-1").value,
      c.target.querySelector("#grad-2").value,
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
        true,
      );
      applyColor.setColor(true);
    });

  // None Background
  noneCategory?.addEventListener("click", () => {
    canvas.setBackgroundColor("#fff");
    canvas.renderAll();
  });
}
