import { canvas } from "./main.js";
import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoView } from "./mobile-logo-view.js";
import { mobileAddView } from "./mobile-add-view.js";
import { mobileAddMenu } from "./mobile-add-menu.js";
import { mobileTextView } from "./mobile-text-view.js";
import { mobileBackgroundMenu } from "./mobile-background-menu.js";
import { mobileLogoMenu } from "./mobile-logo-menu.js";
import { mobileTextMenu } from "./mobile-text-menu.js";
import { CreateLayerSection } from "./create_layer.js";

const navItems = document.querySelectorAll("#mobile-nav-bar [data-name]");
const categoryContent = document.querySelector("#mobile-category-content");

let category = "add";

function navView() {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const location = window.location.href;
  const isTextNav = location?.includes("#text");
  const isLogoNav = location?.includes("#logo");
  const isActiveText = activeObject?.text;

  if (isActiveText) {
    if (isTextNav) return;
    category = "text";
  } else {
    if (isLogoNav) return;
    category = "logo";
  }
  history.pushState({ category }, null, `#${category}`);
  routeHandler({ category });
  return category;
}

function generateLayersOnTopNav() {
  const layers = document.querySelector("#mobile-logo-layers-bar");
  const SVG = localStorage.getItem("logo-file");

  fabric.loadSVGFromString(SVG, (objects) => {
    objects.forEach((obj, idx) => {
      const layerSection = new CreateLayerSection(layers, "mobile");
      const id = layerSection.create(obj, idx);
      obj.layerId = id
    });
  });
}

(() => {
  if (!window.layersGenerated) {
    generateLayersOnTopNav();
    window.layersGenerated = true;
  }
})();

const layerContaier = document.querySelectorAll(".layer-container");

layerContaier.forEach((layer, layerIdx) => {
  layer.addEventListener("click", () => {
    const layerId = +layer.getAttribute("data_layer");
    canvas._objects.forEach((object, index) => {
      if (index === layerId) {
        canvas.setActiveObject(object)
      }
    });
  })
});

function updateLayerSelection() {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  canvas._objects.forEach((object, index) => {
    const layerSpan = layerContaier[index]?.querySelector("span");
    const layerImage = layerContaier[index]?.querySelector("img");
    if (!layerSpan || !layerImage) return;

    if (object === activeObject) {
      layerImage.style.border = "2px solid var(--gold)";
      layerSpan.style.background = "var(--gold)";
      layerSpan.style.padding = "7px";
      layerSpan.style.borderRadius = "3px";
      layerSpan.style.color = "var(--lighter)";
    } else {
      layerImage.style.border = "2px solid var(--light)";
      layerSpan.style.background = "none";
      layerSpan.style.color = "var(--gray)";
    }
  })
}

function canvasSelectionEvent() {
  const layerBar = document.querySelector("#mobile-logo-layers-bar")
  const category = navView();

  if (window.innerWidth >= 500) {
    return layerBar.style.display = "none";
  }

  if (category !== "text") {
    updateLayerSelection();
    layerBar.style.display = "flex";
  } else {
    layerBar.style.display = "none";
  }
}

canvas.on("selection:created", canvasSelectionEvent);
canvas.on("selection:updated", canvasSelectionEvent);

const mainCategoryData = {
  add: mobileAddView,
  logo: mobileLogoView,
  text: mobileTextView,
  background: mobileBackgroundView,
};

const menuCategoryData = {
  add: mobileAddMenu,
  logo: mobileLogoMenu,
  text: mobileTextMenu,
  background: mobileBackgroundMenu,
};

const saveModal = `
<div style="position: absolute; top: 0; left: 0; gap: 10px; width: 100%; height: 100svh; background: rgba(0, 0, 0, 0.7); z-index: 100; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <button id="mobile-save-p" class="btn" style="width: 240px;">Save and Preview</button>
    <button id="mobile-save-d" class="btn" style="width: 240px;">Save and Download</button>
    <button id="mobile-close-btn" class="btn" style="width: 240px; background: #ffffff; color: #555;">Close</button>
</div>
`;

const topBar = `
<div style="display: flex; justify-content: space-around; align-items: center; gap: 10px; width: 100%">
        <div id="mobile-undo">
          <span style="color: var(--gray); font-size: 12px;">
            <i class="fa fa-undo"></i> Undo
          </span>
        </div>
        <div id="mobile-redo">
          <span style="color: var(--gray); font-size: 12px;">
            <i class="fa fa-redo"></i> Redo
          </span>
        </div>
        <div id="mobile-save-btn">
          <span style="color: var(--gray); font-size: 12px;">
            <i class="fa-regular fa-floppy-disk"></i> Save
          </span>
        </div>
    </div>
`;

function renderTopBar() {
  document.querySelector("#mobile-top-bar").innerHTML = topBar;
  const mobileSaveBtn = document.querySelector("#mobile-save-btn");
  mobileSaveBtn.addEventListener("click", () => {
    renderSaveModal();
  });

  document.querySelector("#mobile-undo").addEventListener("click", () => {
    document.querySelector("#undo-btn").click();
  });

  document.querySelector("#mobile-redo").addEventListener("click", () => {
    document.querySelector("#redo-btn").click();
  });
}

function renderSaveModal() {
  document.querySelector("#mobile-top-bar").innerHTML = saveModal;
  const mobileCloseBtn = document.querySelector("#mobile-close-btn");
  mobileCloseBtn.addEventListener("click", () => {
    renderTopBar();
  });

  document
    .querySelector("#mobile-save-p")
    .addEventListener("click", async () => {
      document.querySelector("#save-btn").click();
    });

  document.querySelector("#mobile-save-d").addEventListener("click", () => {
    document.querySelector("#save-package").click();
  });
}

renderTopBar();

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    category = item.getAttribute("data-name");
    history.pushState({ category }, null, `#${category}`);
    routeHandler();
  });
});

function routeHandler({ category = history?.state?.category } = {}) {
  if (category && mainCategoryData[category]) {
    categoryContent.innerHTML = `
    <div id="content-container" style="z-index: 10; height: 70px; background: #ffffff; position: absolute; bottom: 0; display: flex;">
      ${mainCategoryData[category]}
    </div>`;
    categoryContent.style.display = "block";
  } else {
    categoryContent.style.display = "none";
  }
  if (menuCategoryData[category]) {
    menuCategoryData[category](canvas);
  }
}

routeHandler({ category: null });

window.addEventListener("popstate", routeHandler);




