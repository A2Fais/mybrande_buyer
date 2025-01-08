import { canvas } from "./main.js";
import {
  solidColorAction,
  solidColorTextAction,
  updateColorPickers,
  updateColorTextPickers,
  applyColorActionMobile,
} from "./color_events.js";
import { applyLinearGradient } from "./apply_linear_grad.js";

export function mobileLogoColorsMenu(activeObject) {
  // console.log("ACTIVE OBJ FROM LOGO COLORS MENU", activeObject);

  const colorCategories = document?.getElementById(
    "mobile-logo-color-categories",
  );
  const solidCategory = document?.getElementById("mobile-logo-solid-category");
  const linearCategory = document?.getElementById(
    "mobile-logo-linear-category",
  );
  const noneCategory = document?.getElementById("mobile-logo-none-category");

  const solidSection = document.getElementById(
    "mobile-logo-solid-color-section",
  );
  const linearSection = document.getElementById(
    "mobile-logo-linear-color-section",
  );
  const noneSection = document.getElementById("mobile-logo-none-color-section");

  // Categories event listeners
  solidCategory?.addEventListener("click", () => {
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
    applyColorActionMobile(item, canvas, activeObject);
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
