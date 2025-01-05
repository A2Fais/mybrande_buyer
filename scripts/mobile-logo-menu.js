import { canvas } from "./main.js";
import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoColorsMenu } from "./mobile-logo-colors-menu.js";
import { mobileLogoShadowMenu } from "./mobile-logo-shadow-menu.js";
import { mobileLogoScaleMenu } from "./mobile-logo-scale-menu.js";
import { mobileLogoRotateMenu } from "./mobile-logo-rotate-menu.js";
import { CreateLayerSection } from "./create_layer";
import createSubmenu from "./mobile-sub-menu.js";

export function mobileLogoMenu(canvas) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();

  const menuMain = document.querySelector(
    "#mobile-category-content #mobile-logo-view-settings",
  );
  const flipXBtn = menuMain.querySelector("#mobile-flip-horizontal-category");
  const flipYBtn = menuMain.querySelector("#mobile-flip-vertical-category");
  const rotateBtn = menuMain.querySelector("#mobile-rotate-category");
  const scaleBtn = menuMain.querySelector("#mobile-scale-category");
  const shadowBtn = menuMain.querySelector("#mobile-drop-shadow-category");
  const colorsBtn = menuMain.querySelector("#mobile-colors-category");
  const actionBtn = menuMain.querySelector("#mobile-colors-category");
  const mobileLayersBtn = menuMain.querySelector("#mobile-layers-category");

  const layerActionBtn = menuMain.querySelector(
    "#mobile-layer-action-category",
  );

  const rotateSubmenu = createSubmenu(
    menuMain,
    `<div style="position: relative; display:block; width: 80svw; margin: 0 auto; text-align: center;">
      <output id="mobile-rotate-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Rotate: 0°</output>
     <input class="mobile-slider" type="range" id="mobile-rotate-slider" style="width: 100%;" min="0" max="360" value="0" />
</div>
`,
  );

  const scaleSubmenu = createSubmenu(
    menuMain,
    `<div style="position: relative; display: block; width: 80svw; margin: 0 auto; text-align: center;">
     <output id="mobile-scale-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Scale: 0</output>
    <input class="mobile-slider" type="range" id="mobile-scale-slider" style="width: 100%;" min="0" max="100" value="50" step="1" />
  </div>
`,
  );

  const shadowSubmenu = createSubmenu(
    menuMain,
    `<div style="width: 90svw;">
    <label id="blur-mobile-slider-title" style="font-size: 14px; font-weight: bold;">Blur: <span id="blur-value">5</span></label>
    <input class="mobile-slider" type="range" id="blur-mobile-slider" style="width: 100%;" min="0" max="100" value="5" step="1" />

    <label for="x-mobile-slider" style="font-size: 14px; font-weight: bold; margin-top: 50px;">
    X Offset: <span id="x-value">0</span></label>
    <input class="mobile-slider" type="range" id="x-mobile-slider" style="width: 100%;" min="-50" max="50" value="0" step="1" />

    <label for="y-mobile-slider" style="font-size: 14px; font-weight: bold; margin-top: 50px;">
    Y Offset: <span id="y-value">0</span></label>
    <input class="mobile-slider" type="range" id="y-mobile-slider" style="width: 100%;" min="-50" max="50" value="0" step="1" />
  </div>`,
  );

  const actionSubmenu = createSubmenu(
    menuMain,
    `<div style="position: relative; width: 100svw; max-width: 400px; margin: 0 auto;">

<div style="display: flex; justify-content: space-around; width: 100%;">
    <div style="text-align: center;" id="mobile-duplicate-layer">
        <i class="fa-solid fa-copy" style="font-size: 20px; color: var(--gray-light);"></i>
        <div style="font-size: 12px; color: var(--gray-light);">Duplicate</div>
    </div>
    <div style="text-align: center;" id="mobile-visible-layer">
        <i class="fa-solid fa-eye" style="font-size: 20px; color: var(--gray-light);"></i>
        <div style="font-size: 12px; color: var(--gray-light);">Visible</div>
    </div>
    <div style="text-align: center;" id="mobile-forward-layer">
        <i class="fa-solid fa-arrow-up" style="font-size: 20px; color: var(--gray-light);"></i>
        <div style="font-size: 12px; color: var(--gray-light);">Forward</div>
    </div>
    <div style="text-align: center;" id="mobile-backward-layer">
        <i class="fa-solid fa-arrow-down" style="font-size: 20px; color: var(--gray-light);"></i>
        <div style="font-size: 12px; color: var(--gray-light);">Backward</div>
    </div>
    <div style="text-align: center;" id="mobile-remove-layer">
        <i class="fa-solid fa-trash" style="font-size: 20px; color: var(--gray-light);"></i>
        <div style="font-size: 12px; color: var(--gray-light);">Remove</div>
    </div>
</div>
  </div>
`,
  );

  const colorsSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-colors-view" style="width: 100%">

