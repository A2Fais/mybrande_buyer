import { fetchedFonts } from "../scripts/main.js";
import createSubmenu from "./mobile_sub_menu.js";

export async function mobileTextMenu(canvas) {
  if (!canvas) return;

  const updateDisplay = () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const fontSize = activeObject?.text ? activeObject?.get("fontSize") : 0;
    const charSpacing = activeObject.get("charSpacing");

    const fontSizeValueElement = document.querySelector("#mobile-font-size-value");
    const fontSizeSlider = document.querySelector("#mobile-font-size-slider")
    if (fontSizeValueElement) {
      fontSizeValueElement.innerText = `Font Size: ${fontSize} px`;
      fontSizeSlider.value = fontSize;
    }

    const spacingValue = document.querySelector("#mobile-spacing-value");
    const spacingSlider = document.querySelector("#mobile-spacing-slider");
    if (spacingValue) {
      spacingValue.value = `Spacing: ${Math.round(charSpacing / 10)}px`;
      spacingSlider.value = Math.round(charSpacing);
    }

    const rotateValueElement = document.querySelector("#mobile-text-rotate-value");
    if (rotateValueElement) {
      rotateValueElement.innerText = `${Math.round(activeObject.angle)}°`;
    }
  };

  canvas.on("selection:created", updateDisplay);
  canvas.on("selection:updated", updateDisplay);

  const menuMain = document.querySelector("#mobile-category-content #mobile-text-view");

  const fontFamilySubmenu = createSubmenu(
    menuMain,
    `<div style="display: flex; flex-direction: column; align-items: flex-end; height: 100%;">
        <input type="text" id="mobile-font-search" placeholder="Search Fonts..." 
          style="width: 90%; padding: 8px; border: 1px solid #ccc; position: absolute; bottom: 80px; border-radius: 5px; font-size: 14px;" />
      <div id="mobile-fonts" style="display: flex; height: 100%; padding-right: 30px; gap: 30px; overflow-x: scroll; width: 90vw; align-items: center;"></div>
    </div>`,
    canvas
  );

  const fonts = await fetchedFonts();
  const mobileFontsContainer = document.querySelector("#mobile-fonts");

  const rotateSubmenu = createSubmenu(
    menuMain,
    `<div class="mobile-category-container">
      <div style="position: absolute; bottom: 0; left: 0; display: flex; gap: 10px; 
      flex-direction: column; width: 100svw; background: #ffffff; padding: 20px;">
        <output id="mobile-text-rotate-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Rotate: 0°</output>
        <input class="mobile-slider" type="range" id="mobile-rotate-slider" style="width: 90%;" min="0" max="360" value="0" />
      </div>
    </div>`,
    canvas
  );

  const fontStyleSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-style-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0;">
          <div id="mobile-font-normal" class="mobile-list mobile-category" value="Normal" style="text-align: center;"><i class="fas fa-font mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px">Normal</san></div>
          <div id="mobile-font-italic" class="mobile-list mobile-category" value="Italic" style="text-align: center;"><i class="fas fa-italic mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Italic</san></div>
          <div id="mobile-font-underline" class="mobile-list mobile-category" value="Underline" style="text-align: center;"><i class="fas fa-underline mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Underline</san></div>
    </div>`,
    canvas
  );

  const letterCaseSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-style-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
          <div id="mobile-font-uppercase" class="mobile-list mobile-category" value="Uppercase" style="text-align: center;"><i class="fas fa-arrow-up mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px">Uppercase</span></div>
          <div id="mobile-font-lowercase" class="mobile-list mobile-category" value="Lowercase" style="text-align: center;"><i class="fas fa-arrow-down mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Lowercase</span></div>
          <div id="mobile-font-titlecase" class="mobile-list mobile-category" value="Title Case" style="text-align: center;"><i class="fas fa-heading mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Title</span></div>
          <div id="mobile-font-sentencecase" class="mobile-list mobile-category" value="Sentence Case" style="text-align: center;"><i class="fas fa-paragraph mobile-category-icon" style="font-size: 20px;"></i><br><span style="font-size: 12px;">Sentence</span></div>
    </div>`,
    canvas
  );

  const fontCurveSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-curve-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
      <div style="position: absolute; bottom: 0; left: 0; display: flex; gap: 10px; 
      flex-direction: column; width: 100svw; background: #ffffff; padding: 20px;">
        <output id="mobile-curve-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Curve: 0°</output>
        <input class="mobile-slider" type="range" id="mobile-curve-slider" style="width: 90%;" min="0" max="5000" value="0" />
      </div>
    </div>`,
    canvas
  );

  const fontSpacingSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-spacing-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
      <div style="position: absolute; bottom: 0; left: 0; display: flex; gap: 10px; 
      flex-direction: column; width: 100svw; background: #ffffff; padding: 20px;">
        <output id="mobile-spacing-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Spacing: 0px</output>
        <input class="mobile-slider" type="range" id="mobile-spacing-slider" style="width: 90%;" min="-140" max="500" value="0" />
      </div>
    </div>`,
    canvas
  );

  const fontWeightSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-weight-category" class="mobile-category-container" style="padding: 0px;">
    <div id="mobile-font-weight-list"  style="display: flex; align-items: center; height: 100%; padding: 10px; overflow-x: scroll; gap: 30px;"></div>
    </div>`,
    canvas
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
    canvas
  );

  const fontSizeSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-font-size-category" class="mobile-category-container" style="display: flex; justify-content: center; align-items: center; height: 100%; padding: 10px 0; overflow-x: scroll;">
      <div style="position: absolute; bottom: 0; left: 0; display: flex; gap: 10px; 
      flex-direction: column; width: 100svw; background: #ffffff; padding: 20px;">
        <output id="mobile-font-size-value" style="display: block; font-size: 14px; font-weight: bold; color: var(--gray);">Font Size: 0px</output>
        <input class="mobile-slider" type="range" id="mobile-font-size-slider" style="width: 90%;" min="0" max="130" value="0" />
      </div>
    </div>`,
    canvas
  );

  const actionSubmenu = createSubmenu(
    menuMain,
    `<div class="mobile-category-container" style="padding: 5px 0;">
  <div style="display: flex; justify-content: space-around; width: 100%;">
    <div style="text-align: center;" id="mobile-duplicate-layer" class="action-item">
        <i class="fa-solid fa-copy action-icon" style="font-size: 20px; color: var(--gray-light);"></i>
        <div class="action-text" style="font-size: 12px; color: var(--gray-light);">Duplicate</div>
    </div>
    <div style="text-align: center;" id="mobile-visible-layer" class="action-item">
        <i class="fa-solid fa-eye action-icon" style="font-size: 20px; color: var(--gray-light);"></i>
        <div class="action-text" style="font-size: 12px; color: var(--gray-light);">Visible</div>
    </div>
    <div style="text-align: center;" id="mobile-forward-layer" class="action-item">
        <i class="fa-solid fa-arrow-up action-icon" style="font-size: 20px; color: var(--gray-light);"></i>
        <div class="action-text" style="font-size: 12px; color: var(--gray-light);">Forward</div>
    </div>
    <div style="text-align: center;" id="mobile-backward-layer" class="action-item">
        <i class="fa-solid fa-arrow-down action-icon" style="font-size: 20px; color: var(--gray-light);"></i>
        <div class="action-text" style="font-size: 12px; color: var(--gray-light);">Backward</div>
    </div>
    <div style="text-align: center;" id="mobile-remove-layer" class="action-item">
        <i class="fa-solid fa-trash action-icon" style="font-size: 20px; color: var(--gray-light);"></i>
        <div class="action-text" style="font-size: 12px; color: var(--gray-light);">Remove</div>
    </div>
    </div>
  </div>
`, canvas);

  document.querySelectorAll('.action-item').forEach(element => {
    const handleTouchStart = () => {
      const icon = element.querySelector('.action-icon');
      const text = element.querySelector('.action-text');
      
      if (icon) {
        icon.style.transition = 'all 0.2s ease';
        icon.style.transform = 'scale(1.2)';
        icon.style.color = 'var(--mybrande-blue)';
      }
      if (text) {
        text.style.transition = 'all 0.2s ease';
        text.style.transform = 'scale(1.1)';
        text.style.color = 'var(--mybrande-blue)';
      }
    };

    const handleTouchEnd = () => {
      const icon = element.querySelector('.action-icon');
      const text = element.querySelector('.action-text');
      
      if (icon) {
        icon.style.transform = '';
        icon.style.color = '';
        icon.style.transition = '';
      }
      if (text) {
        text.style.transform = '';
        text.style.color = '';
        text.style.transition = '';
      }
      element.blur();
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);
  });

  const colorsSubmenu = createSubmenu(
    menuMain,
    `<div id="mobile-colors-view" >

<div id="mobile-logo-color-categories" class="mobile-category-container" style="justify-content: center">
    <div id="mobile-logo-solid-category" class="mobile-category">
        <i class="fas fa-square mobile-category-icon"></i>
        <p class="mobile-category-text">Solid</p>
    </div>

    <div id="mobile-logo-color-picker-category" class="mobile-category">
        <i class="fas fa-palette mobile-category-icon"></i>
        <p class="mobile-category-text">C.Picker</p>
    </div>

    <div id="mobile-logo-linear-category" class="mobile-category">
        <i class="fas fa-arrows-alt-h mobile-category-icon"></i>
        <p class="mobile-category-text">Linear</p>
    </div>

    <div id="mobile-logo-none-category" class="mobile-category" style="display: none;">
        <i class="fas fa-ban mobile-category-icon" ></i>
        <p class="mobile-category-text">None</p>
    </div>
</div>

<div id="mobile-logo-solid-color-section" style="display: none; gap: 5px; justify-content: flex-start; padding-inline: 0 0 10px 0; 
  overflow-x: scroll; grid-template-colums: repeat(4, 1fr); width: 100svw; position: absolute; bottom: 0; left: 0; background: white;">
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #000000;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #545454;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #737373;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a6a6a6;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d9d9d9;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f5f5f5;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffffff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b25d1f;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e37627;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fc832b;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fd964b;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #febb8a;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fedfc9;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fff2e9;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ab2d2d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #de3a3a;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f74040;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f85d5d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fcb3b3;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fed0d0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffeded;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #8a6e10;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b89e1e;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e5c100;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffdd00;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffea66;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fff59d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffffe0;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #126f43;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #168a53;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #1dbf73;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #62d49f;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a6eaca;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #c9f4e0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e8faf4;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #1b8996;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #25a1b0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #3ad0e6;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #75dfee;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #afedf7;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #cdf5fb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ecfcff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #284389;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #3f63c8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #4a73e8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #819ef0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #9db4f3;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d4defb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f0f4ff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #6731a1;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #984ae8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a866ec;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b881f0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d8b9f7;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ecddfb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f8f0ff;"></span>
  </div>
</div>

<div id="mobile-logo-linear-color-section" style="display: flex; width: 100svw; align-items: center; height: 90px; gap: 5px; justify-content: center; overflow-x: scroll; display: none;">
  <mobile-pallete-component id="mobile-bg-pallete"></mobile-pallete-component>
</div>

<div id="mobile-logo-picker-color-section" style="position: absolute; bottom: 0; left: 0; background-color: #fff; display: flex; width: 100svw; align-items: center; height: 160px; gap: 5px; justify-content: center; overflow-x: scroll; display: none;">
 </div>

<div id="mobile-logo-none-color-section" style="display: flex; gap: 5px; justify-content: flex-start; padding-right: 30px; overflow-x: scroll; display: none;">
  <h1>None</h1> </div>
</div>`,
    canvas
  );

  const txtShadowSubmenu = createSubmenu(
    menuMain,
    `<div class="mobile-category-container"> 
      <div style="position: absolute; bottom: 0; left: 0; display: flex; flex-direction: column; 
      width: 100svw; background: #ffffff; padding: 20px; gap: 20px;">

        <div>
          <label id="blur-mobile-slider-title" style="font-size: 14px; font-weight: bold; color: var(--gray);">Blur: <span id="blur-value">5</span></label>
          <input class="mobile-slider" type="range" id="blur-mobile-slider" style="width: 90%;" min="0" max="100" value="5" step="1" />
        </div>

        <div>
          <label for="x-mobile-slider" style="font-size: 14px; font-weight: bold; color: var(--gray);">
          X Offset: <span id="x-value">0</span></label>
          <input class="mobile-slider" type="range" id="x-mobile-slider" style="width: 90%;" min="-50" max="50" value="0" step="1" />
        </div>

        <div>
          <label for="y-mobile-slider" style="font-size: 14px; font-weight: bold; color: var(--gray);">
          Y Offset: <span id="y-value">0</span></label>
          <input class="mobile-slider" type="range" id="y-mobile-slider" style="width: 90%;" min="-50" max="50" value="0" step="1" />
        </div>

     </div>
    </div>`,
  );

  mobileLogoScaleMenu(canvas);
  mobileLogoColorsMenu(canvas);
  mobileLogoShadowMenu(canvas);

  const mobileFontFamilyBtn = menuMain.querySelector("#mobile-font-family-category");
  const mobileTextRotateBtn = menuMain.querySelector("#mobile-rotate-category");

  const mobileFontStyleBtn = menuMain.querySelector("#mobile-font-style-category");
  const mobileFontWeightBtn = document.querySelector("#mobile-font-weight-category");
  const mobileFontCurveBtn = document.querySelector("#mobile-curve-text-category");
  const mobileFontSpacingBtn = document.querySelector("#mobile-letter-spacing-category");
  const mobileLetterCaseBtn = document.querySelector("#mobile-letter-case-category");
  const mobileTextLayersBtn = document.querySelector("#mobile-text-layer-actions-category");
  const mobileFontSizeBtn = document.querySelector("#mobile-font-size-category");
  const mobileTextColorsBtn = document.querySelector("#mobile-text-layer-colors-category");
  const mobileInputsbtn = document.querySelector("#mobile-input-category");
  const mobileTextShadowBtn = document.querySelector("#mobile-text-drop-shadow-category");

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
    
    // Pre-load font to show preview
    WebFont.load({
      google: {
        families: [`${font.family}:regular,bold`]
      },
      active: () => {
        fontContainer.style.fontFamily = font.family;
      }
    });
    
    fontContainer.style.padding = "14px";
    fontContainer.style.fontSize = "14px";
    fontContainer.style.fontWeight = "bold";
    fontContainer.style.alignItems = "center";
    fontContainer.style.justifyContent = "center";
    fontContainer.style.textAlign = "center";
    const fontText = font.family.split(",")[0].replace(/ /g, "\u00A0");
    fontContainer.append(fontText);

    fontContainer.addEventListener('click', async () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      // Store current properties
      const currentProps = {
        left: activeObject.left,
        top: activeObject.top,
        width: activeObject.width,
        height: activeObject.height,
        scaleX: activeObject.scaleX,
        scaleY: activeObject.scaleY,
        fontWeight: activeObject.get('fontWeight') || 'normal',
        fontStyle: activeObject.get('fontStyle') || 'normal'
      };

      try {
        // Show loading state
        canvas.renderAll();
        
        // Load font with all variants
        await new Promise((resolve, reject) => {
          WebFont.load({
            google: {
              families: [`${font.family}:${font.variants.join(',')}`]
            },
            active: resolve,
            inactive: reject,
            timeout: 3000 // 3 second timeout
          });
        });

        // Apply font while preserving properties
        activeObject.set({
          fontFamily: font.family,
          left: currentProps.left,
          top: currentProps.top,
          width: currentProps.width,
          height: currentProps.height,
          scaleX: currentProps.scaleX,
          scaleY: currentProps.scaleY,
          fontWeight: currentProps.fontWeight,
          fontStyle: currentProps.fontStyle
        });

        canvas.requestRenderAll();
        canvas.fire('object:modified');
        canvas.save();

      } catch (err) {
        console.error('Error loading font:', err);
        // Revert to previous state if font fails to load
        activeObject.set(currentProps);
        canvas.requestRenderAll();
      }
    });

    return fontContainer;
  }

  function renderFontsList(fontData) {
    if (!mobileFontsContainer) return;
    
    // Clear existing fonts
    mobileFontsContainer.innerHTML = '';
    
    fontData.forEach((font) => {
      const container = createFontElement(font);
      mobileFontsContainer.appendChild(container);
    });
  }

  // Initialize fonts view
  const fontsData = slicedFontView();
  renderFontsList(fontsData);

  // Scroll handling for loading more fonts
  let scrollStartPos = 0;
  let isLoadingFonts = false;

  const loadMoreFonts = (direction) => {
    if (isLoadingFonts) return;
    isLoadingFonts = true;

    if (direction === 'next') {
      scrollStartPos += 50;
    } else if (direction === 'prev' && scrollStartPos > 0) {
      scrollStartPos = Math.max(0, scrollStartPos - 50);
    }

    const newFontsData = slicedFontView(scrollStartPos);
    renderFontsList(newFontsData);

    setTimeout(() => {
      isLoadingFonts = false;
    }, 300);
  };

  // Handle mouse wheel scrolling
  mobileFontsContainer?.addEventListener("wheel", (event) => {
    const container = mobileFontsContainer;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (scrollLeft >= maxScroll - 50) {
      loadMoreFonts('next');
    } else if (scrollLeft <= 50 && scrollStartPos > 0) {
      loadMoreFonts('prev');
    }
  });

  // Handle touch scrolling
  let touchStartX = 0;
  
  mobileFontsContainer?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  });

  mobileFontsContainer?.addEventListener("touchmove", (event) => {
    const touchCurrentX = event.touches[0].clientX;
    const container = mobileFontsContainer;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (touchCurrentX < touchStartX && scrollLeft >= maxScroll - 50) {
      loadMoreFonts('next');
    } else if (touchCurrentX > touchStartX && scrollLeft <= 50 && scrollStartPos > 0) {
      loadMoreFonts('prev');
    }

    touchStartX = touchCurrentX;
  });

  // Improve search functionality
  const fontSearchInput = fontFamilySubmenu.querySelector("#mobile-font-search");
  fontSearchInput?.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Reset scroll position for search
    scrollStartPos = 0;
    
    const filteredFonts = fonts.filter((font) =>
      font.family.toLowerCase().startsWith(searchTerm)
    );

    renderFontsList(filteredFonts.slice(0, 50));
  });

  function triggerCurveSlider(value) {
    const slider = document.querySelector("#text-curve-range");
    slider.value = value;
    const event = new Event("input", { bubbles: true });
    slider.dispatchEvent(event);
    canvas.renderAll();
  }

  document.querySelector("#mobile-curve-slider").addEventListener("input", (event) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const value = event.target.value;
    triggerCurveSlider(value, activeObject);
  });

  function setFontweightElement() {
    const activeObject = canvas.getActiveObject();
    const fontWeightContainer = document.querySelector("#mobile-font-weight-list");
    fontWeightContainer.innerHTML = "";

    const currentActiveTextObject = activeObject
      ? activeObject.get("fontFamily")?.toLowerCase()
      : "poppins";

    fonts.forEach((font) => {
      if (font.family?.toLowerCase() === currentActiveTextObject) {
        font.variants.forEach((variant) => {
          const value = variant === "regular" ? "normal" : variant;
          const textElement = document.createElement("h3");
          const [text, number] = value.split(/(\d+)/).filter(Boolean);
          let str = "";
          if (number) {
            str += `${number}\u00A0`; 
          }
          str += text;
          textElement.append(str);
          textElement.style.textTransform = "capitalize";
          textElement.style.textOverflow = "ellipsis";
          textElement.style.fontSize = "14px";
          textElement.style.color = "var(--gray)";
          textElement.setAttribute("data-value", value);
          textElement.className = "mobile-font-weight-item";
          textElement.setAttribute("fontFamily", font.family);
          fontWeightContainer.append(textElement);

          textElement.addEventListener("click", (event) => {
            let weight = event.target.getAttribute("data-value");
            if (weight.includes("italic")) {
              weight = weight.replace("italic", "").trim();
              activeObject.set("fontStyle", "italic");
              activeObject.set("fontweightapply", true);
            } else {
              if (activeObject.get("fontweightapply"))
                activeObject.set("fontStyle", "normal");
            }

            activeObject.set("fontWeight", weight || "normal");
            activeObject.set("orgFontWeight", weight || "normal");
            canvas.renderAll();
            canvas.save();
          });
        });
      }
    });
  }

  document.querySelector("#mobile-text-layer-actions-category").addEventListener("click", () => {
    history.pushState({ category: "text/actions" }, null, "#text/actions");
    menuMain.style.display = "none";
    actionSubmenu.style.display = "flex";
    actionSubmenu.style.padding = "0";
  });

  mobileFontFamilyBtn.addEventListener("click", () => {
    history.pushState({ category: "text/fontFamily" }, null, "#text/fontFamily");
    menuMain.style.display = "none";
    fontFamilySubmenu.style.display = "flex";
  });

  mobileFontStyleBtn.addEventListener("click", () => {
    history.pushState({ category: "logo/font-style" }, null, "#logo/font-style");
    menuMain.style.display = "none";
    fontStyleSubmenu.style.display = "block";
  });

  mobileFontSizeBtn.addEventListener("click", () => {
    history.pushState({ category: "text/font-size" }, null, "#text/font-size");
    menuMain.style.display = "none";
    fontSizeSubmenu.style.display = "block";
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
    history.pushState({ category: "text/fontweight" }, null, "#text/fontweight");
    menuMain.style.display = "none";
    fontWeightSubmenu.style.display = "block";
    setFontweightElement();
  });

  mobileFontSpacingBtn.addEventListener("click", () => {
    history.pushState({ category: "text/fontspacing" }, null, "#text/fontspacing");
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

  mobileTextColorsBtn.addEventListener("click", () => {
    history.pushState({ category: "text/colors" }, null, "#text/colors");
    menuMain.style.display = "none";
    colorsSubmenu.style.display = "block";
  });

  mobileTextShadowBtn.addEventListener("click", () => {
    history.pushState({ category: "text/shadow" }, null, "#text/shadow");
    menuMain.style.display = "none";
    txtShadowSubmenu.style.display = "block";
  });

  document.querySelector("#mobile-spacing-slider").addEventListener("input", (e) => {
    const value = e.target.value;
    const letterSpacingSlider = document.querySelector("#letter-spacing-slider");
    letterSpacingSlider.value = value;

    const event = new Event("input");
    letterSpacingSlider.dispatchEvent(event);
    document.querySelector("#mobile-spacing-value").value = `Spacing: ${Math.round(value / 10)} px`;
  });

  document.querySelector("#mobile-font-size-slider").addEventListener("input", (event) => {
    const textSize = event.target.value;
    if (textSize > 0) {
      document.querySelector("#mobile-font-size-value").value = `Font Size: ${Math.round(textSize)}px`;
      const active = canvas.getActiveObject();

      const fontSize = textSize;
      if (active.type == "curved-text") {
        active.set("_cachedCanvas", null);
        if (fontSize < 5) return false;
        active.set("fontSize", fontSize);
      } else active.set("fontSize", fontSize);

      canvas.requestRenderAll();
    }
  });

  document.querySelector("#mobile-logoMainField").addEventListener("input", (e) => {
    const value = e.target.value;
    const objects = canvas.getObjects().filter((i) => i.text);
    const logoIdx = 0;
    const logo = objects[logoIdx];
    logo.set("text", value);
    canvas.renderAll();
  });

  const mobileRotateTextValue = document.querySelector("#mobile-text-rotate-value")
  const mobileRotateSlider = document.querySelector("#mobile-rotate-slider")

  mobileRotateSlider.addEventListener("input", (e) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const value = parseInt(e.target.value, 10);

    const mainRotateBar = document.querySelector("#rotate-bar")
    mainRotateBar.value = value;
    const event = new Event("input", { bubbles: true });
    mainRotateBar.dispatchEvent(event)
    mobileRotateTextValue.innerText = `Rotate: ${value}°`;
  });

  document.querySelector("#mobile-sloganNameField").addEventListener("input", (e) => {
    const value = e.target.value;
    const objects = canvas.getObjects().filter((i) => i.text);
    const sloganIdx = 1;
    const slogan = objects[sloganIdx];
    slogan.set("text", value);
    canvas.renderAll();
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

  const fontWeightBtns = document.querySelectorAll(".mobile-font-weight-item");
  fontWeightBtns.forEach((fontWeightBtn, idx) => {
    return fontWeightBtn.addEventListener("click", (event) => {
      const newActiveObject = canvas.getActiveObject();
      const weight = event.target.getAttribute("data-value");
      newActiveObject.set("fontWeight", weight || "normal");
      newActiveObject.set("orgFontWeight", weight || "normal");
      canvas.renderAll();
      canvas.save();
    });
  });

  document.querySelector("#mobile-font-normal").addEventListener("click", () => {
    updateFontStyle("normal");
  });

  document.querySelector("#mobile-font-italic").addEventListener("click", () => {
    updateFontStyle("italic");
  });

  document.querySelector("#mobile-font-underline").addEventListener("click", () => {
    updateFontStyle("underline", true);
  });

  document.querySelector("#mobile-font-uppercase").addEventListener("click", () => {
    updateLetterCase("Uppercase");
  });

  document.querySelector("#mobile-font-lowercase").addEventListener("click", () => {
    updateLetterCase("Lowercase");
  });

  document.querySelector("#mobile-font-titlecase").addEventListener("click", () => {
    updateLetterCase("Title Case");
  });

  document.querySelector("#mobile-font-sentencecase").addEventListener("click", () => {
    updateLetterCase("Sentence Case");
  });

  document.querySelectorAll('.mobile-category, .mobile-list').forEach(element => {
    const handleTouchStart = () => {
      const icon = element.querySelector('.mobile-category-icon');
      const text = element.querySelector('.mobile-category-text, span');
      
      if (icon) {
        icon.style.transition = 'all 0.2s ease';
        icon.style.transform = 'scale(1.2)';
        icon.style.color = 'var(--mybrande-blue)';
      }
      if (text) {
        text.style.transition = 'all 0.2s ease';
        text.style.transform = 'scale(1.1)';
        text.style.color = 'var(--mybrande-blue)';
      }
    };

    const handleTouchEnd = () => {
      const icon = element.querySelector('.mobile-category-icon');
      const text = element.querySelector('.mobile-category-text, span');
      
      if (icon) {
        icon.style.transform = '';
        icon.style.color = '';
        icon.style.transition = '';
      }
      if (text) {
        text.style.transform = '';
        text.style.color = '';
        text.style.transition = '';
      }
      element.blur();
    };

    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);
  });
}
