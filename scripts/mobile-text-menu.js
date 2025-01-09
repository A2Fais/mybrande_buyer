import { fetchedFonts } from "./main.js";
import createSubmenu from "./mobile-sub-menu.js";

export async function mobileTextMenu(canvas) {
  if (!canvas) return;

  const menuMain = document.querySelector(
    "#mobile-category-content #mobile-text-view",
  );

  const fontFamilySubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-fonts" style="display: flex; padding-right: 30px; gap: 30px; overflow-x: scroll; width: 90vw;"></div>`,
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

  const letterCaseSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-style-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
          <div id="mobile-font-uppercase" class="mobile-list mobile-category" value="Uppercase" style="text-align: center;"><i class="fas fa-arrow-up mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px">Uppercase</span></div>
          <div id="mobile-font-lowercase" class="mobile-list mobile-category" value="Lowercase" style="text-align: center;"><i class="fas fa-arrow-down mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Lowercase</span></div>
          <div id="mobile-font-titlecase" class="mobile-list mobile-category" value="Title Case" style="text-align: center;"><i class="fas fa-heading mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Title</span></div>
          <div id="mobile-font-sentencecase" class="mobile-list mobile-category" value="Sentence Case" style="text-align: center;"><i class="fas fa-paragraph mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Sentence</span></div>
    </div>`,
  );

  const fontCurveSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-curve-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
    <h1>Font Curve</h1>
    </div>`,
  );

  const fontSpacingSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-spacing-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
    <h1>Font Spacing</h1>
    </div>`,
  );

  const fontWeightSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-weight-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
    <h1>Font Weight</h1>
    </div>`,
  );

  const textInputsSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-text-input-category" class="mobile-category-container" style="justify-content: center; height: 80px; background: #ffffff; padding: 8px; position: absolute; bottom: 0">
      <div style="display: flex; flex-direction: column; gap: 8px;">
      <input type="text" id="mobile-logoMainField" placeholder="Logo Name" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px;" />
      <input type="text" id="mobile-sloganNameField" placeholder="Slogan Name" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px;" />
      </div>
    </div>
    `,
  );

  // NAVIGATION BUTTONS
  const mobileFontFamilyBtn = menuMain.querySelector(
    "#mobile-font-family-category",
  );
  const mobileTextRotateBtn = menuMain.querySelector("#mobile-rotate-category");

  const mobileFontStyleBtn = menuMain.querySelector(
    "#mobile-font-style-category",
  );
  const mobileFontWeightBtn = document.querySelector(
    "#mobile-font-weight-category",
  );
  const mobileFontCurveBtn = document.querySelector(
    "#mobile-curve-text-category",
  );
  const mobileFontSpacingBtn = document.querySelector(
    "#mobile-letter-spacing-category",
  );
  const mobileLetterCaseBtn = document.querySelector(
    "#mobile-letter-case-category",
  );
  const mobileTextLayersBtn = document.querySelector(
    "#mobile-text-layer-actions-category",
  );
  const mobileFontSizeBtn = document.querySelector(
    "#mobile-font-size-category",
  );
  const mobileTextColorsBtn = document.querySelector(
    "#mobile-text-layer-colors-category",
  );
  const mobileInputsbtn = document.querySelector("#mobile-input-category");
  const mobileTextShadowBtn = document.querySelector(
    "#mobile-text-drop-shadow-category",
  );

  // FONT VIEW HORIZONTAL LIST VIRTUALIZATION
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
    if (!mobileFontsContainer) return;
    fontData.forEach((font) => {
      const container = createFontElement(font);
      mobileFontsContainer.appendChild(container);
    });
  }

  const fontsData = slicedFontView();
  renderFontsList(fontsData);

  let scrollStartPos = 0;
  let touchStartX = 1;

  mobileFontsContainer?.addEventListener("touchstart", (event) => {
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

  // BUTTON EVENTS

  mobileFontFamilyBtn.addEventListener("click", () => {
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

  mobileTextRotateBtn.addEventListener("click", () => {
    history.pushState({ category: "text/rotate" }, null, "#text/rotate");
    menuMain.style.display = "none";
    rotateSubmenu.style.display = "block";
  });

  mobileLetterCaseBtn.addEventListener("click", () => {
    history.pushState({ category: "text/letercase" }, null, "#text/lettercase");
    menuMain.style.display = "none";
    letterCaseSubmenu.style.display = "block";
  });

  mobileFontWeightBtn.addEventListener("click", () => {
    history.pushState(
      { category: "text/fontweight" },
      null,
      "#text/fontweight",
    );
    menuMain.style.display = "none";
    fontWeightSubmenu.style.display = "block";
  });

  mobileFontSpacingBtn.addEventListener("click", () => {
    history.pushState(
      { category: "text/fontspacing" },
      null,
      "#text/fontspacing",
    );
    menuMain.style.display = "none";
    fontSpacingSubmenu.style.display = "block";
  });

  mobileFontCurveBtn.addEventListener("click", () => {
    history.pushState({ category: "text/fontcurve" }, null, "#text/fontcurve");
    menuMain.style.display = "none";
    fontCurveSubmenu.style.display = "block";
  });

  mobileInputsbtn.addEventListener("click", () => {
    history.pushState({ category: "text/inputs" }, null, "#text/inputs");
    menuMain.style.display = "none";
    textInputsSubmenu.style.display = "block";
  });

  // NESTED SUBMENU EVENTS

  document
    .querySelector("#mobile-logoMainField")
    .addEventListener("input", (e) => {
      const value = e.target.value;
      const objects = canvas.getObjects().filter((i) => i.text);
      const logoIdx = 0;
      const logo = objects[logoIdx];
      logo.set("text", value);
      canvas.renderAll();
    });

  document
    .querySelector("#mobile-sloganNameField")
    .addEventListener("input", (e) => {
      const value = e.target.value;
      const objects = canvas.getObjects().filter((i) => i.text);
      const sloganIdx = 1;
      const slogan = objects[sloganIdx];
      slogan.set("text", value);
      canvas.renderAll();
    });

  const fontFamilyBtns = document.querySelectorAll(".mobile-font-family-item");
  fontFamilyBtns.forEach((fontFamilyBtn) => {
    return fontFamilyBtn.addEventListener("click", () => {
      console.log("fontFamilyBtn");
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      const fontFamily = fontFamilyBtn.innerText;
      console.log(fontFamily);
      activeObject.set("fontFamily", fontFamily);
      canvas.renderAll();
    });
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

  function updateLetterCase(caseType) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const text = activeObject.text;
    let newText = text;

    switch (caseType) {
      case "Uppercase":
        newText = text.toUpperCase();
        break;
      case "Lowercase":
        newText = text.toLowerCase();
        break;
      case "Title Case":
        newText = text
          .split(" ")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(" ");
        break;
      case "Sentence Case":
        newText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
    }

    activeObject.set("text", newText);
    activeObject.set("letterCase", caseType);
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

  document
    .querySelector("#mobile-font-uppercase")
    .addEventListener("click", () => {
      updateLetterCase("Uppercase");
    });

  document
    .querySelector("#mobile-font-lowercase")
    .addEventListener("click", () => {
      updateLetterCase("Lowercase");
    });

  document
    .querySelector("#mobile-font-titlecase")
    .addEventListener("click", () => {
      updateLetterCase("Title Case");
    });

  document
    .querySelector("#mobile-font-sentencecase")
    .addEventListener("click", () => {
      updateLetterCase("Sentence Case");
    });
}
