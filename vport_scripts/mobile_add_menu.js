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

export function mobileAddMenu() {
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
}
