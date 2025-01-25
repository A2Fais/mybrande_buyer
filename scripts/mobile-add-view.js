import axios from "axios";

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

      <div id="mobile-add-icon-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.98); z-index: 2000;
      display: none; justify-content: center; align-items: center;">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 60px">
    <input type="text" style="border-radius: 5px; width: 100%; padding: 5px; outline: none; border: none; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); text-align: center; display: none" placeholder="Search...">
    <div id="mobile-clip-icons" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 60px;"></div>
    <button id="mobile-clip-icon-close" class="btn" style="width: 100%;">Close</button>
  </div>
  </div>
    </div>`;

function svgCreator(icon, name = "") {
  const img = new Image();
  img.classList.add("clip-icon");
  img.setAttribute("id", "clip-icon");
  icon = icon.replace(/(\r\n|\n|\r)/gm, "");
  img.setAttribute("data-name", name);
  const blob = new Blob([icon], { type: "image/svg+xml" });
  const svgDataUrl = URL.createObjectURL(blob);
  img.src = svgDataUrl;
  img.style.width = "40px";
  img.style.height = "40px";
  img.style.objectFit = "cover";
  return img;
}

document.addEventListener("DOMContentLoaded", () => {
  const mobileAddText = document.querySelector("#mobile-add-text");
  const mobileAddIcon = document.querySelector("#mobile-add-icon");
  const mobileIconsModal = document.querySelector("#mobile-add-icon-modal");
  const mobileIconsModalClose = document.querySelector(
    "#mobile-clip-icon-close",
  );
  const mobileAddItem = document.querySelector("#mobile-add-item");
  const uploadNavItem = document.querySelector('.nav-item[data-name="upload"]');

  // Modal
  mobileAddIcon.addEventListener("click", async () => {
    mobileIconsModal.style.display = "flex";

    // try {
    //   const iconUrl = "https://www.mybrande.com/api/all/icons";
    //   const fetchedIcons = await axios.get(iconUrl);

    //   const icons = fetchedIcons?.data?.CategoryWiseIcon;
    //   if (!icons) {
    //     throw new Error('No icons data received');
    //   }

    //   const mobileClipIcons = document.querySelector("#mobile-clip-icons");
    //   // Clear previous icons if any
    //   mobileClipIcons.innerHTML = '';

    //   icons.forEach((icon) => {
    //     if (icon?.Icons && Array.isArray(icon.Icons)) {
    //       icon.Icons.forEach(({ icon_svg }) => {
    //         if (icon_svg && icon?.category?.iconcategory_name) {
    //           const name = icon.category.iconcategory_name;
    //           mobileClipIcons.appendChild(svgCreator(icon_svg, name));
    //         }
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error loading icons:', error);
    //   mobileIconsModal.style.display = "none";
    // }
  });

  mobileIconsModalClose?.addEventListener("click", () => {
    mobileIconsModal.style.display = "none";
  });

  // Upload item
  mobileAddItem?.addEventListener("click", () => {
    uploadNavItem.click();
  });

  // Add Text
  mobileAddText?.addEventListener("click", () => {
    const addNewText = document.querySelector(".item-title");
    addNewText.click();
  });
});
