import { fabric } from "fabric";
import { CreateLayerSection } from "../commons/create_layer.js";
import { CanvasGuides } from "./snap_lines.js";
import { toastNotification } from "./toast_notification.js";
import "alwan/dist/css/alwan.min.css";
import iro from "@jaames/iro";
import WebFont from "webfontloader";
import axios from "axios";
import { rgbToHex, hexToHsl, hexToRgb, rgbaToHex } from "./color_converter";
import { rotateReset } from "./rotate_reset";
import { saveCanvas } from "./save_canvas";
import SaveHistory from "./save_history.js";
import { curvedText } from "./curved_text.js";
import { ApplyLinearGradient } from "./apply_linear_grad.js";
import {
  bgColorAction,
  solidColorAction,
  solidColorTextAction,
  updateColorPickers,
  updateColorTextPickers,
} from "./color_events.js";
import setlogoPosition from "./logo_position.js";
import initMultiSelectList from "./multi_select_list.js";
import { attachHSLHandlers, attachRGBHandlers } from "./color_picker_util.js";
import loadExternalLayers from "./exter_layers_loader.js";
import { getAttr, querySelect, querySelectAll } from "./selectors.js";
import resizeCanvas from "./resize_canvas.js";
import renderCanvas from "./render_canvas.js";

fabric.CurvedText = curvedText;

