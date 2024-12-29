import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoView } from "./mobile-logo-view.js";
import { mobileAddView } from "./mobile-add-view.js";
import { mobileTextView } from "./mobile-text-view.js";
import { canvas, canvasBG } from "./main.js";
import {
  solidColorAction,
  solidColorTextAction,
  updateColorPickers,
  updateColorTextPickers,
  bgColorAction,
} from "./color_events.js";
import { applyLinearGradient } from "./apply_linear_grad.js";

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll("#mobile-nav-bar [data-name]");
  const categoryContent = document.querySelector("#mobile-category-content");

  const mobileCategoryData = {
    add: mobileAddView,
    logo: mobileLogoView,
    text: mobileTextView,
    background: mobileBackgroundView,
  };

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const category = item.getAttribute("data-name");

      // Display selected category
      if (mobileCategoryData[category]) {
        categoryContent.innerHTML = `
        <div id="content-container" style="z-index: 10; background-color: #ffffff; height: auto; position: absolute; bottom: 0; width: 100vw; padding: 15px;">
          <div id="content-back-btn" style="display: flex; align-items: center; margin-bottom: 10px;">
            <i class="fa-solid fa-arrow-left" style="color: var(--gray); font-size: 20px; margin-right: 10px;"></i>
          </div>
          ${mobileCategoryData[category]}
        </div>`;
        categoryContent.style.display = "block";
      }

      // Close button for category view
      const contentBackBtn = document.querySelector("#content-back-btn");
      contentBackBtn.addEventListener("click", () => {
        categoryContent.style.display = "none";
      });

      const colorCategories = document?.getElementById(
        "mobile-background-view-categories",
      );
      const solidCategory = document?.getElementById("mobile-solid-category");
      const linearCategory = document?.getElementById("mobile-linear-category");
      const noneCategory = document?.getElementById("mobile-none-category");

      const solidSection = document.getElementById(
        "mobile-solid-color-section",
      );
      const linearSection = document.getElementById(
        "mobile-linear-color-section",
      );
      const noneSection = document.getElementById("mobile-none-color-section");

      // Categories event listeners
      solidCategory?.addEventListener("click", () => {
        colorCategories.style.display = "none";
        solidSection.style.display = "flex";
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
      const mobileBgPalleteComponent =
        document.querySelector("#mobile-bg-pallete");
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
    });
  });
});
