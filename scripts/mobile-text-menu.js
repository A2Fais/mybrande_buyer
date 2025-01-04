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
  const fontData = fonts.filter((_, idx) => idx <= 10);
  const mobileFontsContainer = document.querySelector("#mobile-fonts");

  fontData.map((font) => {
    const fontContainer = document.createElement("span");
    fontContainer.style.width = "max-content";
    fontContainer.style.height = "max-content";
    fontContainer.style.fontFamily = font.family;
    fontContainer.style.fontSize = "12px";
    fontContainer.style.fontWeight = "bold";
    fontContainer.style.alignItems = "center";
    fontContainer.style.justifyContent = "center";
    fontContainer.style.textAlign = "center";

    fontContainer.append(font.family.split(",")[0]);
    mobileFontsContainer.appendChild(fontContainer);
  });

  mobileTextBtn.addEventListener("click", () => {
    menuMain.style.display = "none";
    fontFamilySubmenu.style.display = "block";
  });
}