export class EditorScreen {
  constructor() {
    this.canvasBG = "#ffffff";

    this.canvas = new fabric.Canvas("c", { backgroundColor: this.canvasBG });
    this.loadedFonts = {};
    this.magnifier = new fabric.Canvas("magnifier", {
      backgroundColor: this.canvasBG,
    });
    CanvasGuides(this.canvas);

    this.currentGradiantColors = {
      grad1Value: "#ffffff",
      grad2Value: "#000000",
    };
    this.loadedIcons = {};
    this.allFonts = {};
    this.changeFontWeight = true;
    this.activeSection = "";
    this.textMode = querySelect('.nav-item[data-name="text"]');
    this.logoMode = querySelect('.nav-item[data-name="logo"]');
    this.uploadsMode = querySelect('.nav-item[data-name="upload"]');
    this.backgroundMode = querySelect('.nav-item[data-name="background"]');
    this.previewMode = querySelect('.nav-item[data-name="preview"]');
    this.galleryMode = querySelect('.nav-item[data-name="gallery"]');
    this.logoName = "My Brand Name";
    this.sloganName = "Slogan goes here";
    this.iconList = null;
    this.rotateRange = querySelect("#rotate-bar");
    this.saveBtn = querySelect("#save-btn");
    this.scaleRangeUploads = querySelect("#progress-bar-uploads");
    this.flipHorizontal = querySelect("#flip-x");
    this.flipVertical = querySelect("#flip-y");
    this.activeLayerIndex = null;
    this.logoFile = localStorage.getItem("logo-file");
    this.layers = querySelect("#layers");
    this.textLayers = querySelect("#text-layers");
    this.rotateValue = null;
    this.isRotating = false;
    this.scaleValue = 3;
    this.urlParams = new URLSearchParams(document.location.search);
    this.isScaling = null;
    this.isFlipX = false;
    this.isFlipY = false;
    this.textcolorPicker = querySelect("#color-picker");
    this.logoColorPicker = querySelect("#logo-color-picker");
    this.logoColorPicker1 = querySelect("#logo-color-picker1");
    this.logoColorPicker2 = querySelect("#logo-color-picker2");
    this.logoNameInput = querySelect("#logoNameInput");
    this.sloganNameInput = querySelect("#sloganNameInput");
    this.logoSettingsContainer = querySelect(".setting-container");
    this.textSettingsContainer = querySelect(".text-settings-container");
    this.backgroundSettingsContainer = querySelect(".bg-settings-container");
    this.uploadSettingsContainer = querySelect(".uploads-settings-container");
    this.textColorPickerContainer = querySelect(".color-picker-container");
    this.letterSpacingSlider = querySelect("#letter-spacing-slider");
    this.textColorPickerValue = "#eeeeee";
    this.letterSpacing = "0";
    this.textSelector = querySelect("#text-selector");
    this.shadowBlurSlider = querySelect("#shadow-blur-slider");
    this.shadowOffsetXSlider = querySelect("#shadow-offsetX-slider");
    this.shadowOffsetYSlider = querySelect("#shadow-offsetY-slider");
    this.logoShadowOffsetXSlider = querySelect("#logo-shadow-offsetX-slider");
    this.logoShadowOffsetYSlider = querySelect("#logo-shadow-offsetY-slider");
    this.shadowBlur = null;
    this.shadowOffsetX = null;
    this.shadowOffsetY = null;
    this.logoShadowBlur = null;
    this.logoShadowOffsetX = null;
    this.logoShadowOffsetY = null;
    this.textSettingsContainer.style.display = "none";
    this.canvasZoomLevel = 1;
    this.settingsListTitle = querySelect(".setting-list-item__title");
    this.settingsList = querySelect(".setting-list-items-li");
    this.fontSizeList = querySelect(".font_size-list-items-li");
    this.caseList = querySelect(".case-list-items-li");
    this.fontSelector = querySelect(".font-selector");
    this.textSelectorValue = "LogoName";
    this.logoFillColor = null;
    this.zoomSlider = querySelect("#zoom-slider");
    this.colorMode = "Solid";
    this.activeNavbarSetting = "logo";
    this.initialRotation = null;
    this.logoOrientation = null;
    this.alignId = 1;
    this.fontItems = [];
    let self = this;

    this.fetchFonts = async () => {
      const key = "AIzaSyBoi7l2IikHgIpoQXsFocf3MzLOWx2mD9A";
      let apiResponse = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`,
      );
      apiResponse = await apiResponse.json();
      this.fontItems = apiResponse.items;

      this.fontItems.map((item) => {
        this.allFonts[item.family] = item;
      });
      return apiResponse?.items;
    };

    this.fetchFonts().then(async (items = []) => {
      let currentFontIndex = 0,
        fontMaxCount = 20;
      const chunk = items.slice(
        currentFontIndex,
        currentFontIndex + fontMaxCount,
      );
      currentFontIndex += fontMaxCount;

      let liItems = "";
      for (const item of chunk) {
        const { family, variants } = item;

        self.loadedFonts[family] = { variants };
        self.allFonts[family].loaded = true;

        const families = variants.map((variant) => `${family}:${variant}`);

        await new Promise((resolve, reject) => {
          WebFont.load({
            google: {
              families,
            },
            active: resolve,
            inactive: reject,
          });
        });

        liItems += `<li value="${family}" class="font-family-item" data-loaded="true">
          <span style="font-family:${family}; font-weight: 500" class="text">${family}</span></li>`;
      }

      querySelect("#font-family-con .collection").innerHTML += liItems;
      initMultiSelectList();
    });

    querySelect("#logoMainField").addEventListener("change", () => {
      this.canvasHistory.saveHistory();
    });

    this.canvas.save = function () {
      self?.canvasHistory?.saveHistory();
    };
    this.canvas.undoCB = () => {
      let layers = querySelectAll("#layers .layer-container");
      layers.forEach((layer) => {
        layer.style.display = "none";
      });

      this.canvas._objects.forEach((obj) => {
        if (obj.layerId) {
          let layer = querySelect(`.layer-container[data-id="${obj.layerId}"]`);
          if (!layer) return true;
          layer.style.display = "flex";
          layer.querySelector(".layer-img").classList.remove("selected");
          layer.querySelector(".layer-span").classList.remove("selected");
        }
      });
      this.canvas.refreshLayerNames();
    };

    querySelect("#sloganNameField").addEventListener("change", () => {
      this.canvasHistory.saveHistory();
    });

    this.transparentLoader = (isOn = true) => {
      querySelect("#loader_font").style.display = isOn ? "block" : "none";
      querySelect("#loader_font").style.background = "#ffffffbb";
    };

    this.rotateObject = () => {
      const active = this.canvas.getActiveObject();

      if (this.isRotating && active && this.rotateValue) {
        active.rotate(this.rotateValue);
        this.canvas.requestRenderAll();
      }
      this.isRotating = false;
    };

    this.scaleObject = () => {
      const active = this.canvas.getActiveObject();
      const currCoordinate = active?.getCenterPoint();

      if (this.isScaling && active && this.scaleValue) {
        active.scale(this.scaleValue);

        active.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          "center",
          "center",
        );
        active.setCoords();
        active.scaleValue = this.scaleValue;
      }
      this.isScaling = false;
    };

    querySelect("#rotate_reset").addEventListener("click", () => {
      const active = this.canvas.getActiveObject();
      if (!active) return true;
      if (active.angle == 0) return false;
      rotateReset(active);
      this.canvas.requestRenderAll();
      querySelect("#rotate_info").innerText = "Rotate: 0deg";
      this.rotateRange.value = 0;
      if (active) this.canvas.save();
      this.canvas.renderAll();
      this.canvas.updatePreview();
    });

    querySelect("#text-rotate_reset").addEventListener("click", () => {
      const active = this.canvas.getActiveObject();
      if (!active) return true;
      if (active.angle == 0) return false;
      rotateReset(active);
      this.canvas.requestRenderAll();
      querySelect("#rotate_info").innerText = "Rotate: 0deg";
      this.rotateRange.value = 0;
      if (active) this.canvas.save();
      this.canvas.renderAll();
      this.canvas.updatePreview();
    });

    this.shadowChanger = (sloganNameElement, logoNameElement) => {
      const element =
        this.textSelectorValue === "SloganName"
          ? sloganNameElement
          : logoNameElement;
      element.set("shadow", {
        offsetX: this.shadowOffsetX,
        offsetY: this.shadowOffsetY,
        blur: this.shadowBlur,
      });
    };

    this.canvas.on("after:render", () => {
      querySelect("#loader_font").style.display = "none";
    });
  }

  hideCanvasGuides() {
    let positionlines = this.canvas._objects.filter(
      (obj) => obj.isPositioningLine,
    );
    for (let i = 0; i < positionlines.length; i++) {
      this.canvas.remove(positionlines[i]);
    }
  }

  initialize() {
    var self = this;
    const updatePreview = () => {
      const imageURL = this.canvas.lowerCanvasEl.toDataURL({
        format: "png",
        multiplier: 0.5,
      });

      querySelect("#magnifier_img").src = imageURL;
    };
    this.canvas.updatePreview = updatePreview;

    const refreshLayerNames = () => {
      let layerItems = Array.from(this.layers.childNodes).filter(
        (i) => i.style.display !== "none",
      );
      let count = 1;
      layerItems.forEach((l) => {
        let span = l.querySelector(".layer-span");
        l.setAttribute("data_layer", count);
        span.innerText = `Layer ${count}`;
        count++;
      });
    };
    this.canvas.refreshLayerNames = refreshLayerNames;

    updatePreview();

    fabric.Object.prototype.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      mtr: false,
      bl: true,
      br: true,
      tl: true,
      tr: true,
    });

    this.canvas.requestRenderAll();

    let resizeTimeout;
    function handleResize() {
      const mainEditorCounter = localStorage.getItem("mainEditorCounter");
      if (mainEditorCounter !== "1") return;

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas(self);
        location.reload();
      }, 100);
    }

    resizeCanvas(self);
    window.addEventListener("resize", handleResize);

    this.updateActiveNavbar = () => {
      querySelectAll(".nav-item").forEach((item) => {
        if (this.activeNavbarSetting.includes(item.innerText.toLowerCase())) {
          item.style.backgroundColor = "var(--gold-darker)";
        } else {
          item.style.backgroundColor = "var(--gold)";
        }
      });
    };

    this.updateActiveNavbar();

    const toTitleCase = (str) => {
      return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
      );
    };

    const toSentenceCase = (str) => {
      const stack = [];
      stack.push(str[0].toUpperCase());
      for (let i = 1; i < str.length; i++) {
        stack.push(str[i].toLowerCase());
      }
      return stack.join("");
    };

    querySelect(".font-family-selectbox").addEventListener(
      "change",
      function () {
        const family = this.getAttribute("data-value");
        const loaded = this.getAttribute("data-loaded");
        const obj = self.canvas.getActiveObject();
        const currCoordinate = obj?.getCenterPoint();

        if (!obj) return false;
        let { variants } = self.loadedFonts[family];

        if (loaded == "false") {
          const familyWithVariants = `${family}:${variants.join(",")}`;

          WebFont.load({
            google: {
              families: [familyWithVariants],
            },
            active: function () {
              obj.set("fontFamily", family);
              self.canvas.renderAll();
            },
          });
        }

        if (self.changeFontWeight) {
          obj.set("fontStyle", "normal");
          obj.set("fontWeight", "normal");
          obj.set("orgFontWeight", "normal");
        }
        obj.set("fontFamily", family);

        let variantsHtml = "";
        let values = {};

        function formatString(input) {
          const fontTitle = {
            100: "Thin",
            200: "Extra Light",
            300: "Light",
            400: "Regular",
            500: "Medium",
            600: "Semi Bold",
            700: "Bold",
            800: "Extra Bold",
            900: "Black",
          };

          let formatted = input.replace(/([0-9]+)/g, (item) => {
            let key = parseInt(item);
            return fontTitle[key] + " " + key + " ";
          });
          return toTitleCase(formatted);
        }

        variants.map((variant) => {
          const value = values[variant] ? values[variant] : variant;

          variantsHtml += `<li value="${value == "regular" ? "normal" : value
            }" style="text-transform:capitalize">${formatString(value)}</li>`;
        });

        let target = querySelect(".font-weight-selector .ms-select-list-menu");
        target.innerHTML = variantsHtml;

        initMultiSelectList();

        obj.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          "center",
          "center",
        );
        obj.setCoords();
        self.canvas.requestRenderAll();
        updatePreview();
        self.canvas.save();
      },
    );

    querySelect(".text-case-select-box").addEventListener(
      "change",
      function () {
        const selectedTextElement = this.getAttribute("data-value"),
          obj = self.canvas.getActiveObject();
        if (!obj) return false;
        let currCoordinate = obj.getCenterPoint(),
          existingFont = obj.get("fontFamily"),
          existingFill = obj.get("fill"),
          existingSelectable = obj.get("selectable"),
          HasRotatingPoint = obj.get("hasRotatingPoint"),
          existingDiameter = obj.get("diameter"),
          existingLeft = obj.get("left"),
          existingTop = obj.get("top"),
          existingFlipped = obj.get("flipped"),
          existingFontSize = obj.get("fontSize");
        obj.set("letterCase", selectedTextElement);
        obj.set("fontSize", 40);

        const text = obj?.text;
        if (selectedTextElement === "Uppercase") obj.text = text.toUpperCase();
        else if (selectedTextElement === "Lowercase")
          obj.text = text.toLowerCase();
        else if (selectedTextElement === "Title Case")
          obj.text = toTitleCase(text);
        else if (selectedTextElement === "Sentence Case")
          obj.text = toSentenceCase(text);

        obj.set("fontFamily", existingFont);
        obj.set("fill", existingFill);
        obj.set("selectable", existingSelectable);
        obj.set("hasRotatingPoint", HasRotatingPoint);
        obj.set("diameter", existingDiameter);
        obj.set("left", existingLeft);
        obj.set("top", existingTop);
        obj.set("flipped", existingFlipped);
        obj.set("fontSize", existingFontSize);

        obj.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          "center",
          "center",
        );
        obj.setCoords();

        self.canvas.renderAll();
        updatePreview();
        self.canvas.save();
      },
    );

    querySelect(".font-weight-selector").addEventListener(
      "change",
      async function () {
        let weight = this.getAttribute("data-value");
        const obj = self.canvas.getActiveObject();
        if (!obj) return false;

        const family = obj.get("fontFamily");

        if (self.loadedFonts[family]) {
          const familyWithWeight = `${family}:${weight}`;

          await new Promise((resolve, reject) => {
            WebFont.load({
              google: {
                families: [familyWithWeight],
              },
              active: resolve,
              inactive: reject,
            });
          });

          if (weight.includes("italic")) {
            weight = weight.replace("italic", "").trim();
            obj.set("fontStyle", "italic");
            obj.set("fontweightapply", true);
          } else {
            if (obj.get("fontweightapply")) obj.set("fontStyle", "normal");
          }

          obj.set("fontWeight", weight || "normal");
          obj.set("orgFontWeight", weight || "normal");

          self.canvas.renderAll();
          updatePreview();
          self.canvas.save();
        }
      },
    );

    self.canvas.on("object:selected", function () {
      const obj = self.canvas.getActiveObject();
      if (obj && obj.get("fontWeight")) {
        obj.set("fontWeight", obj.get("fontWeight"));
        if (obj.get("fontStyle") === "italic") {
          obj.set("fontStyle", "italic");
        }
        self.canvas.renderAll();
      }
    });

    querySelect(".font-style-selector").addEventListener("change", function () {
      let value = this.getAttribute("data-value"),
        obj = self.canvas.getActiveObject();
      if (!obj) return false;
      if (value == "Underline") obj.set("underline", true);
      else {
        obj.set("underline", false);
        obj.set("fontStyle", value);
        obj.set("fontStyle_", value);
      }

      self.canvas.renderAll();
      updatePreview();
      self.canvas.save();
    });

    this.rotateRange.addEventListener("input", (e) => {
      this.isRotating = true;
      this.rotateValue = e.target.value;
      querySelect("#rotate_info").innerText = `Rotate: ${parseInt(
        this.rotateValue,
      )}deg`;
      this.rotateObject();
    });

    this.rotateRange.addEventListener("change", () => {
      updatePreview();
      self.canvas.save();
    });

    querySelect("#rotate-bar-uploads").addEventListener("input", (e) => {
      this.isRotating = true;
      this.rotateValue = parseInt(e.target.value, 10);
      this.rotateObject();
    });

    querySelect("#text-rotate-bar").addEventListener("input", (e) => {
      this.isRotating = true;
      this.rotateValue = parseInt(e.target.value, 10);
      this.rotateObject();
    });

    this.saveBtn.addEventListener("click", () => {
      if (
        !this.canvasBG ||
        !logoNameElement ||
        !sloganNameElement ||
        !this.alignId
      ) {
        return toastNotification("Data Error");
      }

      const logoId = querySelect("#logo_id")?.value;

      saveCanvas(
        logoId,
        this.canvas,
        this.canvasBG,
        logoNameElement,
        sloganNameElement,
        this.alignId,
      );
    });

    querySelect("#save-package").addEventListener("click", () => {
      if (
        !this.canvasBG ||
        !logoNameElement ||
        !sloganNameElement ||
        !this.alignId
      ) {
        return toastNotification("Data Error");
      }

      const logoId = querySelect("#logo_id")?.value;
      saveCanvas(
        logoId,
        this.canvas,
        this.canvasBG,
        logoNameElement,
        sloganNameElement,
        this.alignId,
        true,
      );
    });

    querySelect("#third_page_btn").addEventListener("click", () => {
      const saveSettings = {
        format: "jpg",
        multiplier: 1,
      };
      const savedLogo = this.canvas.toDataURL(saveSettings);
      localStorage.setItem("logo-file", savedLogo);
      localStorage.setItem("mainEditorCounter", 3);
      location.reload();

      setTimeout(() => {
        querySelect("#drag_drop_view").style.display = "none";
        querySelect("#main_editor_view").style.display = "none";
        querySelect("#details_view").style.display = "block";
      }, 50);
    });

    function convertToZeroToTwo(value, minOriginal, maxOriginal) {
      let rangeOriginal = maxOriginal - minOriginal;
      let newValue = ((value - minOriginal) / rangeOriginal) * 2;
      const res = Math.min(newValue, 2);
      return res.toFixed(3);
    }

    var newMaxScaleValue;
    function setMaxScaleValue() {
      const activeScaleObj = self.canvas.getActiveObject();
      if (activeScaleObj) {
        const maxScaleValue = activeScaleObj.getScaledWidth();
        newMaxScaleValue = (maxScaleValue - 1) * 2;
        const scaleRangeInput = querySelect("#scale-range");
        scaleRangeInput.max = newMaxScaleValue;
        scaleRangeInput.min = 0;
        scaleRangeInput.value = maxScaleValue - 1;
        querySelect("#scale-value").value = convertToZeroToTwo(
          maxScaleValue,
          0,
          newMaxScaleValue,
        );
      }
    }

    self.canvas.on("selection:updated", setMaxScaleValue);
    self.canvas.on("selection:created", setMaxScaleValue);

    querySelect("#scale-range").addEventListener("input", (e) => {
      const scaleValue = e.target.value;
      querySelect("#scale-value").value = convertToZeroToTwo(
        scaleValue,
        0,
        newMaxScaleValue,
      );
      const activeScaleObj = self.canvas.getActiveObject();
      if (activeScaleObj) {
        activeScaleObj.scaleToWidth(scaleValue);
        self.canvas.requestRenderAll();
      }
    });

    querySelect("#scale_up").addEventListener("click", () => {
      querySelect("#scale-range").value =
        parseInt(querySelect("#scale-range").value) + 1;
      querySelect("#scale-range").dispatchEvent(new Event("input"));
    });

    querySelect("#scale_down").addEventListener("click", () => {
      querySelect("#scale-range").value =
        parseInt(querySelect("#scale-range").value) - 1;
      querySelect("#scale-range").dispatchEvent(new Event("input"));
    });

    querySelect("#scale-range").addEventListener("change", function () {
      updatePreview();
      self.canvas.save();
    });

    this.flipHorizontal.addEventListener("change", () => {
      const active = this.canvas.getActiveObject();
      const currCoordinate = active.getCenterPoint();

      if (active) {
        this.isFlipX = !this.isFlipX;
        active.set("flipX", this.isFlipX);

        active.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          "center",
          "center",
        );
        active.setCoords();

        this.canvas.renderAll();
      }

      updatePreview();
      if (active) this.canvas.save();
    });

    this.flipVertical.addEventListener("change", () => {
      const active = this.canvas.getActiveObject();
      const currCoordinate = active.getCenterPoint();

      if (active) {
        this.isFlipY = !this.isFlipY;
        active.set("flipY", this.isFlipY);

        active.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          "center",
          "center",
        );
        active.setCoords();

        this.canvas.renderAll();
        if (active) this.canvas.save();
        updatePreview();
      }
    });

    this.layers.addEventListener("click", (e) => {
      const target = e.target.closest(".layer-container");

      let id = target.getAttribute("data-id");
      let obj = null;

      this.canvas._objects.forEach((object) => {
        if (object.layerId) {
          if (object.layerId == id) obj = object;
        }
      });
      if (!obj) return false;
      this.canvas.setActiveObject(obj);
      this.canvas.requestRenderAll();
    });

    let isScaling = false;
    this.canvas.on("object:scaling", () => {
      isScaling = true;
    });
    this.canvas.on("mouse:up", function () {
      if (isScaling) {
        isScaling = false;
        self.canvas.save();
      }
    });

    let openTextPickerView = "block";
    let openPickerView = "block";

    let pickerDefaultColor = "#fff";
    let colorPicker = new iro.ColorPicker("#open_picker", {
      display: openPickerView,
      width: 210,
      marginTop: 20,
      color: pickerDefaultColor,
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "hue",
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "alpha",
          },
        },
      ],
    });

    colorPicker.on("input:end", () => {
      updatePreview();
      this.canvas.save();
    });

    const changePickerColors = (element) => {
      const color = Array.isArray(element.get("fill").colorStops)
        ? rgbToHex(element.get("fill").colorStops[0].color)
        : element.get("fill");
      colorPicker.color.set(color);
    };

    const updatePickerHandler = (element) => {
      return () => changePickerColors(element);
    };

    const onSelect = () => {
      this.hideCanvasGuides();

      const activeObject = this.canvas.getActiveObject(),
        obj = activeObject;
      this.activeLayerIndex = this.canvas.getObjects().indexOf(activeObject);

      !activeObject.text &&
        activeObject.on("mousedown", updatePickerHandler(activeObject));

      if (activeObject) {
        if (activeObject.text) {
          querySelect('.nav-item[data-name="text"]').dispatchEvent(new Event("click"));

          this.activeSection = "text";
          const hasShadow = !!activeObject?.shadow?.blur;

          querySelect("#drop-shadow").checked = hasShadow;

          if (!hasShadow) {
            querySelect("#shadow-adjust").style.display = "none";
            querySelect("#shadow-blur").style.display = "none";
            querySelect("#shadow-offsetX").style.display = "none";
            querySelect("#shadow-offsetY").style.display = "none";
          } else {
            querySelect("#shadow-adjust").style.display = "block";
            querySelect("#shadow-blur").style.display = "block";
            querySelect("#shadow-offsetX").style.display = "block";
            querySelect("#shadow-offsetY").style.display = "block";
          }

          if (hasShadow) {
            let { offsetX, offsetY, blur } = activeObject.shadow;
            querySelect("#shadow-blur-slider").value = blur;
            querySelect("#shadow-offsetX-slider").value = offsetX;
            querySelect("#shadow-offsetY-slider").value = offsetY;
            this.shadowBlur = blur;
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
          }
        } else {

          this.activeSection = "text";

          querySelect('.nav-item[data-name="logo"]').dispatchEvent(new Event("click"));

          if (activeObject.shadow) {
            let { offsetX, offsetY, blur } = activeObject.shadow;
            querySelect("#logo-shadow-blur-slider").value = blur;
            querySelect("#logo-shadow-offsetX-slider").value = offsetX;
            querySelect("#logo-shadow-offsetY-slider").value = offsetY;
            this.logoShadowOffsetX = offsetX;
            this.logoShadowOffsetY = offsetY;
            this.logoShadowBlur = blur;
          }
        }

        if (activeObject.type === "curved-text") {
          let percentage = activeObject.percentage;

          if (percentage >= 90) percentage = 100;
          if (percentage <= -90) percentage = 0;

          querySelect("#curve-text").value = (percentage * 3.6).toFixed(0);
          querySelect("#text-curve-range").value =
            getRangeFromPercentage(percentage);
        } else {
          querySelect("#curve-text").value = 0;
          querySelect("#text-curve-range").value = 2500;
        }

        const layers = querySelectAll(".layer-container");
        layers.forEach((layer, idx) => {
          const layerImg = layer.querySelector(".layer-img");
          const layerSpan = layer.querySelector(".layer-span");

          let fillColor;
          const color = activeObject.get("fill");
          if (typeof color === "object") {
            fillColor = color.colorStops[0].color;
          } else if (color && color.includes("#")) {
            fillColor = color;
          } else {
            const newColor = rgbaToHex(color);
            fillColor = newColor;
          }

          colorPicker.color.set(fillColor);
          querySelect("#HEX").value = fillColor;

          let rgbValue = hexToRgb(fillColor);
          let rgbValues = rgbValue.match(/\d+/g);

          if (rgbValues && rgbValues.length === 3) {
            querySelect("#R").value = rgbValues[0];
            querySelect("#G").value = rgbValues[1];
            querySelect("#B").value = rgbValues[2];
          }

          let hslValue = hexToHsl(fillColor);
          let hslValues = hslValue.match(/\d+/g);

          if (hslValues && hslValues.length === 3) {
            querySelect("#H").value = hslValues[0];
            querySelect("#S").value = hslValues[1];
            querySelect("#L").value = hslValues[2];
          }
          let layerId = layer.getAttribute("data-id");

          if (layerId && obj.layerId) {
            if (layerId == obj.layerId) {
              layerSpan.scrollIntoView({ block: "center", behavior: "smooth" });
              layerImg.classList.add("selected");
              layerSpan.classList.add("selected");
            } else {
              layerImg.classList.remove("selected");
              layerSpan.classList.remove("selected");
            }
          }
        });

        let selectBoxes = {
          "font-weight-selector": "fontWeight",
          "font-style-selector": "fontStyle_",
          "text-case-select-box": "letterCase",
        };
        for (const key in selectBoxes) {
          let el = querySelect(`.${key}`);

          const value = obj[selectBoxes[key]] || obj.get(selectBoxes[key]);
          el.setAttribute("data-value", value);
          el.dispatchEvent(new Event("valueChange"));
        }

        let fontList = querySelect(".font-family-selectbox");
        const setFontFamily = (family) => {
          fontList.setAttribute("data-value", family);
          self.changeFontWeight = false;
          fontList.dispatchEvent(new Event("valueChange"));
          fontList.dispatchEvent(new Event("change"));
          self.changeFontWeight = true;

          fontList.querySelector(".ms-list-value").innerText = family;

          let fontWeightSelector = querySelect(".font-weight-selector");
          const currentWeight = obj.get("fontWeight") || "normal";
          fontWeightSelector.setAttribute("data-value", currentWeight);
          fontWeightSelector.dispatchEvent(new Event("valueChange"));
        };

        let family = obj.get("fontFamily");
        let familyData = this.allFonts[family];

        if (familyData) {
          let { loaded, variants } = familyData;

          if (!loaded) {
            const familyWithVariants = `${family}:${variants.join(",")}`;

            WebFont.load({
              google: {
                families: [familyWithVariants],
              },
              active: function () {
                familyData.loaded = true;
                self.loadedFonts[family] = familyData;

                obj.set("fontFamily", family);
                obj.set("fontWeight", obj.get("orgFontWeight") || obj.get("fontWeight") || "normal");
                setFontFamily(family);
                self.canvas.renderAll();
              },
            });
          } else {
            obj.set("fontWeight", obj.get("orgFontWeight") || obj.get("fontWeight") || "normal");
            setFontFamily(family);
          }
        }

        querySelect("#letter-spacing-slider").value = Math.round(
          obj.charSpacing,
        );
        querySelect("#l_spacing_value").value =
          Math.round(obj.charSpacing) || 0;

        if (obj.fontSize) {
          querySelect("#font_size_title").value =
            Math.round(obj.fontSize) + "px";
          querySelect("#font_size_range").value = Math.round(obj.fontSize);
        }
      }
      this.canvas.requestRenderAll();
    };

    this.canvas.on("selection:created", onSelect);
    this.canvas.on("selection:updated", onSelect);

    let logoLayerGroup;
    const textMain = ({
      text,
      fontFamily = "ABeeZee",
      fontSize = 32,
      fill = "#000000",
    }) => {
      return new fabric.Text(text, {
        fontFamily,
        fontSize,
        fill,
        selectable: true,
        hasRotatingPoint: false,
        diameter: 500,
        left: 50,
        top: 50,
        flipped: true,
      });
    };

    var logoNameElement = textMain({ text: this.logoName });
    var sloganNameElement = textMain({ text: this.sloganName });

    querySelect("#logoMainField").addEventListener("input", (e) => {
      const value = e.target.value;
      const objects = this.canvas.getObjects().filter((i) => i.text);
      const logoIdx = 0;
      const logo = objects[logoIdx];
      logo.set("text", value);
      this.canvas.renderAll();
    });

    querySelect("#sloganNameField").addEventListener("input", (e) => {
      const value = e.target.value;
      const objects = this.canvas.getObjects().filter((i) => i.text);
      const sloganIdx = 1;
      const slogan = objects[sloganIdx];
      slogan.set("text", value);
      this.canvas.renderAll();
    });

    const getTextCase = (text) => {
      if (text === text.toUpperCase()) {
        return "Uppercase";
      } else if (text === text.toLowerCase()) {
        return "Lowercase";
      } else if (
        text ===
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      ) {
        return "Sentence Case";
      } else {
        return "Title Case";
      }
    };

    logoNameElement.on("mousedblclick", () => {
      const logoNameInput = querySelect("#logoMainField");
      if (logoNameInput) {
        logoNameInput.focus();
        logoNameInput.select();
      }
    });

    sloganNameElement.on("mousedblclick", () => {
      const sloganNameInput = document.querySelector("#sloganNameField");
      if (sloganNameInput) {
        sloganNameInput.focus();
        sloganNameInput.select();
      }
    });

    const onMouseOver = (isMouseOver, element) => {
      let color = isMouseOver ? "var(--gold-darker)" : "var(--gold)";
      element.style.background = color;
      if (!isMouseOver) {
        this.updateActiveNavbar();
      }
    };

    this.backgroundMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.backgroundMode),
    );
    this.backgroundMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.backgroundMode),
    );
    this.textMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.textMode),
    );
    this.textMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.textMode),
    );
    this.logoMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.logoMode),
    );
    this.uploadsMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.uploadsMode),
    );
    this.logoMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.logoMode),
    );
    this.previewMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.previewMode),
    );
    this.previewMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.previewMode),
    );

    this.uploadSettingsContainer.style.display = "none";
    this.backgroundSettingsContainer.style.display = "none";
    this.textMode.addEventListener("click", () => {
      this.activeNavbarSetting = "text";
      this.updateActiveNavbar();
      this.logoSettingsContainer.style.display = "none";
      this.textSettingsContainer.style.display = "grid";
      this.backgroundSettingsContainer.style.display = "none";
      this.uploadSettingsContainer.style.display = "none";
      this.canvas.renderAll();
    });

    this.logoMode.addEventListener("click", () => {
      this.activeNavbarSetting = "logo";
      this.updateActiveNavbar();
      this.logoSettingsContainer.style.display = "grid";
      this.textSettingsContainer.style.display = "none";
      this.backgroundSettingsContainer.style.display = "none";
      this.uploadSettingsContainer.style.display = "none";
      this.canvas.renderAll();
    });

    this.backgroundMode.addEventListener("click", () => {
      this.backgroundSettingsContainer.style.display = "none";
      this.logoSettingsContainer.style.display = "none";
      this.textSettingsContainer.style.display = "none";
      this.backgroundSettingsContainer.style.display = "grid";
      this.uploadSettingsContainer.style.display = "none";
      this.activeNavbarSetting = "background";
      this.updateActiveNavbar();
    });

    this.uploadsMode.addEventListener("click", () => {
      querySelect("#upload-file").click();
    });

    this.previewMode.addEventListener("click", () => {
      this.transparentLoader();
      const bgColor = this.canvas.get("backgroundColor");

      const timeout = 1000;
      setTimeout(() => {
        if (bgColor === this.canvasBG) {
          this.canvas.setBackgroundColor(
            null,
            this.canvas.renderAll.bind(this.canvas),
          );
        }

        querySelect(".preview-modal-bg").style.display = "block";
        const logo = this.canvas.toDataURL({
          format: "png",
          multiplier: 3,
        });

        if (logo) {
          querySelect("#fixed_preview").src = logo;
          querySelect("#loader_font").style.display = "none";
        }
      }, timeout);
    });

    this.letterSpacingSlider.addEventListener("input", (e) => {
      this.letterSpacing = e.target.value;
      const active = this.canvas.getActiveObject();

      if (active.type == "curved-text") {
        active.set("charSpacing", parseInt(this.letterSpacing));

        let letterSpacing = (parseInt(this.letterSpacing) / 100) * 3;
        letterSpacing = Math.round(letterSpacing);
        if (letterSpacing < -1) letterSpacing = -1;
        active.set("_cachedCanvas", null);
        active.set("kerning", parseInt(letterSpacing));
        querySelect("#l_spacing_value").value = Math.round(e.target.value / 10);

        this.canvas.requestRenderAll();
        return false;
      }

      const currCoordinate = active.getCenterPoint();

      active.set("charSpacing", this.letterSpacing);
      querySelect("#l_spacing_value").value = Math.round(e.target.value / 10);

      active.setPositionByOrigin(
        new fabric.Point(currCoordinate.x, currCoordinate.y),
        "center",
        "center",
      );
      active.setCoords();
      this.canvas.requestRenderAll();
    });

    document
      .querySelector("#l_spacing_value")
      .addEventListener("change", function (e) {
        let value = e.target.value;
        querySelect("#letter-spacing-slider").value = Math.round(value * 10);
        querySelect("#letter-spacing-slider").dispatchEvent(new Event("input"));
      });

    querySelect("#letter-spacing-up").addEventListener("click", () => {
      let value = parseInt(querySelect("#letter-spacing-slider").value);
      value += 10;
      querySelect("#letter-spacing-slider").value = Math.round(value);
      querySelect("#letter-spacing-slider").dispatchEvent(new Event("input"));
    });

    querySelect("#letter-spacing-down").addEventListener("click", () => {
      let value = parseInt(querySelect("#letter-spacing-slider").value);
      value -= 10;
      querySelect("#letter-spacing-slider").value = Math.round(value);
      querySelect("#letter-spacing-slider").dispatchEvent(new Event("input"));
    });

    this.letterSpacingSlider.addEventListener("change", (e) => {
      updatePreview();
      this.canvas.save();
    });

    querySelect("#shadow-blur-slider")?.addEventListener("input", (e) => {
      const active = this.canvas.getActiveObjects(),
        self = this;
      querySelect("#shadow_blur_title").innerText = ` :${e.target.value}px`;
      this.shadowBlur = e.target.value;

      active.forEach((item) => {
        if (!item.text) return true;

        item.set("shadow", {
          offsetX: self.shadowOffsetX,
          offsetY: self.shadowOffsetY,
          blur: self.shadowBlur,
        });
      });
      this.canvas.requestRenderAll();
    });

    querySelect("#shadow-blur-slider")?.addEventListener("change", () => {
      this.canvas.save();
    });

    querySelect("#logo-shadow-blur-slider").addEventListener("input", (e) => {
      this.logoShadowBlur = e.target.value;
      const active = this.canvas.getActiveObjects();
      querySelect("#logo-shadow_blur_title").innerText =
        ` :${e.target.value}px`;
      active.forEach((item) => {
        if (item._objects) {
          item._objects.forEach((i) => {
            i.set("shadow", {
              offsetX: this.logoShadowOffsetX,
              offsetY: this.logoShadowOffsetY,
              blur: parseInt(this.logoShadowBlur),
            });
          });
        } else
          item.set("shadow", {
            offsetX: this.logoShadowOffsetX,
            offsetY: this.logoShadowOffsetY,
            blur: parseInt(this.logoShadowBlur),
          });
      });
      this.canvas.requestRenderAll();
    });

    querySelect("#logo-shadow-blur-slider").addEventListener("change", (e) => {
      updatePreview();
      this.canvas.save();
    });

    this.shadowOffsetXSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      this.shadowOffsetX = val;
      querySelect("#offset_x_title").innerText = ` :${val}px`;
      const active = this.canvas.getActiveObjects();

      let self = this;
      active.forEach((item) => {
        if (!item.text) return true;

        item.set("shadow", {
          offsetX: self.shadowOffsetX,
          offsetY: self.shadowOffsetY,
          blur: self.shadowBlur,
        });
      });
      this.canvas.requestRenderAll();
    });

    this.logoShadowOffsetXSlider.addEventListener("input", (e) => {
      this.logoShadowOffsetX = e.target.value;

      querySelect("#logo-shadow_offsetX").innerText = ` :${e.target.value}px`;
      const active = this.canvas.getActiveObjects();
      active.forEach((item) => {
        if (item._objects) {
          item._objects.forEach((i) => {
            i.set("shadow", {
              offsetX: this.logoShadowOffsetX,
              offsetY: this.logoShadowOffsetY,
              blur: this.logoShadowBlur,
            });
          });
        } else
          item.set("shadow", {
            offsetX: this.logoShadowOffsetX,
            offsetY: this.logoShadowOffsetY,
            blur: this.logoShadowBlur,
          });
      });
      this.canvas.requestRenderAll();
    });

    this.shadowOffsetXSlider.addEventListener("change", () => {
      this.canvas.save();
    });
    this.logoShadowOffsetXSlider.addEventListener("change", () => {
      this.canvas.save();
    });

    this.logoShadowOffsetXSlider.addEventListener("change", () => {
      updatePreview();
      this.canvas.save();
    });

    this.shadowOffsetYSlider.addEventListener("change", () => {
      updatePreview();
      this.canvas.save();
    });

    this.shadowOffsetYSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      this.shadowOffsetY = val;
      querySelect("#offset_y_title").innerText = ` :${val}px`;
      const active = this.canvas.getActiveObjects();

      let self = this;
      active.forEach((item) => {
        if (!item.text) return true;

        item.set("shadow", {
          offsetX: self.shadowOffsetX,
          offsetY: self.shadowOffsetY,
          blur: self.shadowBlur,
        });
      });
      this.canvas.requestRenderAll();
    });

    this.logoShadowOffsetYSlider.addEventListener("input", (e) => {
      this.logoShadowOffsetY = e.target.value;
      querySelect("#logo-shadow_offsetY").innerText = ` :${e.target.value}px`;
      const active = this.canvas.getActiveObjects();
      active.forEach((item) => {
        if (item._objects) {
          item._objects.forEach((i) => {
            i.set("shadow", {
              offsetX: this.logoShadowOffsetX,
              offsetY: this.logoShadowOffsetY,
              blur: this.logoShadowBlur,
            });
          });
        } else
          item.set("shadow", {
            offsetX: this.logoShadowOffsetX,
            offsetY: this.logoShadowOffsetY,
            blur: this.logoShadowBlur,
          });
      });
      this.canvas.requestRenderAll();
    });

    this.logoShadowOffsetYSlider.addEventListener("change", () => {
      updatePreview();
      this.canvas.save();
    });

    let uploadLayerCounter = 0;
    querySelect("#upload-file").addEventListener("input", (e) => {
      localDirFile = e.target.files[0];
      localDirFiles = [];
      localDirFiles.push(localDirFile);

      localDirFiles.forEach((file) => {
        let url = URL.createObjectURL(file),
          extension = file.type;
        if (extension.includes("svg")) {
          const decodedSrc = decodeURIComponent(url);
          var canvas = this.canvas;

          fabric.loadSVGFromURL(decodedSrc, (objects, options) => {
            const img = fabric.util.groupSVGElements(objects, options);

            var reader = new FileReader();
            reader.onloadend = function () {
              img.set("dataUrl", reader.result);
              img.set("layerType", "image");
              img.set("ext", "svg");
              img.scaleToWidth(100);
              img.set({ left: img.left + 100, layerType: "svg" });
              img.set("id", "upload_external_layer_" + layerCounter);

              canvas.add(img);
              canvas.setActiveObject(img);
              canvas.viewportCenterObjectV(img);
              canvas.requestRenderAll();
              uploadLayerCounter++;
            };

            if (localDirFile) reader.readAsDataURL(localDirFile);
          });
        } else {
          toastNotification("Please select an SVG file");
        }
      });
      e.target.value = "";
    });

    const handleCanvasEvent = () => {
      updatePreview();
    };

    this.canvas.on("object:added", handleCanvasEvent);
    this.canvas.on("object:removed", handleCanvasEvent);
    this.canvas.on("object:modified", handleCanvasEvent);

    let localDirFile = null;
    let localDirFiles = null;
    document.onkeydown = (event) => {
      if (event.target.tagName === "INPUT") return;
      if (event.key === "Delete") {
        document
          .querySelector("#removeElement")
          .dispatchEvent(new Event("click"));
      }
    };

    document.onmouseup = () => {
      this.hideCanvasGuides();
    };

    const colorPickerText = new iro.ColorPicker("#open_picker_text", {
      display: openTextPickerView,
      width: 210,
      marginTop: 20,
      color: pickerDefaultColor,
      transparency: false,
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "hue",
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "alpha",
          },
        },
      ],
    });

    const applyEventListners = () => {
      logoNameElement.on("mousedown", async (e) => {
        e.e.preventDefault();
        const weight = logoNameElement.get("fontWeight");
        const family = logoNameElement.get("fontFamily");
        const familyWithWeight = `${family}:${weight}`;

        await new Promise((resolve, reject) => {
          WebFont.load({
            google: {
              families: [familyWithWeight],
            },
            active: resolve,
            inactive: reject,
          });
        });

        e.target.set("fontWeight", weight);
        this.canvas.renderAll();

        this.textSelectorValue = "LogoName";

        querySelect("#font_style_tag").innerText = toTitleCase(
          logoNameElement.get("fontStyle"),
        );

        querySelect("#font_case").innerText = toTitleCase(
          getTextCase(logoNameElement.text),
        );

        const hasShadow = !!logoNameElement?.shadow?.blur;

        querySelect("#drop-shadow").checked = hasShadow;
        isShadowAdjust = hasShadow;

        if (!hasShadow) {
          querySelect("#shadow-adjust").style.display = "none";
          querySelect("#shadow-blur").style.display = "none";
          querySelect("#shadow-offsetX").style.display = "none";
          querySelect("#shadow-offsetY").style.display = "none";
        } else {
          querySelect("#shadow-adjust").style.display = "block";
          querySelect("#shadow-blur").style.display = "block";
          querySelect("#shadow-offsetX").style.display = "block";
          querySelect("#shadow-offsetY").style.display = "block";
        }

        const charSpacing = logoNameElement.get("charSpacing");
        querySelect("#l_spacing_value").value =
          Math.round(charSpacing / 10) || 0;

        let fillColor;
        const color = e.target.fill;

        if (typeof color === "object") {
          fillColor = color.colorStops[0].color;
        } else if (color && color.includes("#")) {
          fillColor = color;
        } else {
          const newColor = rgbaToHex(color);
          fillColor = newColor;
        }

        colorPickerText.color.set(fillColor);
        querySelect("#HEX2").value = fillColor;

        let rgbValue = hexToRgb(fillColor);
        let rgbValues = rgbValue.match(/\d+/g);

        if (rgbValues && rgbValues.length === 3) {
          querySelect("#R2").value = rgbValues[0];
          querySelect("#G2").value = rgbValues[1];
          querySelect("#B2").value = rgbValues[2];
        }

        let hslValue = hexToHsl(fillColor);
        let hslValues = hslValue.match(/\d+/g);

        if (hslValues && hslValues.length === 3) {
          querySelect("#H2").value = hslValues[0];
          querySelect("#S2").value = hslValues[1];
          querySelect("#L2").value = hslValues[2];
        }

        if (logoNameElement.shadow) {
          const blur = logoNameElement?.shadow?.blur;
          const offsetX = logoNameElement?.shadow?.offsetX;
          const offsetY = logoNameElement?.shadow?.offsetY;

          querySelect("#shadow_blur_title").innerText = blur
            ? ` :${blur}px`
            : " :0px";
          querySelect("#shadow-blur-slider").value = blur;
          querySelect("#offset_x_title").innerText = offsetX
            ? ` :${offsetX}px`
            : " :0px";
          querySelect("#shadow-offsetX-slider").value = offsetX;
          querySelect("#offset_y_title").innerText = offsetY
            ? ` :${offsetY}px`
            : " 0px";
          querySelect("#shadow-offsetY-slider").value = offsetY;
        }
        this.canvas.requestRenderAll();
        this.activeNavbarSetting = "text";
        this.updateActiveNavbar();

        logoNameElement.on("mousedblclick", () => {
          const logoNameInput = document.getElementById("logoMainField");
          if (logoNameInput) {
            logoNameInput.focus();
          }
        });

        sloganNameElement.on("mousedblclick", () => {
          const sloganNameInput = document
            .getElementById("sloganNameField")
            .focus();
          if (sloganNameInput) {
            sloganNameElement.focus();
          }
        });
      });

      sloganNameElement.on("mousedown", (e) => {
        e.e.preventDefault();
        this.textSelectorValue = "SloganName";

        querySelect("#font_style_tag").innerText = toTitleCase(
          sloganNameElement.get("fontStyle"),
        );
        querySelect("#font_case").innerText = toTitleCase(
          getTextCase(sloganNameElement.text),
        );

        const hasShadow = !!sloganNameElement?.shadow?.blur;

        querySelect("#drop-shadow").checked = hasShadow;
        isShadowAdjust = hasShadow;
        if (!hasShadow) {
          querySelect("#shadow-adjust").style.display = "none";
          querySelect("#shadow-blur").style.display = "none";
          querySelect("#shadow-offsetX").style.display = "none";
          querySelect("#shadow-offsetY").style.display = "none";
        } else {
          querySelect("#shadow-adjust").style.display = "block";
          querySelect("#shadow-blur").style.display = "block";
          querySelect("#shadow-offsetX").style.display = "block";
          querySelect("#shadow-offsetY").style.display = "block";
        }

        const charSpacing = sloganNameElement.get("charSpacing");
        querySelect("#l_spacing_value").value = Math.round(charSpacing / 10);

        let fillColor;
        const color = e.target.fill;

        if (typeof color === "object") {
          fillColor = color.colorStops[0].color;
        } else if (color && color.includes("#")) {
          fillColor = color;
        } else {
          const newColor = rgbaToHex(color);
          fillColor = newColor;
        }

        colorPickerText.color.set(fillColor);
        querySelect("#HEX2").value = fillColor;

        let rgbValue = hexToRgb(fillColor);
        let rgbValues = rgbValue.match(/\d+/g);

        if (rgbValues && rgbValues.length === 3) {
          querySelect("#R2").value = rgbValues[0];
          querySelect("#G2").value = rgbValues[1];
          querySelect("#B2").value = rgbValues[2];
        }

        let hslValue = hexToHsl(fillColor);
        let hslValues = hslValue.match(/\d+/g);

        if (hslValues && hslValues.length === 3) {
          querySelect("#H2").value = hslValues[0];
          querySelect("#S2").value = hslValues[1];
          querySelect("#L2").value = hslValues[2];
        }

        if (sloganNameElement.shadow) {
          const blur = sloganNameElement?.shadow?.blur;
          const offsetX = sloganNameElement?.shadow?.offsetX;
          const offsetY = sloganNameElement?.shadow?.offsetY;

          querySelect("#shadow_blur_title").innerText = blur
            ? ` :${blur}px`
            : " :0px";
          querySelect("#shadow-blur-slider").value = blur;
          querySelect("#offset_x_title").innerText = offsetX
            ? ` :${offsetX}px`
            : " :0px";
          querySelect("#shadow-offsetX-slider").value = offsetX;
          querySelect("#offset_y_title").innerText = offsetY
            ? ` :${offsetY}px`
            : " 0px";
          querySelect("#shadow-offsetY-slider").value = offsetY;
        }

        this.canvas.requestRenderAll();
        this.activeNavbarSetting = "text";
        this.updateActiveNavbar();
      });
    };
    applyEventListners();

    document.addEventListener("keydown", async (e) => {
      let isCtrlZ = e.ctrlKey && e.key === "z",
        isCtrlY = e.ctrlKey && e.key === "y";
      let isUndoRedoActive = false;

      if (isCtrlZ && !isUndoRedoActive) {
        await this.canvasHistory.undoChanges();
        isUndoRedoActive = true;
      }

      if (isCtrlY && !isUndoRedoActive) {
        await this.canvasHistory.redoChanges();
        isUndoRedoActive = true;
      }
    });
    querySelect("#font_size_range").addEventListener("change", () => {
      updatePreview();
      this.canvas.save();
    });

    querySelect("#font_size_range").addEventListener("input", (event) => {
      const textSize = event.target.value;
      if (textSize > 0) {
        querySelect("#font_size_title").value = `${Math.round(textSize)}px`;
        const active = this.canvas.getActiveObject();

        const fontSize = textSize;
        if (active.type == "curved-text") {
          active.set("_cachedCanvas", null);
          if (fontSize < 5) return false;
          active.set("fontSize", fontSize);
        } else active.set("fontSize", fontSize);

        this.canvas.requestRenderAll();
      }
    });

    querySelect("#text-curve-range").addEventListener("input", (e) => {
      let value = e.target.value;

      initCurveText();
      let percentage_ =
        value >= 2500 ? (value - 2500) / 25 : -((2500 - value) / 25);
      let angle = (percentage_ * 3.6).toFixed(0);

      querySelect("#curve-text").value = angle;
      this.canvas.requestRenderAll();
    });

    querySelect("#text-curve-up").addEventListener("click", () => {
      let input = querySelect("#curve-text"),
        value = parseInt(input.value) || 0;
      value += 5;

      input.value = value;
      querySelect("#curve-text").dispatchEvent(new Event("change"));
    });

    querySelect("#text-curve-down").addEventListener("click", () => {
      let input = querySelect("#curve-text"),
        value = parseInt(input.value) || 0;

      value -= 5;
      input.value = value;
      querySelect("#curve-text").dispatchEvent(new Event("change"));
    });

    querySelect("#curve-text").addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp") {
        querySelect("#text-curve-up").dispatchEvent(new Event("click"));
      } else if (e.key == "ArrowDown") {
        querySelect("#text-curve-down").dispatchEvent(new Event("click"));
      }
    });

    querySelect("#l_spacing_value").addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp") {
        querySelect("#letter-spacing-up").dispatchEvent(new Event("click"));
      } else if (e.key == "ArrowDown") {
        querySelect("#letter-spacing-down").dispatchEvent(new Event("click"));
      }
    });

    const addCurveText = (obj, diameter, percentage = null) => {
      const props = obj.__dimensionAffectingProps;
      const options = {
        ...props,
        left: obj.left,
        top: obj.top,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        diameter: parseInt(diameter),
        fill: obj.fill,
        shadow: obj.shadow,
        percentage,
      };

      let letterSpacing = (parseInt(obj.charSpacing) / 100) * 3;
      letterSpacing = letterSpacing.toFixed(1);
      if (letterSpacing < -1) letterSpacing = -1;

      options.kerning = parseInt(letterSpacing);

      const curvedText = new fabric.CurvedText(obj.text, options);

      let index = this.canvas.getObjects().indexOf(obj);

      this.canvas.remove(obj);
      this.canvas.add(curvedText);

      if (
        curvedText.text
          .toLowerCase()
          .includes(querySelect("#logoMainField").value.toLowerCase())
      ) {
        logoNameElement = curvedText;
      } else if (
        curvedText.text
          .toLowerCase()
          .includes(querySelect("#sloganNameField").value.toLowerCase())
      ) {
        sloganNameElement = curvedText;
      }

      applyEventListners();

      curvedText.moveTo(index);
      this.canvas.setActiveObject(curvedText);
      this.canvas.requestRenderAll();
    };

    const initCurveText = () => {
      let obj = this.canvas.getActiveObject();
      if (!obj) return;

      let value = querySelect("#text-curve-range").value;

      let percentage =
        value >= 2500 ? (value - 2500) / 25 : -((2500 - value) / 25);

      percentage = percentage.toFixed(0);
      if (percentage == -0 || percentage == "-0") percentage = 0;

      if (percentage > 90) {
        percentage = 90;
        value = getRangeFromPercentage(percentage);
      }

      if (percentage < -90) {
        percentage = -90;
        value = getRangeFromPercentage(percentage);
      }

      const isFlipped = percentage < 0;
      const hasCurveApply = parseInt(percentage) != 0;

      if (value >= 2500) value = 2500 - (value - 2500);

      const isCurvedText = obj.type === "curved-text";

      if (hasCurveApply && !isCurvedText) {
        addCurveText(obj, value, percentage);
      } else if (!hasCurveApply) {
        let itext = true;
        if (obj.text == querySelect("#logoMainField").value) {
          itext = false;
        } else if (obj.text == querySelect("#sloganNameField").value) {
          itext = false;
        }

        const text = new fabric[itext ? "IText" : "Text"](obj.text, {
          ...obj,
          type: "text",
          percentage,
        });
        let index = this.canvas.getObjects().indexOf(obj);

        this.canvas.remove(obj);
        this.canvas.add(text);

        if (text.text == querySelect("#logoMainField").value) {
          logoNameElement = text;
        } else if (text.text == querySelect("#sloganNameField").value) {
          sloganNameElement = text;
        }
        applyEventListners();

        text.moveTo(index);
        this.canvas.setActiveObject(text);
        this.canvas.save();
      } else if (hasCurveApply && isCurvedText) {
        obj.set("_cachedCanvas", null);
        obj.set("diameter", value);
        obj.set("flipped", isFlipped);
        obj.set("percentage", percentage);
        obj._updateObj("scaleX", obj.scaleX);
        obj._updateObj("scaleY", obj.scaleY);
      }
      this.canvas.renderAll();
      const angle = (percentage * 3.6).toFixed(0);
      return angle;
    };

    const getRangeFromPercentage = (percentage) => {
      percentage = parseInt(percentage) || 0;
      let rangeValue = 2500;
      if (percentage > 0) rangeValue = 2500 + percentage * 25;
      else if (percentage < 0) rangeValue = 2500 - Math.abs(percentage) * 25;

      return rangeValue;
    };

    querySelect("#font_size_title").addEventListener("change", (event) => {
      let text = event.target.value;
      text = parseFloat(text).toFixed(1);
      const fontSize = Number(text.split("px")[0]);
      querySelect("#font_size_range").value = fontSize;

      updatePreview();
      this.canvas.save();
      this.canvas.requestRenderAll();
      querySelect("#font_size_title").value = Math.round(fontSize) + "px";
    });

    querySelect("#font_size_title").addEventListener("input", (event) => {
      const text = event.target.value;
      const fontSize = Number(text.split("px")[0]);
      const active = this.canvas.getActiveObject();
      active.fontSize = fontSize;
      querySelect("#font_size_range").value = Math.round(fontSize);

      this.canvas.requestRenderAll();
    });

    const arrowFontResizer = (type = "increment") => {
      const active = this.canvas.getActiveObject();
      let fontSize = parseInt(active.fontSize);
      if (fontSize <= 1) {
        fontSize = 2;
      }
      const increment = fontSize + 1;
      const decrement = fontSize - 1;

      const fontResizer =
        type === "increment"
          ? (active.fontSize = increment)
          : (active.fontSize = decrement);
      querySelect("#font_size_range").value = fontResizer;
      querySelect("#font_size_title").value = Math.round(fontResizer) + "px";
      this.canvas.requestRenderAll();
      updatePreview();
    };

    querySelect("#font_size_up").addEventListener(
      "click",
      () => void arrowFontResizer("increment"),
    );
    querySelect("#font_size_down").addEventListener(
      "click",
      () => void arrowFontResizer("decrement"),
    );

    querySelect("#font_size_title").addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        let curr = Number(event.target.value.split("px")[0]);
        event.target.value = curr + 1 + "px";
      } else if (event.key === "ArrowDown") {
        let curr = Number(event.target.value.split("px")[0]);
        event.target.value = curr - 1 + "px";
      }

      const active = this.canvas.getActiveObject();
      active.fontSize = Number(event.target.value.split("px")[0]);

      this.canvas.requestRenderAll();
    });

    this.zoomSlider.addEventListener("input", () => {
      let imgZoom = this.zoomSlider.value * 2;
      if (imgZoom <= 2) {
        imgZoom -= 2.5;
      } else {
        imgZoom += 2.5;
      }
      document.getElementById("magnifier_img").style.scale = imgZoom;
      document.getElementById("magnifier_img").style.rotate = "180deg";
      this.canvas.zoomToPoint(
        new fabric.Point(this.canvas.width / 2, this.canvas.height / 2),
        1 / this.zoomSlider.value,
      );
      this.canvas.requestRenderAll();
    });

    querySelect("#duplicate-element").addEventListener("click", () => {
      let active = this.canvas.getActiveObject()
      let layerElement = null;
      if (active.layerId)
        layerElement = document.querySelector(
          `.layer-container[data-id="${active.layerId}"]`,
        );

      if (active?.id.includes("external_layer_") && !active.text) {
        let cloned = active.toJSON([
          "itemId",
          "id",
          "category",
          "cacheWidth",
          "cacheHeight",
        ]);
        cloned.top += 10;
        cloned.left += 10;
        loadExternalLayers(JSON.stringify([cloned]));
        return false;
      }

      if (active._objects) {
        active.clone((clonedGroup) => {
          clonedGroup._objects.forEach((object, i) => {
            if (object.text) return true;
            this.canvas.add(object);
            layerElement = document.querySelector(
              `.layer-container[data-id="${active._objects[i].layerId}"]`,
            );

            const layerSection = new CreateLayerSection(this.layers);
            let idx = Array.from(this.layers.childNodes).filter(
              (i) => i.style.display !== "none",
            );
            layerSection.create(object, idx.length, layerElement);
            refreshLayerNames();
          });
          this.canvas.centerObject(clonedGroup);
          clonedGroup.set("top", 100);
          clonedGroup.set("left", 100);
          this.canvas.setActiveObject(clonedGroup);
          this.canvas.discardActiveObject();
          this.canvas.requestRenderAll();
          this.canvas.save();
        });
      } else {
        active.clone((cloned) => {
          if (cloned.text) return true;
          cloned.set("duplicate", true);
          this.canvas.add(cloned);
          cloned.top += 10;
          cloned.left += 10;

          const layerSection = new CreateLayerSection(this.layers);
          let idx = Array.from(this.layers.childNodes).filter(
            (i) => i.style.display !== "none",
          );
          layerSection.create(cloned, idx.length, layerElement);
          refreshLayerNames();
          this.canvas.save();
        });
      }
      this.canvas.requestRenderAll();
    });

    querySelect("#eyeElement").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject();
      let visibilty = Boolean(activeObj?.get("visible"));
      visibilty = !visibilty;
      activeObj.set("visible", visibilty);
      this.canvas.requestRenderAll();
      updatePreview();
      if (activeObj) this.canvas.save();
      const eyeElement = querySelect("#eyeElement");
      const specificLabels = querySelectAll(".specific-setting-label");
      const firstSpecificLabel = specificLabels[1];

      const eyeColor = activeObj.visible
        ? "var(--gray-lighter)"
        : "var(--gold)";
      const labelOpacity = activeObj.visible ? 0 : 1;
      const labelColor = eyeColor;

      eyeElement.style.color = eyeColor;
      firstSpecificLabel.style.opacity = labelOpacity;
      firstSpecificLabel.style.color = labelColor;
    });

    querySelect("#removeElement").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject(),
        self = this;
      if (activeObj) {
        if (activeObj._objects && activeObj._objects.length) {
          activeObj._objects.forEach((obj) => {
            self.canvas.remove(obj);

            if (obj.layerId) {
              let layerEl = querySelect(
                `.layer-container[data-id="${obj.layerId}"]`,
              );
              layerEl.style.display = "none";
            }
          });
        }
        this.canvas.remove(activeObj);
        this.canvas.save();
        this.canvas.renderAll();

        if (activeObj.layerId) {
          let layerEl = querySelect(
            `.layer-container[data-id="${activeObj.layerId}"]`,
          );
          layerEl.style.display = "none";
        }
        refreshLayerNames();
      }
      setTimeout(() => {
        updatePreview();
      }, 100);
    });

    querySelect("#bringDownElement").addEventListener("click", () => {
      const selectedObject = this.canvas.getActiveObject();
      this.canvas.sendBackwards(selectedObject);
      this.canvas.setActiveObject(selectedObject);
      this.canvas.requestRenderAll();
      this.canvas.save();
    });

    querySelect("#bringUpElement").addEventListener("click", () => {
      const selectedObject = this.canvas.getActiveObject();
      this.canvas.bringForward(selectedObject);
      this.canvas.setActiveObject(selectedObject);
      this.canvas.requestRenderAll();
      this.canvas.save();
    });

    querySelect("#copyElement2").addEventListener("click", () => {
      const obj = this.canvas.getActiveObject();
      if (!obj) return false;
      let save = true;

      if (obj._objects) {
        obj.clone((cloned) => {
          cloned.getObjects().forEach((obj) => {
            let text = obj.text;

            if (!obj.id?.includes("external_layer_")) {
              if (text == querySelect("#logoMainField").value) {
                save = false;
                return toastNotification(
                  "Logo Name or Slogan can not be duplicated",
                );
              } else save = true;

              if (text == querySelect("#sloganNameField").value) {
                save = false;
                return toastNotification(
                  "Logo Name or Slogan can not be duplicated",
                );
              } else save = true;
            }

            this.canvas.add(obj);
            obj.top += 10;
            obj.left += 10;
          });
        });
      } else
        obj.clone((cloned) => {
          let text = cloned.text;

          if (!cloned.id?.includes("external_layer_")) {
            if (text == querySelect("#logoMainField").value) {
              save = false;
              return toastNotification(
                "Logo Name or Slogan can not be duplicated",
              );
            }
            if (text == querySelect("#sloganNameField").value) {
              save = false;
              return toastNotification(
                "Logo Name or Slogan can not be duplicated",
              );
            }
          }

          this.canvas.add(cloned);
          cloned.top += 10;
          cloned.left += 10;
        });

      this.canvas.renderAll();
      updatePreview();
      if (obj && save) this.canvas.save();
    });

    querySelect("#eyeElement2").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject();
      let visibilty = Boolean(activeObj.get("visible"));
      visibilty = !visibilty;
      activeObj.set("visible", visibilty);
      this.canvas.requestRenderAll();
      updatePreview();
      if (activeObj) this.canvas.save();
    });

    querySelect("#removeElement2").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject(),
        self = this;
      if (activeObj) {
        this.canvas.save();
        if (activeObj._objects && activeObj._objects.length) {
          activeObj._objects.forEach((obj) => {
            self.canvas.remove(obj);
          });
        }

        this.canvas.remove(activeObj);
        this.canvas.save();
        this.canvas.requestRenderAll();
      }
    });

    querySelect("#bringDownElement2").addEventListener("click", () => {
      const selectedObject = this.canvas.getActiveObject();
      this.canvas.sendToBack(selectedObject);
      this.canvas.requestRenderAll();
      updatePreview();

      if (selectedObject) this.canvas.save();
    });

    querySelect("#bringUpElement2").addEventListener("click", () => {
      const selectedObject = this.canvas.getActiveObject();
      this.canvas.sendToFront(selectedObject);
      this.canvas.requestRenderAll();
      updatePreview();
      if (selectedObject) this.canvas.save();
    });

    querySelect("#eyeElement-uploads").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject();
      let visibilty = activeObj.visible;
      visibilty = !visibilty;
      activeObj.set("visible", visibilty);
      this.canvas.requestRenderAll();
      if (activeObj) this.canvas.save();
    });

    querySelect("#duplicate-element-uploads").addEventListener("click", () => {
      this.canvas.getActiveObject().clone((cloned) => {
        this.canvas.add(cloned);
        this.canvas.centerObject(cloned);
        this.canvas.requestRenderAll();
      });
    });

    querySelect("#bringUpElement-uploads").addEventListener("click", () => {
      const selectedObject = this.canvas.getActiveObject();
      this.canvas.bringForward(selectedObject);
      this.canvas.requestRenderAll();
      if (selectedObject) this.canvas.save();
    });

    querySelect("#bringDownElement-uploads").addEventListener("click", () => {
      const selectedObject = this.canvas.getActiveObject();
      this.canvas.sendBackwards(selectedObject);
      this.canvas.requestRenderAll();
      if (selectedObject) this.canvas.save();
    });

    var bgGrad1, bgGrad2;
    const palleteComponent = querySelect("#bg-pallete");
    palleteComponent.addEventListener("colorChanged", function (c) {
      [bgGrad1, bgGrad2] = [
        c.target.querySelector("#grad-1").value,
        c.target.querySelector("#grad-2").value,
      ];
      updatePreview();
      this.canvas.save();
    });

    palleteComponent.addEventListener("colorChange", (e) => {
      const { colorMode, grad1Value, grad2Value, colorAngle, solidValue } =
        e.detail;

      let angleColor = `${colorAngle}deg`;
      let color = null;
      if (colorMode === "Linear") {
        color = new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: this.canvas.width,
            y2: this.canvas.height,
            angle: colorAngle,
          },
          colorStops: [
            { offset: 0, color: grad1Value },
            { offset: 1, color: grad2Value },
          ],
        });
      } else if (colorMode === "None") {
        this.canvas.setBackgroundColor(
          "#eeeeee",
          this.canvas.renderAll.bind(this.canvas),
        );
        this.canvas.requestRenderAll();
      } else {
        color = solidValue;
      }

      this.canvas.backgroundColor = color;
      querySelect(".color-palette-gradient").style.background =
        `linear-gradient(${angleColor}, ${grad1Value}, ${grad2Value})`;

      const rect = new fabric.Rect({
        left: 150,
        top: 100,
        fill: color,
        width: 150,
        height: 250,
      });

      this.canvas.add(rect);
      rect.center();
      this.canvas.remove(rect);

      this.canvas.requestRenderAll();
    });

    var lGrad1, lGrad2;
    const logoPalleteComponent = querySelect("#logo-pallete");
    logoPalleteComponent.addEventListener("colorChanged", (c) => {
      [lGrad1, lGrad2] = [
        c.target.querySelector("#grad-1").value,
        c.target.querySelector("#grad-2").value,
      ];
      updatePreview();
      this.canvas.save();
    });

    logoPalleteComponent.addEventListener("colorChange", (e) => {
      const selectedObject = this.canvas.getActiveObject();
      const { colorMode, grad1Value, grad2Value, solidValue } = e.detail;
      let color = null;
      if (colorMode !== "Solid") {
        color = new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: selectedObject.width,
            y2: selectedObject.height,
          },
          colorStops: [
            { offset: 0, color: grad1Value },
            { offset: 1, color: grad2Value },
          ],
        });
      } else {
        color = solidValue;
      }
      if (selectedObject && selectedObject._objects) {
        selectedObject._objects.forEach((i) => {
          i.set("fill", color);
        });
      }
      selectedObject.set("fill", color);
      this.canvas.requestRenderAll();
    });

    var tGrad1, tGrad2;
    const textPalleteComponent = querySelect("#text-pallete");
    textPalleteComponent.addEventListener("colorChanged", (c) => {
      [tGrad1, tGrad2] = [
        c.target.querySelector("#grad-1").value,
        c.target.querySelector("#grad-2").value,
      ];
      updatePreview();
      this.canvas.save();
    });

    document.addEventListener("DOMContentLoaded", () => {
      querySelect("#text-pallete .color-palette-gradient").addEventListener(
        "click",
        () => {
          const applyColor = new ApplyLinearGradient(
            this.canvas,
            tGrad1,
            tGrad2,
          );
          applyColor.setColor();
        },
      );
      querySelect("#logo-pallete .color-palette-gradient").addEventListener(
        "click",
        () => {
          const applyColor = new ApplyLinearGradient(
            this.canvas,
            lGrad1,
            lGrad2,
          );
          applyColor.setColor();
        },
      );
      querySelect("#bg-pallete .color-palette-gradient").addEventListener(
        "click",
        () => {
          const applyColor = new ApplyLinearGradient(
            this.canvas,
            bgGrad1,
            bgGrad2,
          );
          applyColor.setColor(true);
          updatePreview();
        },
      );
    });

    textPalleteComponent.addEventListener("colorChange", (e) => {
      const selectedObject = this.canvas.getActiveObject();
      const { colorMode, grad1Value, grad2Value, solidValue } = e.detail;
      this.currentGradiantColors = { grad1Value, grad2Value };

      let color = null;
      if (colorMode !== "Solid") {
        color = new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: selectedObject?.width,
            y2: selectedObject?.height,
          },
          colorStops: [
            { offset: 0, color: grad1Value },
            { offset: 1, color: grad2Value },
          ],
        });
      } else {
        color = solidValue;
      }
      selectedObject.set("fill", color);
      this.canvas.requestRenderAll();
    });

    updatePreview();

    let previewImages = ["/static/mug.png", "/static/wall.png"];
    let counter = previewImages.length - 1;

    querySelect("#right-arrow").addEventListener("click", () => {
      counter++;
      if (counter >= previewImages.length) {
        counter = 0;
      }

      const img = previewImages[counter];

      querySelect(".preview_image_wrapper").style.backgroundImage =
        "url(" + img.toString() + ")";
      querySelect(".preview_image").style.marginTop =
        counter === 0 ? "100px" : "-100px";
    });

    querySelect("#left-arrow").addEventListener("click", () => {
      if (counter === 0) {
        counter = previewImages.length - 1;
      } else {
        counter--;
      }

      const img = previewImages[counter];

      querySelect(".preview_image_wrapper").style.backgroundImage =
        "url(" + img.toString() + ")";
      querySelect(".preview_image").style.marginTop =
        counter === 0 ? "100px" : "-100px";
    });

    querySelect("#close_modal").addEventListener("click", () => {
      this.canvas.setBackgroundColor(
        this.canvasBG,
        this.canvas.renderAll.bind(this.canvas),
      );
      querySelect(".preview-modal-bg").style.display = "none";
    });

    querySelect("#overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("overlay")) {
        this.canvas.setBackgroundColor(
          "#eee",
          this.canvas.renderAll.bind(this.canvas),
        );
        querySelect(".preview-modal-bg").style.display = "none";
      }
    });

    querySelect("#icon-search-input").addEventListener("input", (event) => {
      const textInput = event.target.value;
      querySelectAll("#clip-icon").forEach((icon) => {
        const iconCategoryTitle = icon.getAttribute("data-name");
        if (
          !iconCategoryTitle.toLowerCase().includes(textInput.toLowerCase())
        ) {
          icon.style.display = "none";
        } else {
          icon.style.display = "grid";
        }
      });
    });

    querySelect(".popup").addEventListener("click", (e) => {
      if (e.target.classList.contains("popup")) {
        querySelect("#popup-parent").style.display = "none";
        querySelect("#popup-parent-icons").style.display = "none";
      }
    });

    document.getElementById("close-btn").addEventListener("click", () => {
      querySelect("#popup-parent-icons").style.display = "none";
    });

    const iconUrl = "https://www.mybrande.com/api/all/icons";

    function svgCreator(icon, name = "") {
      const img = new Image();
      img.classList.add("clip-icon");
      img.setAttribute("id", "clip-icon");
      icon = icon.replace(/(\r\n|\n|\r)/gm, "");
      img.setAttribute("data-name", name);
      const blob = new Blob([icon], { type: "image/svg+xml" });
      const svgDataUrl = URL.createObjectURL(blob);
      img.src = svgDataUrl;
      img.style.width = "80px";
      img.style.height = "80px";
      img.style.objectFit = "cover";
      return img;
    }

    let currIconIndex = 0;
    querySelect("#loader_main").style.display = "block";

    function triggerCurveEvent(value, obj) {
      if (!obj) return;

      canvas.setActiveObject(obj);
      const slider = querySelect("#text-curve-range");
      slider.value = value;
      const event = new Event("input", { bubbles: true });
      slider.dispatchEvent(event);
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    fetchCanvasData(this.canvas).then((data) => {
      const allData = data?.svgData?.AllData;
      const logoNameCurve = parseInt(allData?.brandName_curve);
      this.logoFile = allData.svg_data;
      const logoPosition = allData.logo_position;
      let parser = new DOMParser();
      let svgDoc = parser.parseFromString(this.logoFile, "image/svg+xml");

      let imageTag = svgDoc.querySelector("image");
      if (imageTag) {
        imageTag.remove();
      }
      let serializer = new XMLSerializer();
      let updatedLogo = serializer.serializeToString(svgDoc);
      localStorage.setItem("logo-file", updatedLogo);

      renderCanvas({
        SVG: updatedLogo,
        fabric: fabric,
        canvas: this.canvas,
        logoNameElement,
        sloganNameElement,
        layers: this.layers,
        initialRotation: this.initialRotation,
        isFlipY: this.isFlipY,
        isFlipX: this.isFlipX,
        colorPicker,
        refreshLayerNames,
      });

      updateColorPickers(this.canvas, colorPicker);
      const brandCase = data?.brandCase;
      const sloganCase = data?.sloganCase;

      if (!sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "true");
        location.reload();
      }
      if (data?.bg?.includes(",")) {
        const colorGrad = data.bg.split(",");
        let color = new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: this.canvas.width,
            y2: this.canvas.height,
          },
          colorStops: [
            { offset: 0, color: colorGrad[0] },
            { offset: 1, color: colorGrad[1] },
          ],
        });
        this.canvas.setBackgroundColor(color);
      } else {
        data.bg === "transparent"
          ? this.canvas.setBackgroundColor("#ffffff")
          : this.canvas.setBackgroundColor(data.bg);
      }

      this.canvas.renderAll();
      this.alignId = +data.logoPosition;
      updatePreview();

      setTimeout(async () => {
        this.canvasHistory = new SaveHistory(this.canvas);
        querySelect("#loader_main").style.display = "none";
        const alignItem = document.querySelector(
          `.svg__icon[data-align-id="${logoPosition}"]`,
        );

        alignItem.click();

        logoNameElement.set("fontSize", +data.brandSize);
        sloganNameElement.set("fontSize", +data.sloganSize);

        if (data.brandCurveDiameter)
          addCurveText(
            logoNameElement,
            data.brandCurveDiameter,
            data.brand_curve_percentage,
          );

        if (data.sloganCurveDiameter)
          addCurveText(
            sloganNameElement,
            data.sloganCurveDiameter,
            data.slogan_curve_percentage,
          );

        const brandBlur = data?.brandNameDropShadow?.split(",")[0];
        const brandOffsetX = data?.brandNameDropShadow?.split(",")[1];
        const brandOffsetY = data?.brandNameDropShadow?.split(",")[2];

        const sloganBlur = data?.sloganDropShadow?.split(",")[0];
        const sloganOffsetX = data?.sloganDropShadow?.split(",")[1];
        const sloganOffsetY = data?.sloganDropShadow?.split(",")[2];

        logoNameElement.set("shadow", {
          offsetX: +brandOffsetX,
          offsetY: +brandOffsetY,
          blur: +brandBlur,
        });

        sloganNameElement.set("shadow", {
          offsetX: +sloganOffsetX,
          offsetY: +sloganOffsetY,
          blur: +sloganBlur,
        });

        logoNameElement.set("charSpacing", data.brandCharSpacing);
        sloganNameElement.set("charSpacing", data.sloganCharSpacing);

        if (brandCase === "Uppercase") {
          logoNameElement.text = logoNameElement.text.toUpperCase();
        } else if (brandCase === "Lowercase") {
          logoNameElement.text = logoNameElement.text.toLowerCase();
        } else if (brandCase === "Title Case") {
          logoNameElement.text = toTitleCase(logoNameElement.text);
        } else if (brandCase === "Sentence Case") {
          logoNameElement.text = toSentenceCase(logoNameElement.text);
        }

        if (sloganCase === "Uppercase") {
          sloganNameElement.text = sloganNameElement.text.toUpperCase();
        } else if (sloganCase === "Lowercase") {
          sloganNameElement.text = sloganNameElement.text.toLowerCase();
        } else if (sloganCase === "Title Case") {
          sloganNameElement.text = toTitleCase(sloganNameElement.text);
        } else if (sloganCase === "Sentence Case") {
          sloganNameElement.text = toSentenceCase(sloganNameElement.text);
        }

        if (data.brandStyle === "underline") {
          logoNameElement.set("underline", true);
        } else {
          logoNameElement.set("underline", false);
          logoNameElement.set("fontStyle", data.brandStyle);
        }

        if (data.sloganStyle === "underline") {
          sloganNameElement.set("underline", true);
        } else {
          sloganNameElement.set("underline", false);
          sloganNameElement.set("fontStyle", data.sloganStyle);
        }

        logoNameElement.centerH();
        sloganNameElement.centerH();

        this.canvas.save();
        this.canvas.renderAll();

      }, 1000);

      setTimeout(() => {
        const objects = this.canvas.getObjects();
        const logoElement = objects.find(obj => {
          return obj.text && obj?.text?.toString().toLowerCase() === querySelect("#logoMainField").value.toLowerCase();
        });
        logoElement.top -= 80;
        logoElement.left += 20;
        triggerCurveEvent(logoNameCurve, logoElement)        
      }, 2000);

    });

    querySelect("#category_type_title").addEventListener("click", (e) => {
      querySelect("#clip-icons").innerHTML = null;
      const index = e.target.getAttribute("index");
      const currIndexIcons = this.iconList[index].Icons;
      let count = 0;
      currIndexIcons.forEach((icon) => {
        let cat_id = icon.icon_category_id;
        const name = this.iconList[index].category.iconcategory_slug,
          id = icon.id;

        const svgImg = svgCreator(
          icon.icon_svg,
          this.iconList[index].category.iconcategory_name,
        );
        svgImg.setAttribute("data-category", name);
        svgImg.setAttribute("data-id", id);

        querySelect("#clip-icons").appendChild(svgImg);
        count++;
      });
    });

    let layerCounter = 0;
    let clickedObjectCoordinates = {};

    document.getElementById("clip-icons").addEventListener("click", (e) => {
      let img = e.target;
      const itemId = img.getAttribute("data-id");
      const category = img.getAttribute("data-category");
      const targetSrc = img.src;
      const decodedSrc = decodeURIComponent(targetSrc);
      const canvas = this.canvas;

      fabric.loadSVGFromURL(decodedSrc, (objects, options) => {
        const img = fabric.util.groupSVGElements(objects, options);
        img.scaleToWidth(100);
        img.set({ left: img.left + 100, layerType: "svg" });
        img.set("id", "external_layer_" + layerCounter);
        img.set("itemId", itemId);
        img.set("category", category);

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.viewportCenterObjectV(img);
        canvas.requestRenderAll();
        updatePreview();
      });

      layerCounter++;
      document.getElementById("popup-parent-icons").style.display = "none";
      document
        .querySelector(".close-popup-btn")
        .dispatchEvent(new Event("click"));
      canvas.save();
    });

    querySelect("#add-clip-text").addEventListener("click", () => {
      querySelect("#popup-parent").style.display = "block";
      querySelect("#popup-parent-icons").style.display = "none";
    });

    querySelect(".close-popup-btn").addEventListener("click", () => {
      querySelect("#popup-parent").style.display = "none";
    });
    querySelect("#trigger-clip-text").addEventListener("click", () => {
      querySelect("#add-clip-text").dispatchEvent(new Event("click"));
    });

    querySelect("#add-icon").addEventListener("click", () => {
      querySelect("#popup-parent").style.display = "block";
      querySelect("#popup-parent-icons").style.display = "block";
    });

    querySelect(".item-title").addEventListener("click", () => {
      const IText = new fabric.IText("New Text", { fontFamily: "Poppins" });
      this.canvas.add(IText);
      IText.center();
      IText.set("id", "external_layer_" + Date.now());
      IText.set("left", IText.top + 50);
      IText.set("layerType", "text");
      IText.set("type", "text");
      updatePreview();
      this.canvas.requestRenderAll();
      this.canvas.setActiveObject(IText);
      this.canvas.save();
      querySelect("#popup-parent").style.display = "none";
      querySelect("#popup-parent-icons").style.display = "none";
    });

    let isLogoShadowAdjust = false;
    querySelect("#logo-drop-shadow").addEventListener("change", (e) => {
      const active = this.canvas.getActiveObject(),
        el = e.target;
      if (active.text) return true;
      el.classList.toggle("active");
      isLogoShadowAdjust = !isLogoShadowAdjust;

      if (el.checked) {
        querySelect("#logo-shadow-adjust").style.display = "block";
        const settingsView = querySelect(".settings-view");
        settingsView.scrollTop = settingsView.scrollHeight;

        this.logoShadowBlur = 1;
        this.logoShadowOffsetX = 0;
        this.logoShadowOffsetY = 2;
        querySelect("#logo-shadow-blur-slider").value = this.logoShadowBlur;
        querySelect("#logo-shadow-offsetX-slider").value =
          this.logoShadowOffsetX;
        querySelect("#logo-shadow-offsetY-slider").value =
          this.logoShadowOffsetY;
        querySelect("#logo-shadow-blur-slider").dispatchEvent(
          new Event("input"),
        );
        querySelect("#logo-shadow-offsetX-slider").dispatchEvent(
          new Event("input"),
        );
        querySelect("#logo-shadow-offsetY-slider").dispatchEvent(
          new Event("input"),
        );

        if (active._objects) {
          active.forEachObject((obj) => {
            obj.set("shadow", {
              offsetX: 0,
              offsetY: 2,
              blur: 5,
            });
          });
        } else {
          active.set("shadow", {
            offsetX: 0,
            offsetY: 2,
            blur: 5,
          });
        }

        this.canvas.requestRenderAll();
      } else {
        querySelect("#logo-shadow-adjust").style.display = "none";
        querySelect("#logo-shadow-blur").style.display = "none";
        querySelect("#logo-shadow-offsetX").style.display = "none";
        querySelect("#logo-shadow-offsetY").style.display = "none";
        querySelect("#logo-shadow-border").style.display = "none";

        const active = this.canvas.getActiveObject();

        if (active._objects) {
          active.forEachObject((obj) => {
            obj.set("shadow", {
              offsetX: 0,
              offsetY: 0,
              blur: 0,
            });
          });
        } else {
          active.set("shadow", {
            offsetX: 0,
            offsetY: 0,
            blur: 0,
          });
        }

        this.canvas.requestRenderAll();
      }

      updatePreview();
      if (active) this.canvas.save();
    });

    let isLogoDropShadow = false;
    querySelect("#logo-shadow-adjust").addEventListener("click", () => {
      const active = this.canvas.getActiveObject();
      isLogoDropShadow = !isLogoDropShadow;
      if (isLogoDropShadow) {
        querySelect("#logo-shadow-blur").style.display = "block";
        querySelect("#logo-shadow-offsetX").style.display = "block";
        querySelect("#logo-shadow-offsetY").style.display = "block";
        querySelect("#logo-shadow-border").style.display = "block";

        const settingsView = querySelect(".settings-view");
        settingsView.scrollTop = settingsView.scrollHeight;
      } else {
        querySelect("#logo-shadow-blur").style.display = "none";
        querySelect("#logo-shadow-offsetX").style.display = "none";
        querySelect("#logo-shadow-offsetY").style.display = "none";
        querySelect("#logo-shadow-border").style.display = "none";
      }
    });

    let isShadowAdjust = false;
    querySelect("#drop-shadow").addEventListener("change", (el) => {
      isShadowAdjust = !isShadowAdjust;
      const active = this.canvas.getActiveObject();
      if (!active.text) return true;

      if (el.target.checked) {
        querySelect("#shadow-adjust").style.display = "block";
        const settingsView = querySelect(".settings-view");
        settingsView.scrollTop = settingsView.scrollHeight;

        this.shadowBlur = 1;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 2;
        querySelect("#shadow-blur-slider").value = this.shadowBlur;
        querySelect("#shadow-offsetX-slider").value = this.shadowOffsetX;
        querySelect("#shadow-offsetY-slider").value = this.shadowOffsetY;
        querySelect("#shadow-blur-slider").dispatchEvent(new Event("input"));
        querySelect("#shadow-offsetX-slider").dispatchEvent(new Event("input"));
        querySelect("#shadow-offsetY-slider").dispatchEvent(new Event("input"));
        if (active._objects) {
          active.forEachObject((obj) => {
            if (!obj.text) return true;

            obj.set("shadow", {
              offsetX: 0,
              offsetY: 2,
              blur: 1,
            });
          });
        } else {
          active.set("shadow", {
            offsetX: 0,
            offsetY: 2,
            blur: 1,
          });
        }

        this.canvas.renderAll();
      } else {
        querySelect("#shadow-adjust").style.display = "none";
        querySelect("#shadow-blur").style.display = "none";
        querySelect("#shadow-offsetX").style.display = "none";
        querySelect("#shadow-offsetY").style.display = "none";

        if (active._objects) {
          active.forEachObject((obj) => {
            obj.set("shadow", {
              offsetX: 0,
              offsetY: 0,
              blur: 0,
            });
          });
        } else {
          active.set("shadow", {
            offsetX: 0,
            offsetY: 0,
            blur: 0,
          });
        }
        this.canvas.requestRenderAll();
      }
      if (active) this.canvas.save();
    });

    let isDropShadow = false;
    querySelect("#shadow-adjust").addEventListener("click", () => {
      isDropShadow = !isDropShadow;
      if (isDropShadow) {
        querySelect("#shadow-blur").style.display = "block";
        querySelect("#shadow-offsetX").style.display = "block";
        querySelect("#shadow-offsetY").style.display = "block";
        const settingsView = querySelect(".settings-view");
        settingsView.scrollTop = settingsView.scrollHeight;
      } else {
        querySelect("#shadow-blur").style.display = "none";
        querySelect("#shadow-offsetX").style.display = "none";
        querySelect("#shadow-offsetY").style.display = "none";
      }
    });

    const solidColorMode = querySelect("#solid_color_mode");
    const linearColorMode = querySelect("#linear_color_mode");
    const pickerColorMode = querySelect("#picker_color_mode");

    const solidColorTextMode = querySelect("#solid_color_text_mode");
    const linearColorTextMode = querySelect("#linear_color_text_mode");
    const pickerColorTextMode = querySelect("#picker_color_text_mode");
    updateColorPickers(this.canvas, colorPicker);

    colorPicker.on("color:init", (color) => {
      color.set(pickerDefaultColor);
    });

    let colorChanging = false;
    colorPicker.on("input:change", (color) => {
      const active = this.canvas.getActiveObject();
      if (!active) return;
      colorChanging = true;

      pickerDefaultColor = color.rgbaString;

      if (color.index === 0) {
        const hsl = color.hsl;
        const rgb = color.rgb;

        querySelect("#H").value = hsl.h;
        querySelect("#S").value = hsl.s;
        querySelect("#L").value = hsl.l;
        querySelect("#R").value = rgb.r;
        querySelect("#G").value = rgb.g;
        querySelect("#B").value = rgb.b;

        querySelect("#HEX").value = color.hexString;
      }

      if (active && active._objects) {
        active._objects.forEach((i) => {
          i.set("fill", color.rgbaString);
        });
      }
      active.set("fill", color.rgbaString);

      const logoColorPickers = querySelectAll("#color-layers-pickers");
      logoColorPickers.forEach((i) => i.remove());
      updateColorPickers(this.canvas, colorPicker);
      this.canvas.requestRenderAll();
      colorChanging = false;
    });

    attachRGBHandlers(colorPicker, this.canvas);
    attachHSLHandlers(colorPicker, this.canvas);

    const textColorPickerSuffix = "2";
    attachRGBHandlers(colorPickerText, this.canvas, textColorPickerSuffix);
    attachHSLHandlers(colorPickerText, this.canvas, textColorPickerSuffix);

    let inputCountBG = 0;
    let inputCount2 = 0;

    querySelect("#HEX").addEventListener("input", (e) => {
      let hex = e.target.value;

      if (hex.length > 0 && hex[0] !== "#") {
        if (inputCountBG >= 3) {
          hex = "#" + hex;
          querySelect("#HEX").value = hex;
          inputCountBG = 0;
        } else {
          inputCountBG++;
        }
      }

      colorPicker.color.set(hex);
      const a = this.canvas.getActiveObject();
      if (a && a._objects) {
        a._objects.forEach((i) => {
          i.set("fill", hex);
        });
      }
      a.set("fill", hex);

      let r = querySelect("#R").value;
      let g = querySelect("#G").value;
      let b = querySelect("#B").value;
      colorPicker.color.rgb = { r, g, b };
      let h = querySelect("#H").value;
      let s = querySelect("#S").value;
      let l = querySelect("#L").value;
      colorPicker.color.hsl = { h, s, l };

      this.canvas.requestRenderAll();
    });

    querySelect("#HEX2").addEventListener("input", (e) => {
      let hex = e.target.value;

      if (hex.length > 0 && hex[0] !== "#") {
        if (inputCount2 >= 3) {
          hex = "#" + hex;
          querySelect("#HEX2").value = hex;
          inputCount2 = 0;
        } else {
          inputCount2++;
        }
      }
      colorPickerText.color.set(hex);
      const a = this.canvas.getActiveObject();
      if (!a) return true;
      if (a._objects)
        a._objects.forEach((i) => {
          i.set("fill", hex);
        });
      a.set("fill", hex);

      let r = querySelect("#R2").value;
      let g = querySelect("#G2").value;
      let b = querySelect("#B2").value;
      colorPickerText.color.rgb = { r, g, b };
      let h = querySelect("#H2").value;
      let s = querySelect("#S2").value;
      let l = querySelect("#L2").value;
      colorPickerText.color.hsl = { h, s, l };

      this.canvas.requestRenderAll();
    });

    var isSolidColor = true;
    var isLinearColor = false;
    var isPickerColor = false;

    const solidColorEvent = () => {
      isSolidColor = !isSolidColor;
      isLinearColor = false;
      isPickerColor = false;

      if (isSolidColor) {
        querySelect("#picker_color_mode").classList.remove("category_selected");
        querySelect("#solid_color_mode").classList.add("category_selected");
        querySelect("#linear_color_mode").classList.remove("category_selected");

        querySelect("#solid_color_items").style.display = "flex";
        querySelect("#linear_color_items").style.display = "none";
        querySelect("#picker_color_items").style.display = "none";

        openPickerView = "none";
      } else {
        querySelect("#solid_color_items").style.display = "none";
        querySelect("#linear_color_items").style.display = "none";
        querySelect("#picker_color_items").style.display = "none";
        querySelect("#solid_color_mode").classList.remove("category_selected");
      }
    };

    const linearColorEvent = () => {
      isLinearColor = !isLinearColor;
      isSolidColor = false;
      isPickerColor = false;

      if (isLinearColor) {
        querySelect("#picker_color_mode").classList.remove("category_selected");
        querySelect("#linear_color_mode").classList.add("category_selected");
        querySelect("#solid_color_mode").classList.remove("category_selected");

        querySelect("#linear_color_items").style.display = "flex";
        querySelect("#solid_color_items").style.display = "none";
        querySelect("#picker_color_items").style.display = "none";

        openPickerView = "none";
      } else {
        querySelect("#solid_color_items").style.display = "none";
        querySelect("#linear_color_items").style.display = "none";
        querySelect("#picker_color_items").style.display = "none";
        querySelect("#linear_color_mode").classList.remove("category_selected");
      }
    };

    const pickerColorEvent = () => {
      isPickerColor = !isPickerColor;
      isSolidColor = false;
      isLinearColor = false;

      if (isPickerColor) {
        querySelect("#solid_color_items").style.display = "none";
        querySelect("#picker_color_items").style.display = "flex";
        querySelect("#linear_color_items").style.display = "none";
        querySelect("#linear_color_mode").classList.remove("category_selected");
        querySelect("#solid_color_mode").classList.remove("category_selected");
        querySelect("#picker_color_mode").classList.add("category_selected");
        querySelect("#picker_color_items").style.marginTop = "8px";

        openTextPickerView = "block";
      } else {
        querySelect("#solid_color_items").style.display = "none";
        querySelect("#linear_color_items").style.display = "none";
        querySelect("#picker_color_items").style.display = "none";
        querySelect("#picker_color_mode").classList.remove("category_selected");
      }
    };

    var isSolidTextColor = true;
    var isLinearTextColor = false;
    var isPickerTextColor = false;

    const solidTextColorEvent = () => {
      isSolidTextColor = !isSolidTextColor;
      isLinearTextColor = false;
      isPickerTextColor = false;

      if (isSolidTextColor) {
        querySelect("#picker_color_text_mode").classList.remove(
          "category_selected",
        );
        querySelect("#solid_color_text_mode").classList.add(
          "category_selected",
        );
        querySelect("#linear_color_text_mode").classList.remove(
          "category_selected",
        );

        querySelect("#solid_color_items_text").style.display = "flex";
        querySelect("#linear_color_items_text").style.display = "none";
        querySelect("#picker_color_items_text").style.display = "none";

        openTextPickerView = "none";
      } else {
        querySelect("#solid_color_items_text").style.display = "none";
        querySelect("#linear_color_items_text").style.display = "none";
        querySelect("#picker_color_items_text").style.display = "none";
        querySelect("#solid_color_text_mode").classList.remove(
          "category_selected",
        );
      }
    };

    const linearTextColorEvent = () => {
      isLinearTextColor = !isLinearTextColor;
      isSolidTextColor = false;
      isPickerTextColor = false;

      if (isLinearTextColor) {
        querySelect("#picker_color_text_mode").classList.remove(
          "category_selected",
        );
        querySelect("#linear_color_text_mode").classList.add(
          "category_selected",
        );
        querySelect("#solid_color_text_mode").classList.remove(
          "category_selected",
        );

        querySelect("#linear_color_items_text").style.display = "flex";
        querySelect("#solid_color_items_text").style.display = "none";
        querySelect("#picker_color_items_text").style.display = "none";

        openTextPickerView = "none";
      } else {
        querySelect("#solid_color_items_text").style.display = "none";
        querySelect("#linear_color_items_text").style.display = "none";
        querySelect("#picker_color_items_text").style.display = "none";
        querySelect("#linear_color_text_mode").classList.remove(
          "category_selected",
        );
      }
    };

    const pickerTextColorEvent = () => {
      isPickerTextColor = !isPickerTextColor;
      isSolidTextColor = false;
      isLinearTextColor = false;

      if (isPickerTextColor) {
        querySelect("#solid_color_items_text").style.display = "none";
        querySelect("#picker_color_items_text").style.display = "flex";
        querySelect("#linear_color_items_text").style.display = "none";
        querySelect("#linear_color_text_mode").classList.remove(
          "category_selected",
        );
        querySelect("#solid_color_text_mode").classList.remove(
          "category_selected",
        );
        querySelect("#picker_color_text_mode").classList.add(
          "category_selected",
        );
        querySelect("#picker_color_items_text").style.marginTop = "8px";

        openTextPickerView = "block";
      } else {
        querySelect("#solid_color_items_text").style.display = "none";
        querySelect("#linear_color_items_text").style.display = "none";
        querySelect("#picker_color_items_text").style.display = "none";
        querySelect("#picker_color_text_mode").classList.remove(
          "category_selected",
        );
      }
    };

    let openPickerViewBG = "block";
    let pickerDefaultColorBG = "#fff";

    let colorPickerBG = new iro.ColorPicker("#openTextPickerViewBG", {
      display: openPickerViewBG,
      width: 210,
      marginTop: 20,
      color: pickerDefaultColorBG,
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "hue",
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "alpha",
          },
        },
      ],
    });

    const solidTextColorEventBG = () => {
      querySelect("#picker_color_text_modeBG").classList.remove(
        "category_selected",
      );
      querySelect("#linear_color_text_modeBG").classList.remove(
        "category_selected",
      );
      querySelect("#solid_color_text_modeBG").classList.add(
        "category_selected",
      );

      querySelect("#bg_solid_color_items_text").style.display = "flex";
      querySelect("#bg_picker_color_items_text").style.display = "none";
      querySelect("#bg_linear_color_items_text").style.display = "none";
      openPickerViewBG = "none";
    };

    const pickerTextColorEventBG = () => {
      querySelect("#bg_solid_color_items_text").style.display = "none";
      querySelect("#bg_picker_color_items_text").style.display = "flex";
      querySelect("#bg_linear_color_items_text").style.display = "none";

      querySelect("#solid_color_text_modeBG").classList.remove(
        "category_selected",
      );
      querySelect("#linear_color_text_modeBG").classList.remove(
        "category_selected",
      );
      querySelect("#picker_color_text_modeBG").classList.add(
        "category_selected",
      );

      querySelect("#bg_picker_color_items_text").style.marginTop = "8px";
      openPickerViewBG = "block";
    };

    const linearTextColorEventBG = () => {
      querySelect("#bg_solid_color_items_text").style.display = "none";
      querySelect("#bg_picker_color_items_text").style.display = "none";
      querySelect("#bg_linear_color_items_text").style.display = "flex";

      querySelect("#solid_color_text_modeBG").classList.remove(
        "category_selected",
      );
      querySelect("#picker_color_text_modeBG").classList.remove(
        "category_selected",
      );
      querySelect("#linear_color_text_modeBG").classList.add(
        "category_selected",
      );

      querySelect("#bg_picker_color_items_text").style.marginTop = "8px";
      openPickerViewBG = "block";
    };

    solidTextColorEventBG();

    querySelect("#solid_color_text_modeBG").addEventListener("click", () => {
      solidTextColorEventBG();
    });

    querySelect("#picker_color_text_modeBG").addEventListener("click", () => {
      pickerTextColorEventBG();
    });

    querySelect("#linear_color_text_modeBG").addEventListener("click", () => {
      linearTextColorEventBG();
    });

    [("#R_BG", "#G_BG", "#B_BG")].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        const r = querySelect("#R_BG").value;
        const g = querySelect("#G_BG").value;
        const b = querySelect("#B_BG").value;
        colorPickerBG.color.rgb = { r, g, b };
        const bgColor = colorPickerBG.color.hexString;
        this.canvas.setBackgroundColor(bgColor);
        this.canvas.requestRenderAll();
      });
    });

    ["#H_BG", "#S_BG", "#L_BG"].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        const h = querySelect("#H_BG").value;
        const s = querySelect("#S_BG").value;
        const l = querySelect("#L_BG").value;
        colorPickerBG.color.hsl = { h, s, l };
        const bgColor = colorPickerBG.color.hexString;
        this.canvas.setBackgroundColor(bgColor);
        this.canvas.requestRenderAll();
      });
    });

    querySelect("#HEX_BG").addEventListener("input", (e) => {
      let inputCountBG = 0;
      let inputValue = e.target.value;

      if (inputValue.length > 0 && inputValue[0] !== "#") {
        if (inputValue.length >= 3) {
          inputValue = "#" + inputValue;
          querySelect("#HEX_BG").value = inputValue;
          inputCountBG = 0;
        } else {
          inputCountBG++;
        }
      }

      const r = querySelect("#R_BG").value;
      const g = querySelect("#G_BG").value;
      const b = querySelect("#B_BG").value;
      colorPickerBG.color.rgb = { r, g, b };

      const h = querySelect("#H_BG").value;
      const s = querySelect("#S_BG").value;
      const l = querySelect("#L_BG").value;
      colorPickerBG.color.hsl = { h, s, l };

      colorPickerBG.color.set(inputValue);
      this.canvas.setBackgroundColor(colorPickerBG.color.hexString);

      this.canvas.requestRenderAll();
    });

    const handleColorModeClickBG = (
      activeElement,
      element1,
      element2,
      removeClasses = true,
    ) => {
      if (removeClasses)
        document
          .querySelectorAll(".bg-settings-container .color_mode_title")
          .forEach((i) => i.classList.remove("active"));

      querySelect(element1 + "_view_BG").classList.remove(
        "color_mode_title-active",
      );
      querySelect(element1 + "_view_BG").style.display = "none";

      querySelect(element2 + "_view_BG").classList.remove(
        "color_mode_title-active",
      );
      querySelect(element2 + "_view_BG").style.display = "none";

      querySelect(activeElement + "_view_BG").classList.add(
        "color_mode_title-active",
      );
      querySelect(activeElement + "_view_BG").style.display = "flex";
    };

    querySelect("#HSL_mode_BG").addEventListener("click", (e) => {
      handleColorModeClickBG("#HSL", "#RGB", "#HEX");
      e.target.classList.add("active");
    });

    querySelect("#RGB_mode_BG").addEventListener("click", (e) => {
      handleColorModeClickBG("#RGB", "#HSL", "#HEX");
      e.target.classList.add("active");
    });

    querySelect("#HEX_mode_BG").addEventListener("click", (e) => {
      handleColorModeClickBG("#HEX", "#RGB", "#HSL");
      e.target.classList.add("active");
    });
    handleColorModeClickBG("#HEX", "#RGB", "#HSL", false);

    const changeBgColorInputValues = (color) => {
      pickerDefaultColorBG = color.rgbaString;

      if (color.index === 0) {
        const hsl = color.hsl;
        const rgb = color.rgb;

        querySelect("#H_BG").value = hsl.h;
        querySelect("#S_BG").value = hsl.s;
        querySelect("#L_BG").value = hsl.l;
        querySelect("#R_BG").value = rgb.r;
        querySelect("#G_BG").value = rgb.g;
        querySelect("#B_BG").value = rgb.b;

        querySelect("#HEX_BG").value = color.hexString;
      }

      this.canvas.setBackgroundColor(color.rgbaString);
      this.canvas.requestRenderAll();
    };

    colorPickerBG.on("color:init", (color) => {
      color.set(pickerDefaultColorBG);
      changeBgColorInputValues(color);
    });

    let colorChangingBG = false;
    colorPickerBG.on("input:change", (color) => {
      colorChangingBG = true;

      changeBgColorInputValues(color);
      colorChangingBG = false;
    });

    colorPickerBG.on("input:end", () => {
      updatePreview();
      this.canvas.save();
    });

    solidColorEvent();
    solidTextColorEvent();

    solidColorMode.addEventListener("click", solidColorEvent);
    pickerColorMode.addEventListener("click", pickerColorEvent);
    linearColorMode.addEventListener("click", linearColorEvent);

    solidColorTextMode.addEventListener("click", solidTextColorEvent);
    linearColorTextMode.addEventListener("click", linearTextColorEvent);
    pickerColorTextMode.addEventListener("click", pickerTextColorEvent);

    querySelect("#custom_color_generator").addEventListener("change", (e) => {
      const color = e.target.value;

      const newColor = document.createElement("div");
      newColor.style.backgroundColor = color;
      newColor.className = "color-picker";
      newColor.style.width = "32px";
      newColor.style.height = "32px";
      newColor.style.borderColor = color;
      newColor.style.borderRadius = "5px";

      newColor.addEventListener("click", () => {
        const activeObj = this.canvas.getActiveObject();
        if (activeObj._objects) {
          activeObj._objects.forEach((i) => i.set("fill", color));
        }
        activeObj.set("fill", color);
        colorPicker.color.set(color);
        querySelect("#HEX").value = color;

        let rgbValue = hexToRgb(color);
        let rgbValues = rgbValue.match(/\d+/g);

        if (rgbValues && rgbValues.length === 3) {
          querySelect("#R").value = rgbValues[0];
          querySelect("#G").value = rgbValues[1];
          querySelect("#B").value = rgbValues[2];
        }
        let hslValue = hexToHsl(color);
        let hslValues = hslValue.match(/\d+/g);

        if (hslValues && hslValues.length === 3) {
          querySelect("#H").value = hslValues[0];
          querySelect("#S").value = hslValues[1];
          querySelect("#L").value = hslValues[2];
        }
        this.canvas.renderAll();
        updatePreview();
      });

      querySelect("#custom_colors_wrapper").append(newColor);
    });

    querySelect("#custom_text_color_generator").addEventListener(
      "change",
      (e) => {
        const color = e.target.value;

        const newColor = document.createElement("div");
        newColor.style.backgroundColor = color;
        newColor.className = "color-picker";
        newColor.style.width = "32px";
        newColor.style.height = "32px";
        newColor.style.borderColor = color;
        newColor.style.borderRadius = "5px";

        newColor.addEventListener("click", () => {
          const activeObj = this.canvas.getActiveObject();
          if (activeObj._objects)
            activeObj._objects.forEach((i) => i.set("fill", color));

          activeObj.set("fill", color);
          colorPickerText.color.set(color);
          querySelect("#HEX2").value = color;

          let rgbValue = hexToRgb(color);
          let rgbValues = rgbValue.match(/\d+/g);

          if (rgbValues && rgbValues.length === 3) {
            querySelect("#R2").value = rgbValues[0];
            querySelect("#G2").value = rgbValues[1];
            querySelect("#B2").value = rgbValues[2];
          }
          let hslValue = hexToHsl(color);
          let hslValues = hslValue.match(/\d+/g);

          if (hslValues && hslValues.length === 3) {
            querySelect("#H2").value = hslValues[0];
            querySelect("#S2").value = hslValues[1];
            querySelect("#L2").value = hslValues[2];
          }
          this.canvas.renderAll();
          updatePreview();
          this.canvas.save();
        });

        querySelect("#custom_text_colors_wrapper").append(newColor);
      },
    );

    querySelect("#custom_bg_color_generator").addEventListener(
      "change",
      (e) => {
        const color = e.target.value;

        const newColor = document.createElement("div");
        newColor.style.backgroundColor = color;
        newColor.className = "color-picker";
        newColor.style.width = "32px";
        newColor.style.height = "32px";
        newColor.style.borderColor = color;
        newColor.style.borderRadius = "5px";

        newColor.addEventListener("click", () => {
          this.canvas.setBackgroundColor(color);
          colorPickerBG.color.set(color);
          querySelect("#HEX_BG").value = color;

          let rgbValue = hexToRgb(color);
          let rgbValues = rgbValue.match(/\d+/g);

          if (rgbValues && rgbValues.length === 3) {
            querySelect("#R_BG").value = rgbValues[0];
            querySelect("#G_BG").value = rgbValues[1];
            querySelect("#B_BG").value = rgbValues[2];
          }
          let hslValue = hexToHsl(color);
          let hslValues = hslValue.match(/\d+/g);

          if (hslValues && hslValues.length === 3) {
            querySelect("#H_BG").value = hslValues[0];
            querySelect("#S_BG").value = hslValues[1];
            querySelect("#L_BG").value = hslValues[2];
          }
          this.canvas.renderAll();
          updatePreview();
          this.canvas.save();
        });

        querySelect("#custom_bg_colors_wrapper").append(newColor);
      },
    );

    querySelectAll("#solid_color").forEach((item) => {
      solidColorAction(item, this.canvas, colorPicker, updatePreview);
    });

    const changeColorPickerText = (color) => {
      pickerDefaultColor = color.rgbaString;

      if (color.index === 0) {
        const hsl = color.hsl;
        const rgb = color.rgb;

        querySelect("#H2").value = hsl.h;
        querySelect("#S2").value = hsl.s;
        querySelect("#L2").value = hsl.l;
        querySelect("#R2").value = rgb.r;
        querySelect("#G2").value = rgb.g;
        querySelect("#B2").value = rgb.b;

        querySelect("#HEX2").value = color.hexString;
      }

      const active = this.canvas.getActiveObject();
      if (!active) return false;
      if (active._objects) {
        active._objects.forEach((i) => {
          i.set("fill", color.rgbaString);
        });
      }
      active.set("fill", color.rgbaString);
      this.canvas.requestRenderAll();

      const logoColorPickers = querySelectAll("#color-layers-pickers");
      logoColorPickers.forEach((i) => i.remove());
      updateColorPickers(this.canvas, colorPicker);
      this.canvas.requestRenderAll();
    };

    colorPickerText.on("input:change", changeColorPickerText);
    colorPickerText.on("input:move", changeColorPickerText);
    colorPickerText.on("input:end", () => {
      updatePreview();
      this.canvas.save();
    });

    querySelectAll("#solid_color_text").forEach((item) => {
      solidColorTextAction(item, this.canvas, colorPickerText, updatePreview);
      changeColorPickerText(colorPickerText.color);
    });

    querySelectAll("#solid_color-bg").forEach((item) => {
      bgColorAction(item, this.canvas, updatePreview);
    });

    updateColorTextPickers(this.canvas, updatePreview);

    colorPickerText.on("color:init", (color) => {
      color.set(pickerDefaultColor);
    });

    const handleColorModeClick = (activeElement, element1, element2) => {
      querySelect(element1 + "_view").classList.remove(
        "color_mode_title-active",
      );
      querySelect(element1 + "_view").style.display = "none";

      querySelect(element2 + "_view").classList.remove(
        "color_mode_title-active",
      );
      querySelect(element2 + "_view").style.display = "none";

      querySelect(activeElement + "_view").classList.add(
        "color_mode_title-active",
      );
      querySelect(activeElement + "_view").style.display = "flex";
    };

    querySelect("#HSL_mode").addEventListener("click", (e) => {
      document
        .querySelectorAll(".setting-container .color_mode_title")
        .forEach((i) => i.classList.remove("active"));

      handleColorModeClick("#HSL", "#RGB", "#HEX");
      e.target.classList.add("active");
    });

    querySelect("#RGB_mode").addEventListener("click", (e) => {
      document
        .querySelectorAll(".setting-container .color_mode_title")
        .forEach((i) => i.classList.remove("active"));

      handleColorModeClick("#RGB", "#HSL", "#HEX");
      e.target.classList.add("active");
    });

    querySelect("#HEX_mode").addEventListener("click", (e) => {
      document
        .querySelectorAll(".setting-container .color_mode_title")
        .forEach((i) => i.classList.remove("active"));

      handleColorModeClick("#HEX", "#RGB", "#HSL");
      e.target.classList.add("active");
    });

    querySelect("#HSL2_mode").addEventListener("click", (e) => {
      document
        .querySelectorAll(".text-settings-container .color_mode_title")
        .forEach((i) => i.classList.remove("active"));

      handleColorModeClick("#HSL2", "#RGB2", "#HEX2");
      e.target.classList.add("active");
    });

    querySelect("#RGB2_mode").addEventListener("click", (e) => {
      document
        .querySelectorAll(".text-settings-container .color_mode_title")
        .forEach((i) => i.classList.remove("active"));

      handleColorModeClick("#RGB2", "#HSL2", "#HEX2");
      e.target.classList.add("active");
    });

    querySelect("#HEX2_mode").addEventListener("click", (e) => {
      document
        .querySelectorAll(".text-settings-container .color_mode_title")
        .forEach((i) => i.classList.remove("active"));

      handleColorModeClick("#HEX2", "#RGB2", "#HSL2");
      e.target.classList.add("active");
    });

    handleColorModeClick("#HEX", "#RGB", "#HSL");
    handleColorModeClick("#HEX2", "#RGB2", "#HSL2");

    const scaleLogo = (scaleSize) => {
      const selection = new fabric.ActiveSelection(
        this.canvas
          .getObjects()
          .filter(
            (i) =>
              !i.text && !i?.dublicate && !i.id?.includes("external_layer_"),
          ),
        {
          canvas: this.canvas,
        },
      );

      const { width, height } = selection;
      const scaleFactor = Math.min(scaleSize / width, scaleSize / height);
      selection.scale(scaleFactor);

      selection.center();
      this.canvas.setActiveObject(selection);
      this.canvas.discardActiveObject(selection);
      this.canvas.requestRenderAll();
    };

    querySelect("#canvas-bg-none").addEventListener("click", () => {
      this.canvasBG = "#ffffff";
      this.canvas.setBackgroundColor(this.canvasBG);
      this.canvas.renderAll();
      this.canvas.updatePreview();
    });

    const discardSelectionForAlignments = () => {
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
    };

    var logoPosition;
    var external_layer;
    var external_text;
    var external_img;

    async function fetchCanvasData() {
      querySelect("#loader_main").style.display = "block";
      const logoId = querySelect("#logo_id").value;
      if (!logoId) return toastNotification("Error!! Logo ID Not Found");

      let response;
      const apiCheckValue = querySelect("#api_check").value;
      if (apiCheckValue === "1") {
        response = await axios.get(
          `https://www.mybrande.com/api/find/logo/${logoId}`,
        );
      } else {
        response = await axios.get(
          `https://www.mybrande.com/api/find/logo/buyer/${logoId}`,
        );
      }

      const responseData = response?.data?.AllData;

      const bg = responseData?.logo_backgroundcolor;
      logoPosition = responseData?.logo_position;
      const svgData = responseData?.editor_svg_data;
      const brandCharSpacing = responseData?.brandName_letterSpace;
      const sloganCharSpacing = responseData?.slogan_letterSpace;
      const brandStyle = responseData?.brandName_fontStyle;
      const sloganStyle = responseData?.slogan_fontStyle;
      const brandSize = responseData?.brandName_fontSize;
      const sloganSize = responseData?.slogan_fontSize;
      const brandCase = responseData?.brandName_letterCase;
      const sloganCase = responseData?.slogan_letterCase;

      const sloganCurveDiameter = responseData?.slogan_curve_diameter;
      const brandCurveDiameter = responseData?.brandName_curve_diameter;

      const brandNameDropShadow = responseData?.brandName_droupShadow;
      const sloganDropShadow = responseData?.slogan_droupShadow;
      external_layer = responseData?.externalLayerElements;
      external_text = responseData?.externalTextElements;
      external_img = responseData?.images;
      loadExternalLayers(external_layer, external_text, external_img);

      const brandNameFamily =
        self.allFonts[responseData?.brandName_fontFamely]?.family;
      const sloganFamily =
        self.allFonts[responseData?.slogan_fontFamely]?.family;

      const fontFamilies = [];
      if (brandNameFamily) {
        fontFamilies.push(brandNameFamily);
      }
      if (sloganFamily) {
        fontFamilies.push(sloganFamily);
      }

      WebFont?.load({
        fontDisplay: "swap",
        google: {
          families: fontFamilies,
        },
        active: function () {
          logoNameElement.set("fontFamily", brandNameFamily);
          sloganNameElement.set("fontFamily", sloganFamily);
          self.canvas.renderAll();
        },
      });

      if (svgData) {
        localStorage.setItem("logo-file", svgData);
      }

      const brandCharModifiedVal = Number(brandCharSpacing) * 10;
      const sloganCharModifiedVal = Number(sloganCharSpacing) * 10;
      return {
        bg,
        logoPosition,
        svgData: response.data,
        brandCharSpacing: brandCharModifiedVal,
        sloganCharSpacing: sloganCharModifiedVal,
        brandStyle,
        sloganStyle,
        brandNameDropShadow,
        sloganDropShadow,
        brandSize,
        sloganSize,
        brandCase,
        sloganCase,
        sloganCurveDiameter,
        brandCurveDiameter,
      };
    }

    let alignmentOptions = {
      top_bottom_1: 200,
      top_bottom_2: 200,
      top_bottom_3: 160,
      top_bottom_4: 200,
      bottom_top_1: 200,
      bottom_top_2: 200,
      bottom_top_3: 160,
      left_right_1: 200,
      left_right_2: 200,
      left_right_3: 160,
      left_right_4: 200,
      right_left_1: 200,
      right_left_2: 160,
      right_left_3: 200,
      right_left_4: 200,
      curve_1: 200,
      curve_2: 200,
      curve_3: 200,
    };
    let anythingApplied = false;

    for (const singleEl in alignmentOptions) {
      let scaleValue = alignmentOptions[singleEl];
      querySelect("#" + singleEl).addEventListener("click", () => {
        if (anythingApplied) return true;
        discardSelectionForAlignments();
        this.alignId = getAttr(`#${singleEl}`, "data-align-id");

        scaleLogo(scaleValue);
        anythingApplied = true;

        setlogoPosition(this, {
          logoPosition: this.alignId,
          logoNameElement,
          sloganNameElement,
          scaleLogo,
        });

        setTimeout(() => {
          updatePreview();
          this.canvas.save();
          anythingApplied = false;
        }, 100);
      });
    }

    let currentFontIndex = 0,
      fontMaxCount = 20,
      fontListMenu = querySelect("#font-family-con .collection");

    const loadFonts = async (items) => {
      const chunk = items.slice(
        currentFontIndex,
        currentFontIndex + fontMaxCount,
      );
      currentFontIndex += fontMaxCount;

      let liItems = "";
      for (const item of chunk) {
        const { family, variants } = item;

        self.loadedFonts[family] = { variants };
        self.allFonts[family].loaded = true;

        const families = variants.map((variant) => `${family}:${variant}`);

        WebFont.load({ google: { families } });

        liItems += `<li value="${family}" class="font-family-item" data-loaded="true">
          <span style="font-family:${family}; font-weight: 500" class="text">${family}</span></li>`;
      }

      fontListMenu.innerHTML += liItems;
      initMultiSelectList();
    };

    const unloadFonts = (items) => {
      const itemsToRemove = items.slice(
        currentFontIndex - fontMaxCount,
        currentFontIndex,
      );
      for (const item of itemsToRemove) {
        const { family } = item;
        const fontListItem = fontListMenu.querySelector(
          `li[value="${family}"]`,
        );
        if (fontListItem) {
          fontListMenu.removeChild(fontListItem);
        }
      }
      currentFontIndex -= fontMaxCount;
      initMultiSelectList();
    };

    (async () => {
      const fontItems = await this.fetchFonts();
      await loadFonts(fontItems);

      fontListMenu.addEventListener(
        "wheel",
        debounce((e) => {
          if (e.wheelDelta < 0) {
            loadFonts(fontItems);
          } else if (e.wheelDelta > 0 && currentFontIndex > fontMaxCount) {
            unloadFonts(fontItems);
          }
        }),
        150,
      );
    })();

    const debounce = (callback, wait) => {
      let timeout = null;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          callback(...args);
        }, wait);
      };
    };

    const fontLiveSearch = function (element) {
      let val = element.value.toLowerCase(),
        fontList = querySelect("#font-family-con .collection");

      const generateItem = (font) => {
        return `<li value="${font}" class="font-family-item" data-loaded="true">
          <span style="font-family:${font}; font-weight: 500px" class="text">${font}</span></li>`;
      };

      if (!val.length) {
        fontList.innerHTML = "";
        let max = 20;
        let liItems = "";

        for (const font in self.allFonts) {
          if (max <= 0) break;
          let item = generateItem(font);
          liItems += item;
          max--;
        }

        fontListMenu.innerHTML = liItems;
        return false;
      }

      let filteredFonts = Object.keys(self.allFonts).filter((font) => {
        return font.toLowerCase().startsWith(val);
      });

      let liItems = "";
      for (const font of filteredFonts) {
        let item = generateItem(font);
        liItems += item;
        self.loadedFonts[font] = self.allFonts[font];
      }
      try {
        WebFont.load({
          google: {
            families: filteredFonts,
          },
          active: function () { },
        });
      } catch (err) { }
      fontList.innerHTML = liItems;
      initMultiSelectList();
    };

    document.addEventListener("keyup", function (event) {
      if (event.target.classList.contains("live-search")) {
        fontLiveSearch(event.target);
      }
    });
  }
}

const editorScreen = new EditorScreen();
editorScreen.initialize();
export const canvas = editorScreen.canvas;
export const fetchedFonts = editorScreen.fetchFonts;
