import { canvas } from "./main.js";
import { mobile_background_view } from "./mobile_background_view.js";
import { mobile_logo_view } from "./mobile_logo_view.js";
import { mobile_add_view } from "./mobile_add_view.js";
import { mobile_add_menu } from "./mobile_add_menu.js";
import { mobile_text_view } from "./mobile_text_view.js";
import { mobile_background_menu } from "./mobile_background_menu.js";
import { mobile_logo_menu } from "./mobile_logo_menu.js";
import { mobile_text_menu } from "./mobile_text_menu.js";
import { CreateLayerSection } from "./create_layer.js";
import { mobile_align_view } from "./mobile_align_view.js";
import { mobile_align_menu } from "./mobile_align_menu.js";

const navItems = document.querySelectorAll("#mobile-nav-bar [data-name]");
const categoryContent = document.querySelector("#mobile-category-content");

let category = "add";

function pushToRoute(category) {
  let url = "";

  if (!category) {
    url = "/";
  } else {
    url = `#${category}`
  }

  history.pushState({ category }, "", url);
  routeHandler({ category });
  return category;
}

function selectedLayerNavigation() {
  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    category = null;
    pushToRoute(category)
    return;
  };

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
  pushToRoute(category);
}

function canvasSelectionEvent(target = true) {
  selectedLayerNavigation();
  const mobileNavBar = document.getElementById("mobile-nav-bar")
  const layerBarTop = mobileNavBar.style.height
  const layerBar = document.querySelector("#mobile-logo-layers-bar");
  const activeObject = canvas.getActiveObject();

  if (!target) {
    pushToRoute(category)
    return layerBar.style.display = "none";
  }

  if (window.innerWidth >= 500) {
    return layerBar.style.display = "none";
  }

  if (activeObject?.text) {
    layerBar.style.display = "none";
  } else {
    updateLayerSelection();
    layerBar.style.display = "flex";
    layerBar.style.bottom = layerBarTop;
    layerBar.style.zIndex = "60";
  }
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

layerContaier.forEach((layer, idx) => {
  layer.addEventListener("click", () => {
    // const layerId = layer.getAttribute("data-id");
    const canvasObject = canvas._objects.find((_, index) => index === idx);
    if (canvasObject) {
      canvas.setActiveObject(canvasObject);
      canvas.requestRenderAll();
      
      document.querySelectorAll(".layer-container").forEach((l) => {
        const layerSpan = l.querySelector(".layer-span");
        const layerImage = l.querySelector(".layer-img");
        if (l === layer) {
          layerImage.style.border = "2px solid var(--gold)";
          layerSpan.style.background = "var(--gold)";
          layerSpan.style.padding = "7px";
          layerSpan.style.marginInline = "5px";
          layerSpan.style.borderRadius = "3px";
          layerSpan.style.color = "var(--lighter)";
        } else {
          layerImage.style.border = "2px solid var(--light)";
          layerSpan.style.background = "none";
          layerSpan.style.color = "var(--gray)";
          layerSpan.style.marginLeft = "-15px"
        }
      });
    }
  });
});

function updateLayerSelection() {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  document.querySelectorAll(".layer-container").forEach((layer) => {
    const layerSpan = layer.querySelector(".layer-span");
    const layerImage = layer.querySelector(".layer-img");
    if (!layerSpan || !layerImage) return;

    if (layer.getAttribute("data-id") === activeObject.layerId) {
      layerImage.style.border = "2px solid var(--gold)";
      layerSpan.style.background = "var(--gold)";
      layerSpan.style.padding = "7px";
      layerSpan.style.marginInline = "5px";
      layerSpan.style.borderRadius = "3px";
      layerSpan.style.color = "var(--lighter)";
    } else {
      layerImage.style.border = "2px solid var(--light)";
      layerSpan.style.background = "none";
      layerSpan.style.color = "var(--gray)";
      layerSpan.style.marginLeft = "-15px"
    }
  });
}

canvas.on("selection:created", canvasSelectionEvent);
canvas.on("selection:updated", canvasSelectionEvent);
canvas.on("mouse:down", (event) => {
  const target = event.target
  canvasSelectionEvent(target)
})

const mainCategoryData = {
  add: mobileAddView,
  logo: mobileLogoView,
  text: mobileTextView,
  background: mobileBackgroundView,
  align: mobileAlignView
};

const menuCategoryData = {
  add: mobileAddMenu,
  logo: mobileLogoMenu,
  text: mobileTextMenu,
  background: mobileBackgroundMenu,
  align: mobileAlignMenu
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

const layerBar = document.querySelector("#mobile-logo-layers-bar")

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    category = item.getAttribute("data-name");
    history.pushState({ category }, null, `#${category}`);
    if (category !== "logo") {
      layerBar.style.display = "none"
    }
    routeHandler();
  });
});

export function routeHandler({ category = history?.state?.category } = {}) {
  const mobileNavBar = document.getElementById("mobile-nav-bar");
  const layerBarTop = mobileNavBar.style.height;
  layerBar.style.bottom = layerBarTop;
  
  if (category && mainCategoryData[category]) {
    categoryContent.innerHTML = `
    <div id="content-container" style="z-index: 10; height: 70px; background: #ffffff; position: fixed; bottom: 0; display: flex;">
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

document.addEventListener("mouseenter", (event) => {
  if (event.target.classList.contains("nav-icon")) {
    console.log("Mouse entered icon");
    event.target.style.color = "blue";
  }
}, true);

document.addEventListener("mouseleave", (event) => {
  if (event.target.classList.contains("nav-icon")) {
    event.target.style.color = ""; 
  }
}, true);

// Add hover effect handlers for touchwiz navigation
const touchWizElements = document.querySelectorAll('.touchwiz');
touchWizElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    const icon = element.querySelector('.nav-icon-elem, .nav-icon-elem-first');
    const text = element.querySelector('div');
    if (icon) {
      icon.style.transform = 'scale(1.1)';
      icon.style.color = 'var(--mybrande-blue)';
    }
    if (text) {
      text.style.transform = 'scale(1.1)';
      text.style.color = 'var(--mybrande-blue)';
    }
  });

  element.addEventListener('mouseleave', () => {
    const icon = element.querySelector('.nav-icon-elem, .nav-icon-elem-first');
    const text = element.querySelector('div');
    if (icon) {
      icon.style.transform = '';
      icon.style.color = icon.classList.contains('nav-icon-elem-first') ? 'var(--gold-light)' : 'var(--gray-light)';
    }
    if (text) {
      text.style.transform = '';
      text.style.color = 'var(--gray-light)';
    }
  });
});

document.querySelectorAll('.touchwiz').forEach(element => {
  element.addEventListener('touchstart', () => {
    const icon = element.querySelector('.nav-icon-elem, .nav-icon-elem-first');
    const text = element.querySelector('div');
    
    if (icon) {
      icon.style.transform = 'scale(1.2)';
      icon.style.color = 'var(--mybrande-blue)';
    }
    if (text) {
      text.style.transform = 'scale(1.1)';
      text.style.color = 'var(--mybrande-blue)';
    }
  });

  element.addEventListener('touchend', () => {
    const icon = element.querySelector('.nav-icon-elem, .nav-icon-elem-first');
    const text = element.querySelector('div');
    
    if (icon) {
      icon.style.transform = '';
      icon.style.color = icon.classList.contains('nav-icon-elem-first') ? 'var(--gold-light)' : 'var(--gray-light)';
    }
    if (text) {
      text.style.transform = '';
      text.style.color = 'var(--gray-light)';
    }

    element.blur();
  });
});