import { canvas } from "./main.js";

export default function createSubmenu(parentMenu, submenuContent, ...params) {
  const submenu = document.createElement("div");
  submenu.id = "mobile-submenu";
  submenu.style.width = "100%";
  submenu.style.height = "100%";
  submenu.style.display = "none";

  // const contentElement = document.createElement("div");
  // contentElement.innerHTML = submenuContent;
  submenu.innerHTML = submenuContent;

  parentMenu.parentElement.append(submenu);
  events();
  return submenu;
}

function events() {
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

  duplicateBtn.addEventListener("click", () => {
    const active = canvas.getActiveObject();
    if (!active) return;

    if (active?.id?.includes("external_layer_") && !active?.text) {
      let cloned = active.toJSON([
        "itemId",
        "id",
        "category",
        "cacheWidth",
        "cacheHeight",
      ]);
      cloned.top += 10;
      cloned.left += 10;
      loadExternalLayers(JSON.stringify([cloned]));
      return false;
    }

    if (active._objects) {
      active.clone((clonedGroup) => {
        clonedGroup._objects.forEach((object, i) => {
          if (object.text) return true;
          object.duplicate = true;
          canvas.add(object);
        });
        canvas.centerObject(clonedGroup);
        clonedGroup.set("top", 100);
        clonedGroup.set("left", 100);
        canvas.setActiveObject(clonedGroup);
        canvas.requestRenderAll();
        canvas.save();
      });
    } else {
      active.clone((cloned) => {
        if (cloned.text) return true;
        cloned.set("duplicate", true);
        canvas.add(cloned);
        cloned.top += 10;
        cloned.left += 10;
        canvas.save();
      });
    }
    canvas.requestRenderAll();
  });

  visibleBtn.addEventListener("click", () => {
    const active = canvas.getActiveObject();
    let visibilty = Boolean(active.get("visible"));
    visibilty = !visibilty;
    active.set("visible", visibilty);
    canvas.requestRenderAll();
    if (active) canvas.save();
    const eyeElement = querySelect("#eyeElement");
    const specificLabels = querySelectAll(".specific-setting-label");
    const firstSpecificLabel = specificLabels[1];

    const eyeColor = active.visible ? "var(--gray-lighter)" : "var(--gold)";
    const labelOpacity = active.visible ? 0 : 1;
    const labelColor = eyeColor;

    eyeElement.style.color = eyeColor;
    firstSpecificLabel.style.opacity = labelOpacity;
    firstSpecificLabel.style.color = labelColor;
  });

  removeBtn.addEventListener("click", () => {
    const active = canvas.getActiveObject();
    if (!active) return;
    if (active._objects && active._objects.length) {
      active._objects.forEach((obj) => {
        canvas.remove(obj);
      });
    }
    canvas.remove(active);
    canvas.save();
    canvas.renderAll();
  });

  backwardBtn.addEventListener("click", () => {
    const active = canvas.getActiveObject();
    canvas.sendBackwards(active);
    canvas.setActiveObject(active);
    canvas.requestRenderAll();
    canvas.save();
  });

  forwardBtn.addEventListener("click", () => {
    const active = canvas.getActiveObject();
    canvas.bringForward(active);
    canvas.setActiveObject(active);
    canvas.requestRenderAll();
    canvas.save();
  });
}
