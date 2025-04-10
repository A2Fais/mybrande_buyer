import { canvas } from "./main.js";
import { bgColorAction } from "./color_events.js";
import { ApplyLinearGradient } from "./apply_linear_grad.js";
import iro from "@jaames/iro";

export function mobileBackgroundMenu() {
  const colorCategories = document?.getElementById(
    "mobile-background-view-categories",
  );
  const solidCategory = document?.getElementById("mobile-solid-category");
  const linearCategory = document?.getElementById("mobile-linear-category");
  const noneCategory = document?.getElementById("mobile-none-category");
  const pickerCategory = document?.getElementById(
    "mobile-picker-color-category",
  );

  const solidSection = document.getElementById("mobile-solid-color-section");
  const linearSection = document.getElementById("mobile-linear-color-section");
  const pickerSection = document.getElementById("mobile-picker-color-section");
  const noneSection = document.getElementById("mobile-none-color-section");

  // Add touch effect to all category elements
  document.querySelectorAll('.mobile-category').forEach(element => {
    const handleTouchStart = () => {
      const icon = element.querySelector('.mobile-category-icon');
      const text = element.querySelector('.mobile-category-text');
      
      if (icon) {
        icon.style.transition = 'all 0.2s ease';
        icon.style.transform = 'scale(1.2)';
        icon.style.color = 'var(--gold)';
      }
      if (text) {
        text.style.transition = 'all 0.2s ease';
        text.style.transform = 'scale(1.1)';
        text.style.color = 'var(--gold)';
      }
    };

    const handleTouchEnd = () => {
      const icon = element.querySelector('.mobile-category-icon');
      const text = element.querySelector('.mobile-category-text');
      
      if (icon) {
        icon.style.transform = '';
        icon.style.color = '';
        icon.style.transition = '';
      }
      if (text) {
        text.style.transform = '';
        text.style.color = '';
        text.style.transition = '';
      }
      element.blur();
    };

    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);
  });

  // Categories event listeners
  solidCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    solidSection.style.display = "grid";
    solidSection.style.gridTemplateColumns = "repeat(4, 1fr)";
    solidSection.style.padding = "10px";
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

  // Picker event listeners
  pickerCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    pickerSection.style.display = "flex";
    solidSection.style.display = "none";
    linearSection.style.display = "none";
    noneSection.style.display = "none";
  });

  // Linear event listeners
  linearCategory?.addEventListener("click", () => {
    colorCategories.style.display = "none";
    solidSection.style.display = "none";
    linearSection.style.display = "flex";
    noneSection.style.display = "none";
  });

  const colorPicker = new iro.ColorPicker("#mobile-picker-color-section", {
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
    const rgba = color.rgba;
    const backgroundColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
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
      const applyColor = new ApplyLinearGradient(
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
