import { canvas } from "./main.js";

export function mobileLogoMenu() {
  const categoryContent = document.querySelector("#mobile-category-content");

  const logoViewSettings = categoryContent.querySelector(
    "#mobile-logo-view-settings",
  );

  const flipXBtn = logoViewSettings.querySelector(
    "#mobile-flip-horizontal-category",
  );

  const flipYBtn = logoViewSettings.querySelector(
    "#mobile-flip-vertical-category",
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
}
