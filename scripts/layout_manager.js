import { querySelect } from "./selectors.js";

// Add mobile detection class early
function addMobileClass() {
  const isMobileUser = /Mobile|Android|iPhone/i.test(navigator.userAgent);
  if (isMobileUser) {
    document.documentElement.classList.add('mobile-view');
  }
}

// Run this before DOM loads
addMobileClass();

function layoutManager() {
  const editorContainer = querySelect(".editor-container");
  if (!editorContainer) return;

  // Show mobile elements if needed
  const isMobileUser = document.documentElement.classList.contains('mobile-view');
  if (isMobileUser) {
    // Show loader first
    const loader = querySelect("#loader_main");
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.style.justifyContent = "center";
      loader.style.alignItems = "center";
      
      // Center the loader image
      const loaderImage = loader.querySelector("img");
      if (loaderImage) {
        loaderImage.style.position = "absolute";
        loaderImage.style.top = "50%";
        loaderImage.style.left = "50%";
        loaderImage.style.transform = "translate(-50%, -50%)";
      }
    }
    
    // Then initialize mobile UI
    const mobileNavBar = querySelect("#mobile-nav-bar");
    const mobileTopBar = querySelect("#mobile-top-bar");
    if (mobileNavBar) mobileNavBar.style.display = "flex";
    if (mobileTopBar) mobileTopBar.style.display = "flex";
  }
}

// Run after DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', layoutManager);
} else {
  layoutManager();
}
