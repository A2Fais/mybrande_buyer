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

  const menuMain = document.querySelector(
    "#mobile-category-content #mobile-text-view",
  );
  const mobileTextBtn = menuMain.querySelector("#mobile-font-family-category");

  const rotateBtn = menuMain.querySelector("#mobile-rotate-category");
  const fontFamilySubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-fonts" style="display: flex; padding-right: 30px; gap: 30px; overflow-x: scroll; width: 90vw;"></div>`,
  );

  const mobileFontStyleBtn = menuMain.querySelector(
    "#mobile-font-style-category",
  );

  const fonts = await fetchedFonts();
  const mobileFontsContainer = document.querySelector("#mobile-fonts");

  const rotateSubmenu = createSubmenu(
    menuMain,
    `<div class="mobile-category-container">
      <div style="position: absolute; bottom: 0; left: 0; display: flex; gap: 10px; 
      flex-direction: column; width: 100svw; background: #ffffff; padding: 20px;">
        <output id="mobile-rotate-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Rotate: 0°</output>
        <input class="mobile-slider" type="range" id="mobile-rotate-slider" style="width: 90%;" min="0" max="360" value="0" />
      </div>
    </div>`,
  );

  const fontStyleSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-style-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0;">
          <div id="mobile-font-normal" class="mobile-list mobile-category" value="Normal" style="text-align: center;"><i class="fas fa-font mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px">Normal</san></div>
          <div id="mobile-font-italic" class="mobile-list mobile-category" value="Italic" style="text-align: center;"><i class="fas fa-italic mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Italic</san></div>
          <div id="mobile-font-underline" class="mobile-list mobile-category" value="Underline" style="text-align: center;"><i class="fas fa-underline mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Underline</san></div>
    </div>`,
  );

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

  const fontFamilyBtns = document.querySelectorAll(".mobile-font-family-item");

  function fontFamilyBtnAction(fontFamilyBtn) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const fontFamily = fontFamilyBtn.innerText;
    const left = activeObject.left;
    const top = activeObject.top;
    activeObject.set("fontFamily", fontFamily);
    activeObject.set("left", left);
    activeObject.set("top", top);
    canvas.renderAll();
  }

  fontFamilyBtns.forEach((fontFamilyBtn) => {
    fontFamilyBtn.addEventListener("click", () =>
      fontFamilyBtnAction(fontFamilyBtn),
    );
  });

  mobileTextBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    history.pushState(
      { category: "text/fontFamily" },
      null,
      "#text/fontFamily",
    );
    fontFamilySubmenu.style.display = "block";
  });

  mobileFontStyleBtn.addEventListener("click", () => {
    history.pushState(
      { category: "logo/font-style" },
      null,
      "#logo/font-style",
    );
    menuMain.style.display = "none";
    fontStyleSubmenu.style.display = "block";
  });

  rotateBtn.addEventListener("click", () => {
    history.pushState({ category: "text/rotate" }, null, "#text/rotate");
    menuMain.style.display = "none";
    rotateSubmenu.style.display = "block";
  });

  function updateFontStyle(style, underline = false) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.set("fontStyle_", style);
    activeObject.set("fontStyle", style);
    activeObject.set("underline", underline);
    canvas.renderAll();
    canvas.save();
  }

  document
    .querySelector("#mobile-font-normal")
    .addEventListener("click", () => {
      updateFontStyle("normal");
    });

  document
    .querySelector("#mobile-font-italic")
    .addEventListener("click", () => {
      updateFontStyle("italic");
    });

  document
    .querySelector("#mobile-font-underline")
    .addEventListener("click", () => {
      updateFontStyle("underline", true);
    });
}
