import { CreateLayerSection } from "./create_layer";

export default function createSubmenu(parentMenu, submenuContent, ...params) {
  const canvas = params[0];
  const submenu = document.createElement("div");
  submenu.id = "mobile-submenu";
  submenu.style.width = "100%";
  submenu.style.height = "100%";
  submenu.style.display = "none";

  submenu.innerHTML = submenuContent;
  parentMenu.parentElement.append(submenu);

  if (!canvas) return;
  events(canvas);
  return submenu;
}

function events(canvas) {
  const duplicateBtn = document.querySelector("#mobile-duplicate-layer");
  const visibleBtn = document.querySelector("#mobile-visible-layer");
  const removeBtn = document.querySelector("#mobile-remove-layer");
  const forwardBtn = document.querySelector("#mobile-forward-layer");
  const backwardBtn = document.querySelector("#mobile-backward-layer");

  if (
    !duplicateBtn ||
    !visibleBtn ||
    !removeBtn ||
    !forwardBtn ||
    !backwardBtn
  ) {
    return;
  }

  function layerGenerator() {
    const layers = document.getElementById("mobile-layers");
    layers.innerHTML = "";  
    // const SVG = localStorage.getItem("logo-file");
  
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
        console.log("clicked");
        const obj = canvas._objects[layerId];
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
      });
    });
  }

  duplicateBtn.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (activeObject.text) {
      activeObject.clone((cloned) => {
        cloned.set("duplicate", true);
        canvas.add(cloned);
        cloned.top += 10;
        cloned.left += 10;
        canvas.save();
        layerGenerator();
      });
    } else {
      const duplicateElement = document.querySelector("#duplicate-element");
      duplicateElement.click();
      layerGenerator();
    }
  });

  visibleBtn.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    let visibilty = Boolean(activeObject.get("visible"));
    visibilty = !visibilty;
    activeObject.set("visible", visibilty);
    canvas.requestRenderAll();
    if (activeObject) canvas.save();
    const eyeElement = document.querySelector("#mobile-visible-layer");
    const specificLabels = document.querySelectorAll(".specific-setting-label");
    const firstSpecificLabel = specificLabels[1];

    const eyeColor = activeObject.visible ? "var(--gray-lighter)" : "var(--gold)";
    const labelOpacity = activeObject.visible ? 0 : 1;
    const labelColor = eyeColor;

    eyeElement.style.color = eyeColor;
    firstSpecificLabel.style.opacity = labelOpacity;
    firstSpecificLabel.style.color = labelColor;
  });

  removeBtn.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject._objects && activeObject._objects.length) {
      activeObject._objects.forEach((obj) => {
        canvas.remove(obj);
      });
    }
    canvas.remove(activeObject);
    canvas.save();
    canvas.renderAll();
  });

  backwardBtn.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    canvas.sendBackwards(activeObject);
    canvas.setActiveObject(activeObject);
    canvas.requestRenderAll();
    canvas.save();
  });

  forwardBtn.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    canvas.bringForward(activeObject);
    canvas.setActiveObject(activeObject);
    canvas.requestRenderAll();
    canvas.save();
  });
}
