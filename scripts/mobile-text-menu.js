import { canvas } from "./main.js";
import { fetchedFonts } from "./main.js";
import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoColorsMenu } from "./mobile-logo-colors-menu.js";
import { mobileLogoShadowMenu } from "./mobile-logo-shadow-menu.js";
import { mobileLogoScaleMenu } from "./mobile-logo-scale-menu.js";
import { mobileLogoRotateMenu } from "./mobile-logo-rotate-menu.js";
import { CreateLayerSection } from "./create_layer";
import createSubmenu from "./mobile-sub-menu.js";

export async function mobileTextMenu(canvas) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();

  const menuMain = document.querySelector(
    "#mobile-category-content #mobile-text-view",
  );
  const mobileTextBtn = menuMain.querySelector("#mobile-font-family-category");

  const fontFamilySubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-fonts" style="display: flex; padding-right: 30px; gap: 30px; overflow-x: scroll; width: 90vw;"></div>`,
  );

  const fonts = await fetchedFonts();
  const mobileFontsContainer = document.querySelector("#mobile-fonts");

  function slicedFontView(start = 0, numberOfItems = 50) {
    const end = start + numberOfItems;
    const slicedFonts = fonts.slice(start, end);
    return slicedFonts;
  }

  function createFontElement(font) {
    const fontContainer = document.createElement("span");
    fontContainer.className = "mobile-font-family-item";
    fontContainer.style.width = "max-content";
    fontContainer.style.height = "max-content";
    fontContainer.style.fontFamily = font.family;
    fontContainer.style.padding = "14px";
    fontContainer.style.fontSize = "12px";
    fontContainer.style.fontWeight = "bold";
    fontContainer.style.alignItems = "center";
    fontContainer.style.justifyContent = "center";
    fontContainer.style.textAlign = "center";
    fontContainer.append(font.family.split(",")[0]);
    return fontContainer;
  }

  function renderFontsList(fontData) {
    fontData.forEach((font) => {
      const container = createFontElement(font);
      mobileFontsContainer.appendChild(container);
    });
  }

  const fontsData = slicedFontView();
  renderFontsList(fontsData);

  let scrollStartPos = 0;
  let touchStartX = 1;

  mobileFontsContainer.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  });

  mobileFontsContainer.addEventListener("touchmove", (event) => {
    let fontsData = [];
    const touchCurrentX = event.touches[0].clientX;
    const scrollLeft = mobileFontsContainer.scrollLeft;
    const maxScrollLeft =
      mobileFontsContainer.scrollWidth - mobileFontsContainer.clientWidth;

    if (touchCurrentX > touchStartX + 15 && scrollLeft === 0) {
      // LEFT
      if (scrollStartPos === 0) return;
      mobileFontsContainer.innerHTML = "";
      scrollStartPos = Math.max(scrollStartPos - 50, 0);
      fontsData = slicedFontView(scrollStartPos);
      mobileFontsContainer.scrollLeft = maxScrollLeft;
    } else if (touchCurrentX < touchStartX && scrollLeft >= maxScrollLeft) {
      // RIGHT
      mobileFontsContainer.innerHTML = "";
      scrollStartPos += 50;
      fontsData = slicedFontView(scrollStartPos);
      mobileFontsContainer.scrollLeft = scrollStartPos;
    }

    renderFontsList(fontsData);
    touchStartX = touchCurrentX;
  });

  const fontsItemBtn = document.querySelectorAll(".mobile-font-family-item");

  fontsItemBtn.forEach((item) => {
    item.addEventListener("click", () => {
      const fontFamily = item.innerText;
      console.log(fontFamily);
      const left = activeObject.left;
      const top = activeObject.top;
      activeObject.set("fontFamily", fontFamily);
      activeObject.set("left", left);
      activeObject.set("top", top);
      canvas.renderAll();
    });
  });

  mobileTextBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    fontFamilySubmenu.style.display = "block";
  });
}