<div id="mobile-logo-color-categories" style="display: flex; padding: 10px 10px 0px 10px; justify-content: center; align-items: center; height: 100%; gap: 40px; overflow-x: scroll;">
    <!-- Solid Category -->
    <div id="mobile-logo-solid-category" style="text-align: center;">
        <i class="fas fa-square" style="font-size: 20px; color: var(--gray);"></i>
        <p style="margin-top: 10px; font-size: 12px; color: var(--gray);">Solid</p>
    </div>

    <!-- Linear Category -->
    <div id="mobile-logo-linear-category" style="text-align: center;">
        <i class="fas fa-arrows-alt-h" style="font-size: 20px; color: var(--gray);"></i>
        <p style="margin-top: 10px; font-size: 12px; color: var(--gray);">Linear</p>
    </div>

    <!-- None Category -->
    <div id="mobile-logo-none-category" style="text-align: center;">
        <i class="fas fa-ban" style="font-size: 20px; color: var(--gray);"></i>
        <p style="margin-top: 10px; font-size: 12px; color: var(--gray);">None</p>
    </div>
</div>

<!-- Solid Colors Section -->
<div id="mobile-logo-solid-color-section" style="display: none; gap: 5px; justify-content: flex-start; padding-inline: 0 0 10px 0; overflow-x: scroll; grid-template-colums: repeat(4, 1fr);">
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #000000;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #545454;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #737373;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a6a6a6;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d9d9d9;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f5f5f5;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffffff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b25d1f;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e37627;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fc832b;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fd964b;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #febb8a;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fedfc9;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fff2e9;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ab2d2d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #de3a3a;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f74040;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f85d5d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fcb3b3;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fed0d0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffeded;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #8a6e10;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b89e1e;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e5c100;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffdd00;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffea66;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fff59d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffffe0;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #126f43;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #168a53;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #1dbf73;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #62d49f;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a6eaca;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #c9f4e0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e8faf4;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #1b8996;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #25a1b0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #3ad0e6;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #75dfee;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #afedf7;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #cdf5fb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ecfcff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #284389;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #3f63c8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #4a73e8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #819ef0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #9db4f3;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d4defb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f0f4ff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #6731a1;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #984ae8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a866ec;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b881f0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d8b9f7;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ecddfb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f8f0ff;"></span>
  </div>
</div>

<div id="mobile-logo-linear-color-section" style="display: flex; gap: 5px; justify-content: center;overflow-x: scroll; display: none;">
  <mobile-pallete-component id="mobile-bg-pallete"></mobile-pallete-component>
</div>

<div id="mobile-logo-none-color-section" style="display: flex; gap: 5px; justify-content: flex-start; padding-right: 30px; overflow-x: scroll; display: none;">
  <h1>None</h1> </div>
</div>`,
    activeObject,
  );

  const layersSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-layers" style="display: flex; overflow-x: scroll;">
    </div>`,
  );

  const layers = document.getElementById("mobile-layers");
  const SVG = localStorage.getItem("logo-file");

  fabric.loadSVGFromString(SVG, (objects) => {
    objects.forEach((obj, idx) => {
      const layerSection = new CreateLayerSection(layers, "mobile");
      layerSection.create(obj, idx);
    });
  });

  const layersContainers = document.querySelectorAll(".layer-container");
  layersContainers.forEach((container) => {
    const layerId = parseInt(container.getAttribute("data_layer"));
    container.addEventListener("click", () => {
      const obj = canvas._objects[layerId];
      if (obj) {
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
      }
    });
  });

  mobileLogoColorsMenu(activeObject);
  mobileLogoShadowMenu(activeObject);
  mobileLogoScaleMenu(activeObject);
  mobileLogoRotateMenu(activeObject);

  mobileLayersBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    layersSubmenu.style.display = "block";
  });

  rotateBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    rotateSubmenu.style.display = "block";
  });

  scaleBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    scaleSubmenu.style.display = "block";
  });

  shadowBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    shadowSubmenu.style.display = "block";
  });

  colorsBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    colorsSubmenu.style.display = "block";
  });

  layerActionBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    actionSubmenu.style.display = "block";
  });

  flipXBtn.addEventListener("click", () => {
    activeObject.set({ flipX: !activeObject.flipX });
    canvas.renderAll();
  });

  flipYBtn.addEventListener("click", () => {
    activeObject.set({ flipY: !activeObject.flipY });
    canvas.renderAll();
  });
}
