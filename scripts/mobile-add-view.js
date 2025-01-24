export const mobileAddView = `
    <div id="mobile-add-view" style="display: flex; flex-direction: column; gap: 10px; align-items: center; width: 100svw;">
    <div style="display: flex; justify-content: space-around; width: 100%; height: 100%; align-items: center;">
      <div id="mobile-add-item" style="text-align: center;" id="mobile-upload-layer">
          <i class="fa-solid fa-upload" style="font-size: 20px; color: var(--gray-light);"></i>
          <div style="font-size: 12px; color: var(--gray-light);">Upload</div>
      </div>
      <div id="mobile-add-icon" style="text-align: center;" id="mobile-add-icon-layer">
          <i class="fa-solid fa-icons" style="font-size: 20px; color: var(--gray-light);"></i>
          <div style="font-size: 12px; color: var(--gray-light);">Add Icon</div>
      </div>
      <div id="mobile-add-text" style="text-align: center;" id="mobile-add-text-layer">
          <i class="fa-solid fa-font" style="font-size: 20px; color: var(--gray-light);"></i>
          <div style="font-size: 12px; color: var(--gray-light);">Add Text</div>
      </div>
      </div>
    </div>`;

document.addEventListener("DOMContentLoaded", () => {
  const mobileAddText = document.querySelector("#mobile-add-text");
  const mobileAddIcon = document.querySelector("#mobile-add-icon");
  const mobileAddItem = document.querySelector("#mobile-add-item");
  const navItem = document.querySelector('.nav-item[data-name="upload"]');

  mobileAddItem.addEventListener("click", () => {
    navItem.click();
  });

  mobileAddText.addEventListener("click", () => {
    document.querySelector(".item-title").click();
  });

  mobileAddIcon.addEventListener("click", () => {});
});
