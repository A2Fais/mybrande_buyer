import { querySelect } from "./selectors.js";

function layoutManager() {
  const desktopViewElements = [
    ".nav",
    ".settings-view",
    ".right-bar",
    "#main_editor_view .header",
    ".canvas-actions",
    ".magnifier-container",
  ];

  const editorContainer = querySelect(".editor-container");
  if (!editorContainer) return;

  const isMobileUser = navigator.userAgent.includes("Mobile");

  if (isMobileUser) {
    desktopViewElements.forEach((elem) => {
      const element = querySelect(elem);
      if (element) element.style.display = "none";
    });

    editorContainer.style.top = "-1px";
    editorContainer.style.left = "-2px";
  }
}

layoutManager();
