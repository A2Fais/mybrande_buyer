import { canvas } from "./main.js";
import createSubmenu from "./mobile-sub-menu.js";

export function mobileLogoMenu() {
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
  const layerActionBtn = menuMain.querySelector(
    "#mobile-layer-action-category",
  );

  flipXBtn.addEventListener("click", () => {
    if (!canvas) {
      console.error("Canvas is not initialized.");
      return;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ flipX: !activeObject.flipX });
      canvas.renderAll();
    }
  });

  flipYBtn.addEventListener("click", () => {
    if (!canvas) {
      console.error("Canvas is not initialized.");
      return;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ flipY: !activeObject.flipY });
      canvas.renderAll();
    }
  });

  const rotateSubmenu = createSubmenu(
    menuMain,
    `<div style="position: relative; width: 100svw; max-width: 400px; margin: 0 auto;">
    <label for="mobile-rotate-slider" style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">Value: <span id="mobile-rotate-value">50</span></label>
    <input type="range" id="mobile-rotate-slider" style="width: 100%;" min="0" max="100" value="50" step="1" />
  </div>
`,
  );

  const scaleSubmenu = createSubmenu(
    menuMain,
    `<div style="position: relative; width: 100svw; max-width: 400px; margin: 0 auto;">
    <label for="mobile-scale-slider" style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">Value: <span id="mobile-slider-value">50</span></label>
    <input type="range" id="mobile-scale-slider" style="width: 100%;" min="0" max="100" value="50" step="1" />
  </div>
`,
  );

  const shadowSubmenu = createSubmenu(
    menuMain,
    `<div style="width: 90svw;">

    <label for="blur-slider" style="font-size: 14px; font-weight: bold;">Blur: <span id="blur-value">5</span></label>
    <input type="range" id="blur-slider" style="width: 100%;" min="0" max="100" value="5" step="1" />
    
    <label for="x-slider" style="font-size: 14px; font-weight: bold; margin-top: 50px;">
    X Offset: <span id="x-value">0</span></label>
    <input type="range" id="x-slider" style="width: 100%;" min="-50" max="50" value="0" step="1" />
    
    <label for="y-slider" style="font-size: 14px; font-weight: bold; margin-top: 50px;">
    Y Offset: <span id="y-value">0</span></label>
    <input type="range" id="y-slider" style="width: 100%;" min="-50" max="50" value="0" step="1" />

  </div>`,
  );

  const colorsSubmenu = createSubmenu(menuMain, `<div>HAHAHAHAH</div>`);
  const layerActionSubmenu = createSubmenu(menuMain, `<div>HAHAHAHAH</div>`);

  const rotateSlider = document.getElementById("mobile-rotate-slider");
  const rotateSliderValue = document.getElementById("mobile-rotate-value");

  const scaleSlider = document.getElementById("mobile-rotate-slider");
  const scaleSliderValue = document.getElementById("mobile-slider-value");

  rotateSlider.addEventListener("input", function () {
    rotateSliderValue.textContent = rotateSliderValue.value;
  });

  scaleSliderValue.addEventListener("input", function () {
    scaleSliderValue.textContent = scaleSliderValue.value;
  });

  rotateBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    rotateSubmenu.style.display = "flex";
  });

  scaleBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    scaleSubmenu.style.display = "flex";
  });

  shadowBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    shadowSubmenu.style.display = "flex";
  });

  colorsBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    colorsSubmenu.style.display = "flex";
  });

  layerActionBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    actionSubmenu.style.display = "flex";
  });
}
