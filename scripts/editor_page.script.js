import { fabric } from "fabric";
import { CreateLayerSection } from "./create_layer";
import { CanvasGuides } from "./editor-obj-dim";
import { toastNotification } from "./toast_notification.js";
import "alwan/dist/css/alwan.min.css";
import iro from "@jaames/iro";
import WebFont from "webfontloader";
import axios from "axios";
import {
  rgbToHex,
  convertRGBtoHex,
  hexToHsl,
  hexToRgb,
  rgbaToHex,
} from "./color_converter";
import { rotateReset } from "./rotate_reset";
import { saveCanvas } from "./save_canvas";
import { centerAndResizeElements } from "./center_resize";
import SaveHistory from "./SaveHistory.js";

const querySelect = (element) => document.querySelector(element);
const querySelectAll = (element) => document.querySelectorAll(element);
const getAttr = (element, attr) => querySelect(element).getAttribute(attr);

fabric.CurvedText = fabric.util.createClass(fabric.Object, {
  type: "curved-text",
  diameter: 250,
  kerning: 0,
  text: "",
  flipped: false,
  cacheProperties: fabric.Object.prototype.cacheProperties.concat(
    "diameter",
    "text",
    "kerning",
    "flipped",
    "fill",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "strokeStyle",
    "strokeWidth"
  ),
  strokeStyle: null,
  _refresh: true,
  strokeWidth: 0,
  _cachedCanvas: null,
  _needsRecalculate: true,

  initialize: function (text, options) {
    options || (options = {});
    this.text = text;

    this.callSuper("initialize", options);
    this.set("lockUniScaling", true);
    this._needsRecalculate = true;

    var canvas = this.getCircularText();
    canvas = this._trimCanvas(canvas);
    this.set("width", canvas.width);
    this.set("height", canvas.height);
  },

  _getFontDeclaration: function () {
    return [
      fabric.isLikelyNode ? this.fontWeight : this.fontStyle,
      fabric.isLikelyNode ? this.fontStyle : this.fontWeight,
      this.fontSize + "px",
      fabric.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily,
    ].join(" ");
  },

  _trimCanvas: function (canvas) {
    try {
      var ctx = canvas.getContext("2d", { willReadFrequently: true }),
        w = canvas.width,
        h = canvas.height,
        pix = { x: [], y: [] },
        n,
        imageData = ctx.getImageData(0, 0, w, h),
        fn = function (a, b) {
          return a - b;
        };

      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          if (imageData.data[(y * w + x) * 4 + 3] > 0) {
            pix.x.push(x);
            pix.y.push(y);
          }
        }
      }
      pix.x.sort(fn);
      pix.y.sort(fn);
      n = pix.x.length - 1;

      w = pix.x[n] - pix.x[0];
      h = pix.y[n] - pix.y[0];
      var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

      canvas.width = w;
      canvas.height = h;
      ctx.putImageData(cut, 0, 0);

      return canvas;
    } catch (err) {
      return false;
    }
  },

  getCircularText: function () {
    if (this._cachedCanvas && !this._needsRecalculate) {
      return this._cachedCanvas;
    }

    var text =
        this.text.trim().length > 1
          ? this.text
          : "You don't set empty value in curved text",
      diameter = this.diameter,
      flipped = this.flipped,
      kerning = this.kerning,
      fill = this.fill,
      inwardFacing = true,
      startAngle = 0,
      canvas = fabric.util.createCanvasElement(),
      ctx = canvas.getContext("2d", { willReadFrequently: true }),
      cw, // character-width
      x, // iterator
      clockwise = -1; // draw clockwise for aligned right. Else Anticlockwise

    if (flipped) {
      startAngle = 180;
      inwardFacing = false;
    }

    startAngle *= Math.PI / 180; // convert to radians

    // Calc heigt of text in selected font:
    var d = document.createElement("div");
    d.style.fontFamily = this.fontFamily;
    d.style.whiteSpace = "nowrap";
    d.style.fontSize = this.fontSize + "px";
    d.style.fontWeight = this.fontWeight;
    d.style.fontStyle = this.fontStyle;
    d.textContent = text;
    document.body.appendChild(d);
    var textHeight = d.offsetHeight;
    document.body.removeChild(d);

    canvas.width = canvas.height = diameter;
    ctx.font = this._getFontDeclaration();

    // Reverse letters for center inward.
    if (inwardFacing) {
      text = text.split("").reverse().join("");
    }

    // Setup letters and positioning
    ctx.translate(diameter / 2, diameter / 2); // Move to center
    startAngle += Math.PI * !inwardFacing; // Rotate 180 if outward
    ctx.textBaseline = "middle"; // Ensure we draw in exact center
    ctx.textAlign = "center"; // Ensure we draw in exact center

    // rotate 50% of total angle for center alignment
    for (x = 0; x < text.length; x++) {
      cw = ctx.measureText(text[x]).width;
      startAngle +=
        ((cw + (x == text.length - 1 ? 0 : kerning)) /
          (diameter / 2 - textHeight) /
          2) *
        -clockwise;
    }

    // Phew... now rotate into final start position
    ctx.rotate(startAngle);

    // Now for the fun bit: draw, rotate, and repeat
    for (x = 0; x < text.length; x++) {
      cw = ctx.measureText(text[x]).width; // half letter
      // rotate half letter
      ctx.rotate((cw / 2 / (diameter / 2 - textHeight)) * clockwise);
      // draw the character at "top" or "bottom"
      // depending on inward or outward facing

      // Stroke
      if (this.strokeStyle && this.strokeWidth) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.strokeWidth;
        ctx.miterLimit = 2;
        ctx.strokeText(
          text[x],
          0,
          (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2)
        );
      }

      // Actual text
      ctx.fillStyle = fill;
      ctx.fillText(
        text[x],
        0,
        (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2)
      );

      ctx.rotate(
        ((cw / 2 + kerning) / (diameter / 2 - textHeight)) * clockwise
      ); // rotate half letter
    }

    this._cachedCanvas = canvas;
    this._needsRecalculate = false;
    return this._cachedCanvas;
  },

  _set: function (key, value) {
    this.callSuper("_set", key, value);
    this._needsRecalculate = true;
  },

  _updateObj(key, value) {
    switch (key) {
      case "scaleX":
        this.fontSize *= value;
        this.diameter *= value;
        this.width *= value;
        this.scaleX = 1;
        if (this.width < 1) {
          this.width = 1;
        }
        break;

      case "scaleY":
        this.height *= value;
        this.scaleY = 1;
        if (this.height < 1) {
          this.height = 1;
        }
        break;

      default:
        this.callSuper("_set", key, value);
        break;
    }
    this._needsRecalculate = true;
  },

  refreshCtx(bool = false) {
    this._refresh = bool;
  },

  _render: function (ctx) {
    if (!this._refresh && this._cachedCanvas) {
      ctx.drawImage(
        this._cachedCanvas,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      return;
    }

    if (!this._cachedCanvas || this._needsRecalculate) {
      var canvas = this.getCircularText();
      canvas = this._trimCanvas(canvas);

      this.set("width", canvas.width);
      this.set("height", canvas.height);
    }

    ctx.drawImage(
      canvas,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    this.setCoords();
  },

  toObject: function (propertiesToInclude) {
    return this.callSuper(
      "toObject",
      [
        "text",
        "diameter",
        "kerning",
        "flipped",
        "fill",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "strokeStyle",
        "strokeWidth",
      ].concat(propertiesToInclude)
    );
  },
});

//#endregion Text Curved

class EditorScreen {
  constructor() {
    this.canvasBG = "#ffffff";
    this.canvas = new fabric.Canvas("c", { backgroundColor: this.canvasBG });
    this.loadedFonts = {};
    this.magnifier = new fabric.Canvas("magnifier", {
      backgroundColor: this.canvasBG,
    });
    CanvasGuides(this.canvas); // Init Canvas Guides

    this.loadedIcons = {};
    this.activeSection = "";
    this.textMode = querySelect('.nav-item[data-name="text"]');
    this.logoMode = querySelect('.nav-item[data-name="logo"]');
    this.uploadsMode = querySelect('.nav-item[data-name="upload"]');
    this.backgroundMode = querySelect('.nav-item[data-name="background"]');
    this.previewMode = querySelect('.nav-item[data-name="preview"]');
    this.galleryMode = querySelect('.nav-item[data-name="gallery"]');
    this.logoName = "My Brand Name";
    this.sloganName = "Slogan goes here";
    this.rotateRange = querySelect("#rotate-bar");
    this.saveBtn = querySelect("#save-btn");
    this.scaleRange = querySelect("#progress-bar");
    this.scaleRangeUploads = querySelect("#progress-bar-uploads");
    this.scaleElement = querySelect("#scale-value");
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
    let self = this;

    // querySelect("#logoMainField").addEventListener("input", (e) => {
    //   try {
    //     const val = e.target.value;
    //     params.set("logo", val);
    //     const updatedURL = url.origin + url.pathname + "?" + params.toString();
    //   } catch (err) {
    //     console.log(err)
    //   }
    // });

    querySelect("#logoMainField").addEventListener("change", (e) => {
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
    // querySelect("#sloganNameField").addEventListener("input", (e) => {
    //   try {
    //     const val = e.target.value;
    //     params.set("slogan", val);
    //     const updatedURL = url.origin + url.pathname + "?" + params.toString();
    //   } catch (error) { }
    // });

    querySelect("#sloganNameField").addEventListener("change", (e) => {
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
          "center"
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

    this.canvas.setBackgroundImage(
      "/static/pattern.png",
      this.canvas.renderAll.bind(this.canvas),
      {
        opacity: 0.6,
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        scaleX: 0.3,
        scaleY: 0.3,
      }
    );

    this.canvas.on("after:render", () => {
      querySelect("#loader_font").style.display = "none";
    });
  }
  // Hide all positioning line
  hideCanvasGuides() {
    // Get positionlines objects ids in array
    let positionlines = this.canvas._objects.filter(
      (obj) => obj.isPositioningLine
    );
    // Hide all positionlines
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
        (i) => i.style.display !== "none"
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

    const setCanvasBackground = () => {
      this.canvas.setBackgroundImage(
        "/static/pattern.png",
        this.canvas.renderAll.bind(this.canvas),
        {
          opacity: 0.6,
          originX: "left",
          originY: "top",
          top: 0,
          left: 0,
          scaleX: 0.3,
          scaleY: 0.3,
        }
      );
    };

    setCanvasBackground();

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
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
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

    //#region Select Boxes

    // Font Family
    querySelect(".font-family-selectbox").addEventListener(
      "change",
      function () {
        let family = this.getAttribute("data-value"),
          loaded = this.getAttribute("data-loaded"),
          obj = self.canvas.getActiveObject(),
          currCoordinate = obj.getCenterPoint();
        if (!obj) return false;

        if (loaded == "false") {
          WebFont.load({
            google: {
              families: [family],
            },
            active: function () {
              obj.set("fontFamily", family);
              self.canvas.renderAll();
            },
          });
        } else obj.set("fontFamily", family);

        let { variants } = self.loadedFonts[family],
          variantsHtml = "";
        let values = {
          Regular: "normal",
          Bold: "800",
          regular: "normal",
        };

        function formatString(input) {
          let formatted = input.replace(/([0-9]+)/g, "$1 ");

          formatted = formatted.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
          });

          return formatted;
        }

        variants.map((v) => {
          let value = values[v] ? values[v] : v;

          variantsHtml += `<li value="${value}" style="text-transform:capitalize">${formatString(
            value
          )}</li>`;
        });
        let target = querySelect(".font-weight-selector .ms-select-list-menu");
        target.innerHTML = variantsHtml;
        target.removeAttribute("data-init");
        
        target.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", function (e) {
            e.stopPropagation();

            let value = this.getAttribute("value"),
              text = this.innerText,
              parent = this.parentElement.parentElement;
            parent.classList.remove("show");
            let toggleBtn = parent.querySelector(".ms-list-toggle");

            toggleBtn.querySelector(".ms-list-value").innerText = text;
            parent.setAttribute("data-value", value);
            parent.dispatchEvent(new Event("change"));
            this.classList.add("selected");
          });
        });

        obj.setPositionByOrigin(
          new fabric.Point(currCoordinate.x, currCoordinate.y),
          "center",
          "center"
        );
        obj.setCoords();
        self.canvas.requestRenderAll();
        updatePreview();
        self.canvas.save();
      }
    );

    // Font Case
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
          "center"
        );
        obj.setCoords();

        self.canvas.renderAll();
        updatePreview();
        self.canvas.save();
      }
    );

    querySelect(".font-weight-selector").addEventListener(
      "change",
      function () {
        let weight = this.getAttribute("data-value"),
          obj = self.canvas.getActiveObject();
        if (!obj) return false;

        if (weight.includes("italic")) {
          weight = weight.replace("italic", "");
          obj.set("fontStyle", "italic");
          obj.set("fontweightapply", true);
        } else {
          if (obj.get("fontweightapply")) obj.set("fontStyle", "normal");
        }

        obj.set("fontWeight", weight);
        self.canvas.renderAll();
        updatePreview();
        self.canvas.save();
      }
    );

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

    //#endregion Select Boxes

    this.rotateRange.addEventListener("input", (e) => {
      this.isRotating = true;
      this.rotateValue = parseInt(e.target.value, 10);
      querySelect("#rotate_info").innerText = `Rotate: ${parseInt(
        this.rotateValue
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

    this.saveBtn.addEventListener("click", async () => {
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
        this.alignId
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
        true
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

    this.scaleElement.value = 1;
    this.scaleRange.addEventListener("input", (e) => {
      const scaleValue = e.target.value;

      if (scaleValue) {
        if (this.isScaling <= 10) this.isScaling = true;
        this.scaleValue = parseFloat(scaleValue, 10) / 10;
        this.scaleObject();
        this.scaleElement.value = this.scaleValue;
        this.canvas.renderAll();
      }
    });

    querySelect("#scale_up").addEventListener("click", (e) => {
      this.scaleRange.value = parseInt(this.scaleRange.value) + 1;
      this.scaleRange.dispatchEvent(new Event("input"));
    });

    querySelect("#scale_down").addEventListener("click", (e) => {
      this.scaleRange.value = parseInt(this.scaleRange.value) - 1;
      this.scaleRange.dispatchEvent(new Event("input"));
    });

    this.scaleRange.addEventListener("change", function () {
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
          "center"
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
          "center"
        );
        active.setCoords();

        this.canvas.renderAll();
        if (active) this.canvas.save();
        updatePreview();
      }
    });

    this.layers.addEventListener("click", (e) => {
      const target = e.target.closest(".layer-container");

      let id = target.getAttribute("data-id"),
        obj = null;
      this.canvas._objects.forEach((object) => {
        if (object.layerId) {
          if (object.layerId == id) obj = object;
        }
      });
      if (!obj) return false;
      this.canvas.setActiveObject(obj);
      this.canvas.requestRenderAll();
    });

    this.canvas.on("after:render", () => {
      this.rotateObject();
      this.scaleObject();
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

    colorPicker.on("input:end", (color) => {
      updatePreview();
      this.canvas.save();
    });

    const changePickerColors = (element) => {
      const color = Array.isArray(element.get("fill").colorStops)
        ? rgbToHex(element.get("fill").colorStops[0].color)
        : element.get("fill");
      colorPicker.color.set(color);
      captureCanvasState();
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
          querySelect('.nav-item[data-name="text"]').dispatchEvent(
            new Event("click")
          );
          this.activeSection = "text";

          if (activeObject.shadow) {
            // set shadow values
            let { offsetX, offsetY, blur } = activeObject.shadow;
            querySelect("#shadow-blur-slider").value = blur;
            querySelect("#shadow-offsetX-slider").value = offsetX;
            querySelect("#shadow-offsetY-slider").value = offsetY;
            this.shadowBlur = blur;
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
            affectStroke: false;
          }
        } else {
          this.activeSection = "text";

          querySelect('.nav-item[data-name="logo"]').dispatchEvent(
            new Event("click")
          );

          // set shadow values
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

          querySelect("#curve-text").value = percentage;
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
          "font-family-selectbox": "fontFamily",
          "font-weight-selector": "fontWeight",
          "font-style-selector": "fontStyle_",
          "text-case-select-box": "letterCase",
        };
        for (const key in selectBoxes) {
          let el = querySelect(`.${key}`);
          el.setAttribute("data-value", obj[selectBoxes[key]]);
          el.dispatchEvent(new Event("valueChange"));
        }

        // Set Scale

        querySelect("#scale-value").value = obj.scaleValue || 1;
        querySelect("#progress-bar").value = obj.scaleValue
          ? obj.scaleValue * 10
          : 10;

        querySelect("#letter-spacing-slider").value = obj.charSpacing;
        querySelect("#l_spacing_value").value = obj.charSpacing || 0;

        // Set Font Size
        if (obj.fontSize) {
          querySelect("#font_size_title").value = obj.fontSize + "px";
          querySelect("#font_size_range").value = obj.fontSize;
        }
      }
      this.canvas.requestRenderAll();
    };

    this.canvas.on("selection:created", onSelect);
    this.canvas.on("selection:updated", onSelect);
    var logoLayerGroup;

    const textMain = ({
      text,
      fontFamily = "Poppins",
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
      const val = e.target.value;
      // console.log("LOGO MAIN FIELD", val.length)
      this.logoName = val;
      logoNameElement.set("text", val);
      this.canvas.renderAll();
    });
    // Slogan Name
    querySelect("#sloganNameField").addEventListener("input", (e) => {
      const val = e.target.value;
      // console.log("SLOGAN MAIN FIELD", val.length)

      sloganNameElement.set("text", val);
      this.canvas.renderAll();
    });

    const renderCanvas = (SVG) => {
      fabric.loadSVGFromString(SVG, (objects, options) => {
        logoLayerGroup = new fabric.Group(objects, options);

        objects.forEach((obj, idx) => {
          const sloganIdx = objects.length - 1;
          const logoIdx = objects.length - 2;
          if (obj.id && obj.id.includes("external_layer_")) {
            return;
          }
          if (sloganIdx === idx) {
            obj.scale(800);
            sloganNameElement = obj;
            obj.text = querySelect("#sloganNameField").value;
          } else if (logoIdx === idx) {
            obj.scale(800);
            logoNameElement = obj;
            obj.text = querySelect("#logoMainField").value;
          }

          this.canvas.add(obj);
          const layerSection = new CreateLayerSection(this.layers);
          layerSection.create(obj, idx);

          obj.on("mousedown", (e) => {
            this.isFlipY = obj.get("flipY");
            this.isFlipX = obj.get("flipX");
            querySelect("#flip-y").checked = this.isFlipY;
            querySelect("#flip-x").checked = this.isFlipX;

            const hasShadow = !!obj?.shadow?.blur;
            querySelect("#logo-drop-shadow").checked = hasShadow;
            if (!hasShadow)
              querySelect("#logo-shadow-adjust").classList.remove("active");
            isLogoShadowAdjust = hasShadow;
            if (!hasShadow) {
              querySelect("#logo-shadow-adjust").style.display = "none";
              querySelect("#logo-shadow-blur").style.display = "none";
              querySelect("#logo-shadow-offsetX").style.display = "none";
              querySelect("#logo-shadow-offsetY").style.display = "none";
              querySelect("#logo-shadow-border").style.display = "none";
            } else {
              querySelect("#logo-shadow-adjust").style.display = "block";
              querySelect("#logo-shadow-blur").style.display = "block";
              querySelect("#logo-shadow-offsetX").style.display = "block";
              querySelect("#logo-shadow-offsetY").style.display = "block";
              querySelect("#logo-shadow-border").style.display = "block";
            }

            querySelect("#rotate_info").innerText = `Rotate: ${parseInt(
              obj.get("angle")
            )}deg`;
            querySelect("#rotate-bar").value = obj.get("angle");

            const rotateAngle = obj.get("angle");
            querySelect("#rotate-bar").value = rotateAngle;

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
            this.canvas.requestRenderAll();
          });
        });

        refreshLayerNames();

        var originalWidth = logoLayerGroup.width;
        var originalHeight = logoLayerGroup.height;

        const fixedWidth = 200;
        const fixedHeight = 200;

        const widthScaleFactor = fixedWidth / originalWidth;
        const heightScaleFactor = fixedHeight / originalHeight;

        logoLayerGroup.set({
          scaleX: widthScaleFactor,
          scaleY: heightScaleFactor,
          width: fixedWidth,
          height: fixedHeight,
        });

        logoLayerGroup.setCoords();
        this.canvas.viewportCenterObject(logoLayerGroup);

        this.initialRotation = {
          centerPoint: logoLayerGroup.getCenterPoint(),
          coords: logoLayerGroup.getCoords(),
        };
        logoLayerGroup.scaleToWidth(widthScaleFactor);

        logoLayerGroup.ungroupOnCanvas();
        this.canvas.renderAll();
      });

      logoNameElement.viewportCenter();
      sloganNameElement.viewportCenter();

      const selection = new fabric.ActiveSelection(this.canvas.getObjects(), {
        canvas: this.canvas,
      });
      this.canvas.setActiveObject(selection);
      this.canvas.discardActiveObject(selection);
      this.canvas.renderAll();
    };

    if (this.logoFile) {
      renderCanvas(this.logoFile);
    }

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

    const putAngleDownIcon = (className, additionalFunction) => {
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-angle-down";
      if (typeof additionalFunction === "function") {
        icon.addEventListener("click", additionalFunction);
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
      onMouseOver(true, this.backgroundMode)
    );
    this.backgroundMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.backgroundMode)
    );
    this.textMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.textMode)
    );
    this.textMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.textMode)
    );
    this.logoMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.logoMode)
    );
    this.uploadsMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.uploadsMode)
    );
    this.logoMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.logoMode)
    );
    this.previewMode.addEventListener("mouseover", () =>
      onMouseOver(true, this.previewMode)
    );
    this.previewMode.addEventListener("mouseleave", () =>
      onMouseOver(false, this.previewMode)
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
            this.canvas.renderAll.bind(this.canvas)
          );
        }
        this.canvas.setBackgroundImage(
          null,
          this.canvas.renderAll.bind(this.canvas)
        );

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
        letterSpacing = letterSpacing.toFixed(1);
        if (letterSpacing < -1) letterSpacing = -1;
        active.set("_cachedCanvas", null);
        active.set("kerning", parseInt(letterSpacing));
        querySelect("#l_spacing_value").value = e.target.value / 10;

        this.canvas.requestRenderAll();
        return false;
      }

      const currCoordinate = active.getCenterPoint();

      active.set("charSpacing", this.letterSpacing);
      querySelect("#l_spacing_value").value = e.target.value / 10;

      active.setPositionByOrigin(
        new fabric.Point(currCoordinate.x, currCoordinate.y),
        "center",
        "center"
      );
      active.setCoords();
      this.canvas.requestRenderAll();
    });


    document.querySelector('#l_spacing_value').addEventListener("change", function (e) {
      let value = e.target.value;
      querySelect("#letter-spacing-slider").value = value * 10;
      querySelect("#letter-spacing-slider").dispatchEvent(new Event("input"));
    });

    querySelect("#letter-spacing-up").addEventListener("click", (e) => {
      let value = parseInt(querySelect("#letter-spacing-slider").value);
      value += 10;
      querySelect("#letter-spacing-slider").value = value;
      querySelect("#letter-spacing-slider").dispatchEvent(new Event("input"));

    });

    querySelect("#letter-spacing-down").addEventListener("click", (e) => {
      let value = parseInt(querySelect("#letter-spacing-slider").value);
      value -= 10;
      querySelect("#letter-spacing-slider").value = value;
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

    querySelect("#shadow-blur-slider")?.addEventListener("change", (e) => {
      this.canvas.save();
    });

    querySelect("#logo-shadow-blur-slider").addEventListener("input", (e) => {
      this.logoShadowBlur = e.target.value;
      const active = this.canvas.getActiveObjects();
      querySelect(
        "#logo-shadow_blur_title"
      ).innerText = ` :${e.target.value}px`;
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

    this.shadowOffsetXSlider.addEventListener("change", (e) => {
      this.canvas.save();
    });
    this.logoShadowOffsetXSlider.addEventListener("change", (e) => {
      this.canvas.save();
    });

    this.logoShadowOffsetXSlider.addEventListener("change", (e) => {
      updatePreview();
      this.canvas.save();
    });

    this.shadowOffsetYSlider.addEventListener("change", (e) => {
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

    this.logoShadowOffsetYSlider.addEventListener("change", (e) => {
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
        // const deleteLayer = new DeleteLayer(
        //   event,
        //   this.canvas,
        //   this.layers,
        //   this.activeLayerIndex
        // );
        // deleteLayer.deleteLayer();
        // localDirFile = null;
      }
    };

    document.onmouseup = (event) => {
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
      logoNameElement.on("mousedown", (e) => {
        e.e.preventDefault();
        this.textSelectorValue = "LogoName";

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
        querySelect("#l_spacing_value").value = (charSpacing / 10) || 0;

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
          const { blur, offsetX, offsetY } = logoNameElement.shadow;

          if (blur && offsetX && offsetY) {
            querySelect("#shadow_blur_title").innerText = ` :${blur}px`;
            querySelect("#shadow-blur-slider").value = blur;
            querySelect("#offset_x_title").innerText = ` :${offsetX}px`;
            querySelect("#shadow-offsetX-slider").value = offsetX;
            querySelect("#offset_y_title").innerText = ` :${offsetY}px`;
            querySelect("#shadow-offsetY-slider").value = offsetY;
          }
        }
        captureCanvasState();
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
        querySelect("#l_spacing_value").value = charSpacing / 10;

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
          const { blur, offsetX, offsetY } = sloganNameElement.shadow;

          if (blur && offsetX && offsetY) {
            querySelect("#shadow_blur_title").innerText = ` :${blur}px`;
            querySelect("#shadow-blur-slider").value = blur;
            querySelect("#offset_x_title").innerText = ` :${offsetX}px`;
            querySelect("#shadow-offsetX-slider").value = offsetX;
            querySelect("#offset_y_title").innerText = ` :${offsetY}px`;
            querySelect("#shadow-offsetY-slider").value = offsetY;
          }
        }

        captureCanvasState();
        this.canvas.requestRenderAll();

        this.activeNavbarSetting = "text";
        this.updateActiveNavbar();
      });
    };
    applyEventListners();

    let captureTimeout = null;

    const captureCanvasState = () => {
      clearTimeout(captureTimeout);
    };

    document.addEventListener("keydown", async (e) => {
      let isCtrlZ = e.ctrlKey && e.key === "z",
        isCtrlY = e.ctrlKey && e.key === "y",
        anyThingRunning = false;

      if (isCtrlZ && !anyThingRunning) {
        await this.canvasHistory.undoChanges();
        anyThingRunning = true;
      }

      if (isCtrlY && !anyThingRunning) {
        await this.canvasHistory.redoChanges();
        anyThingRunning = true;
      }
    });
    querySelect("#font_size_range").addEventListener("change", (event) => {
      updatePreview();
      this.canvas.save();
    });

    querySelect("#font_size_range").addEventListener("input", (event) => {
      const textSize = event.target.value;
      if (textSize > 0) {
        // Use to fixed to remove decimal points
        querySelect("#font_size_title").value = `${textSize}px`;
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
      let percentage = initCurveText();
      querySelect("#curve-text").value = percentage;
    });

    querySelect("#text-curve-range").addEventListener("change", (e) => {
      const obj = this.canvas.getActiveObject();
      if (!obj) return false;
      if (obj.type !== "curved-text") return false;

      obj._updateObj("scaleX", obj.scaleX);
      obj._updateObj("scaleY", obj.scaleY);

      updatePreview();
      this.canvas.save();
    });
    
    querySelect("#text-curve-up").addEventListener("click", (e) => {
      let input = querySelect("#curve-text"),
        value = parseInt(input.value) || 0;
      value += 5;

      input.value = value;
      querySelect("#curve-text").dispatchEvent(new Event("change"));
    });

    querySelect("#text-curve-down").addEventListener("click", (e) => {
      let input = querySelect("#curve-text"),
        value = parseInt(input.value) || 0;

      value -= 5;
      input.value = value;
      querySelect("#curve-text").dispatchEvent(new Event("change"));
    });

    querySelect("#curve-text").addEventListener("change", function (e) {
      let inp = e.target,
        val = parseInt(inp.value);

      if (val > 360) inp.value = 360;
      else if (val < -360) inp.value = -360;

      let value = (parseInt(inp.value) / 360) * 100,
        rangeValue = getRangeFromPercentage(value);

      if (Math.abs(value) > 100) return false;

      let input = querySelect("#text-curve-range");

      input.value = rangeValue;

      initCurveText();
    });

    // Arrow up down event
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

    const initCurveText = () => {
      let obj = this.canvas.getActiveObject();
      if (!obj) return 0;

      let value = querySelect("#text-curve-range").value,
        percentage =
          value >= 2500 ? (value - 2500) / 25 : -((2500 - value) / 25);

      percentage = percentage.toFixed(0);

      if (percentage == -0 || percentage == "-0") percentage = 0;

      if (percentage > 90 || percentage < -90)
        return (percentage * 3.6).toFixed(0);

      let isFlipped = percentage < 0,
        hasCurveApply = parseInt(percentage) != 0;

      if (value >= 2500) value = 2500 - (value - 2500);

      let isCurvedText = obj.type == "curved-text";
      if (hasCurveApply && !isCurvedText) {
        let props = obj.__dimensionAffectingProps,
          options = {
            ...props,
            left: obj.left,
            top: obj.top,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            diameter: value,
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

        if (curvedText.text == querySelect("#logoMainField").value) {
          logoNameElement = curvedText;
        } else if (curvedText.text == querySelect("#sloganNameField").value) {
          sloganNameElement = curvedText;
        }

        applyEventListners();

        curvedText.moveTo(index);
        this.canvas.setActiveObject(curvedText);
        this.canvas.requestRenderAll();
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

      this.canvas.requestRenderAll();

      const angle = (percentage * 3.6).toFixed(0);

      return angle;
    };
    // Get Range From Percentage
    const getRangeFromPercentage = (percentage) => {
      percentage = parseInt(percentage) || 0;
      let rangeValue = 2500;
      if (percentage > 0) rangeValue = 2500 + percentage * 25;
      else if (percentage < 0) rangeValue = 2500 - Math.abs(percentage) * 25;

      return rangeValue;
    };

    //#endregion Text Curve

    querySelect("#font_size_title").addEventListener("change", (event) => {
      let text = event.target.value;
      console.log(text);
      text = parseFloat(text).toFixed(1);
      const fontSize = Number(text.split("px")[0]);
      querySelect("#font_size_range").value = fontSize;
      console.log(fontSize);

      updatePreview();
      this.canvas.save();
      this.canvas.requestRenderAll();
      querySelect("#font_size_title").value = fontSize + "px";
    });

    querySelect("#font_size_title").addEventListener("input", (event) => {
      const text = event.target.value;
      const fontSize = Number(text.split("px")[0]);
      const active = this.canvas.getActiveObject();
      active.fontSize = fontSize;
      querySelect("#font_size_range").value = fontSize;

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
      querySelect("#font_size_title").value = fontResizer + "px";
      this.canvas.requestRenderAll();
      updatePreview();
    };

    querySelect("#font_size_up").addEventListener(
      "click",
      () => void arrowFontResizer("increment")
    );
    querySelect("#font_size_down").addEventListener(
      "click",
      () => void arrowFontResizer("decrement")
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

    const convertFabricColorsToRGB = (canvasObj) => {
      if (!canvasObj || canvasObj.type !== "radial" || !canvasObj.colorStops) {
        console.error("Invalid canvas object or missing color information.");
        return [];
      }

      const colors = canvasObj.colorStops.map((colorStop) => {
        const { color } = colorStop;
        const rgbValues = color.match(/\d+/g);
        if (rgbValues.length !== 3) {
          console.error("Invalid color format:", color);
          return null;
        }
        return `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
      });

      return colors.filter((color) => color !== null);
    };

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
        1 / this.zoomSlider.value
      );
      this.canvas.requestRenderAll();
    });

    querySelect("#copyElement").addEventListener("click", () => {
      let active = this.canvas.getActiveObject(),
        layerEl = null;
      if (active.layerId)
        layerEl = document.querySelector(
          `.layer-container[data-id="${active.layerId}"]`
        );

      if (active.id.includes("external_layer_") && !active.text) {
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
            object.dublicate = true;
            this.canvas.add(object);
            layerEl = document.querySelector(
              `.layer-container[data-id="${active._objects[i].layerId}"]`
            );

            const layerSection = new CreateLayerSection(this.layers);
            let idx = Array.from(this.layers.childNodes).filter(
              (i) => i.style.display !== "none"
            );
            layerSection.create(object, idx.length, layerEl);
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
          // Add Layer
          cloned.set("dublicate", true);
          this.canvas.add(cloned);
          cloned.top += 10;
          cloned.left += 10;

          const layerSection = new CreateLayerSection(this.layers);
          let idx = Array.from(this.layers.childNodes).filter(
            (i) => i.style.display !== "none"
          );
          layerSection.create(cloned, idx.length, layerEl);
          refreshLayerNames();
          this.canvas.save();
        });
      }
      this.canvas.requestRenderAll();
    });

    querySelect("#eyeElement").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject();
      let visibilty = Boolean(activeObj.get("opacity"));
      visibilty = !visibilty;
      activeObj.set("opacity", visibilty ? 1 : 0);
      this.canvas.requestRenderAll();
    });

    querySelect("#removeElement").addEventListener("click", (event) => {
      const activeObj = this.canvas.getActiveObject(),
        self = this;
      if (activeObj) {
        this.canvas.save(); // For Position
        if (activeObj._objects && activeObj._objects.length) {
          activeObj._objects.forEach((obj) => {
            self.canvas.remove(obj);

            if (obj.layerId) {
              let layerEl = querySelect(
                `.layer-container[data-id="${obj.layerId}"]`
              );
              layerEl.style.display = "none";
            }
          });
        }
        this.canvas.remove(activeObj);
        this.canvas.save();
        this.canvas.requestRenderAll();

        if (activeObj.layerId) {
          let layerEl = querySelect(
            `.layer-container[data-id="${activeObj.layerId}"]`
          );
          layerEl.style.display = "none";
        }
        refreshLayerNames();
      }
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
                  "Logo Name or Slogan can not be duplicated"
                );
              } else save = true;

              if (text == querySelect("#sloganNameField").value) {
                save = false;
                return toastNotification(
                  "Logo Name or Slogan can not be duplicated"
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
                "Logo Name or Slogan can not be duplicated"
              );
            }
            if (text == querySelect("#sloganNameField").value) {
              save = false;
              return toastNotification(
                "Logo Name or Slogan can not be duplicated"
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
      if (!activeObj) return true;
      let visibilty = Boolean(activeObj.get("opacity"));
      visibilty = !visibilty;
      activeObj.set("opacity", visibilty ? 1 : 0);
      this.canvas.renderAll();
      updatePreview();
      if (activeObj) this.canvas.save();
    });

    querySelect("#removeElement2").addEventListener("click", () => {
      const activeObj = this.canvas.getActiveObject(),
        self = this;
      if (activeObj) {
        this.canvas.save(); // For Position
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

    querySelect("#copyElement-uploads").addEventListener("click", (event) => {
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

    const palleteComponent = querySelect("#bg-pallete");
    palleteComponent.addEventListener("colorChanged", () => {
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
        setCanvasBackground();
        this.canvas.setBackgroundColor(
          "#eeeeee",
          this.canvas.renderAll.bind(this.canvas)
        );
        this.canvas.requestRenderAll();
      } else {
        color = solidValue;
      }

      this.canvas.backgroundColor = color;
      querySelect(
        ".color-palette-gradient"
      ).style.background = `linear-gradient(${angleColor}, ${grad1Value}, ${grad2Value})`;

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

    const logoPalleteComponent = querySelect("#logo-pallete");
    logoPalleteComponent.addEventListener("colorChanged", () => {
      updatePreview();
      this.canvas.save();
    });

    logoPalleteComponent.addEventListener("colorChange", (e) => {
      const selectedObject = this.canvas.getActiveObject();
      const { colorMode, grad1Value, grad2Value, solidValue, colorAngle } =
        e.detail;
      // console.log(selectedObject);
      let angleColor = `${colorAngle}deg`;
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
      console.log(color);
      this.canvas.requestRenderAll();
    });

    const textPalleteComponent = querySelect("#text-pallete");
    textPalleteComponent.addEventListener("colorChanged", () => {
      updatePreview();
      this.canvas.save();
    });

    textPalleteComponent.addEventListener("colorChange", (e) => {
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
      setCanvasBackground();
      this.canvas.setBackgroundColor(
        this.canvasBG,
        this.canvas.renderAll.bind(this.canvas)
      );
      querySelect(".preview-modal-bg").style.display = "none";
    });

    querySelect("#overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("overlay")) {
        setCanvasBackground();
        this.canvas.setBackgroundColor(
          "#eee",
          this.canvas.renderAll.bind(this.canvas)
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

    document.getElementById("close-btn").addEventListener("click", (e) => {
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

    let currIconIndex = 0,
      iconList;
    querySelect("#loader_main").style.display = "block";

    axios
      .get(iconUrl)
      .then((resp) => {
        iconList = resp.data.CategoryWiseIcon;
        iconList.forEach((icon, index) => {
          let catslug = icon.category.iconcategory_slug;
          this.loadedIcons[catslug] = {};
          icon.Icons.forEach((i) => {
            this.loadedIcons[catslug][i.id] = {
              id: i.id,
              svg: i.icon_svg,
            };
          });
          if (!icon.Icons[currIconIndex]) return true;
          let { icon_svg, id } = icon.Icons[currIconIndex];
          const name = icon.category.iconcategory_name;
          const categoryTitle = querySelect("#category_type_title");

          const span = document.createElement("span");
          span.setAttribute("index", index);
          span.classList.add("search-icon-category-text");
          span.innerText = name;
          categoryTitle.append(span);

          const svgImg = svgCreator(icon_svg, name);
          svgImg.setAttribute("data-id", id);
          svgImg.setAttribute("data-category", icon.category.iconcategory_slug);
          querySelect("#clip-icons").appendChild(svgImg);
        });

        fetchCanvasData(this.canvas).then((bgColor, _, svgData) => {
          if (!sessionStorage.getItem("reloaded")) {
            sessionStorage.setItem("reloaded", "true");
            location.reload();
          }
          if (bgColor?.bg?.includes(",")) {
            const colorGrad = bgColor.bg.split(",");
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
            bgColor.bg === "transparent"
              ? this.canvas.setBackgroundColor("#ffffff")
              : this.canvas.setBackgroundColor(bgColor.bg);
          }

          this.canvas.renderAll();
          this.alignId = +bgColor.logoPosition;
          updatePreview();

          // Init Undo Redo
          setTimeout(() => {
            this.canvasHistory = new SaveHistory(this.canvas); // Init Undo Redo
            querySelect("#loader_main").style.display = "none";
            updatePreview();
            this.canvas.save(); // Save Initial History
          }, 1000);
          document.getElementById("top_bottom_1").click();
          this.canvas.renderAll();
        });
      })
      .catch((error) => {
        console.error("Error fetching icons:", error);
      });

    querySelect("#category_type_title").addEventListener("click", (e) => {
      querySelect("#clip-icons").innerHTML = null;
      const index = e.target.getAttribute("index");
      const currIndexIcons = iconList[index].Icons;
      let count = 0;
      currIndexIcons.forEach((icon) => {
        let cat_id = icon.icon_category_id;
        const name = iconList[index].category.iconcategory_slug,
          id = icon.id;

        const svgImg = svgCreator(
          icon.icon_svg,
          iconList[index].category.iconcategory_name
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
      let img = e.target,
        itemId = img.getAttribute("data-id"),
        category = img.getAttribute("data-category");
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

        img.on("mousedown", (event) => {
          // console.log(
          //   "Clicked on object with ID:",
          //   event.target.id,
          //   event.target.top,
          //   event.target.left
          // );
          canvas.renderAll();
        });
      });

      layerCounter++;
      document.getElementById("popup-parent-icons").style.display = "none";
      document
        .querySelector(".close-popup-btn")
        .dispatchEvent(new Event("click"));
      canvas.save();
    });

    querySelect("#add-clip-text").addEventListener("click", (e) => {
      querySelect("#popup-parent").style.display = "block";
      querySelect("#popup-parent-icons").style.display = "none";
    });

    querySelect(".close-popup-btn").addEventListener("click", (e) => {
      querySelect("#popup-parent").style.display = "none";
    });
    querySelect("#trigger-clip-text").addEventListener("click", (e) => {
      querySelect("#add-clip-text").dispatchEvent(new Event("click"));
    });

    querySelect("#add-icon").addEventListener("click", () => {
      querySelect("#popup-parent").style.display = "block";
      querySelect("#popup-parent-icons").style.display = "block";
    });

    querySelect(".item-title").addEventListener("click", (e) => {
      const IText = new fabric.IText("Add Text", { fontFamily: "Poppins" });
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
          new Event("input")
        );
        querySelect("#logo-shadow-offsetX-slider").dispatchEvent(
          new Event("input")
        );
        querySelect("#logo-shadow-offsetY-slider").dispatchEvent(
          new Event("input")
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

    const canvasObjects = this.canvas.getObjects();
    const textPalette = querySelect("#logo_text_colors_pallete");

    const solidColorMode = querySelect("#solid_color_mode");
    const pickerColorMode = querySelect("#picker_color_mode");

    const solidColorTextMode = querySelect("#solid_color_text_mode");
    const pickerColorTextMode = querySelect("#picker_color_text_mode");

    const getParsedColor = (color) => {
      if (color && typeof color === "string") {
        if (color?.includes("#")) {
          return color;
        } else if (color && color.colorStops) {
          return rgbToHex(color?.colorStops[0]?.color);
        } else {
          return rgbToHex(color);
        }
      }
    };

    const updateColorPickers = () => {
      for (let i = 0; i <= 1; i++) {
        let colorSet = new Set();
        const colorPalette = querySelectAll("#logo_colors_pallete")[i];

        canvasObjects.forEach((item) => {
          let itemFill = item.get("fill");
          const colPicker = document.createElement("div");

          if (getParsedColor(itemFill) !== undefined) {
            let color = getParsedColor(itemFill);
            color = color.padEnd(7, "0");

            if (!colorSet.has(color)) {
              colorSet.add(color);
              colPicker.setAttribute("id", "color-layers-pickers");

              colPicker.style.background = itemFill;
              colPicker.className = "color-picker";
              colPicker.style.borderRadius = "5px";
              colorPalette.append(colPicker);
              if (color.includes("#ffffff")) {
                colPicker.style.border = "1px solid #aaaaaa";
              }
            }
            colPicker.addEventListener("click", (event) => {
              const color = rgbToHex(event.target.style.backgroundColor);
              const activeElem = this.canvas.getActiveObject();

              if (activeElem && activeElem._objects)
                activeElem._objects.forEach((obj) => {
                  obj.set("fill", color);
                  // console.log(obj);
                });

              activeElem.set("fill", color);
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
              if (activeElem) this.canvas.save();
            });
          }
        });
      }
      captureCanvasState();
    };

    updateColorPickers();

    colorPicker.on("color:init", (color) => {
      color.set(pickerDefaultColor);
    });

    let colorChanging = false;
    colorPicker.on("input:change", (color) => {
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

      const active = this.canvas.getActiveObject();
      if (active && active._objects) {
        active._objects.forEach((i) => {
          i.set("fill", color.rgbaString);
        });
      }
      active.set("fill", color.rgbaString);

      const logoColorPickers = querySelectAll("#color-layers-pickers");
      logoColorPickers.forEach((i) => i.remove());
      updateColorPickers();
      this.canvas.requestRenderAll();
      colorChanging = false;
    });

    ["#R", "#G", "#B"].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        let r = querySelect("#R").value;
        let g = querySelect("#G").value;
        let b = querySelect("#B").value;
        colorPicker.color.rgb = { r, g, b };
        const a = this.canvas.getActiveObject();
        if (a && a._objects) {
          a._objects.forEach((i) => {
            i.set("fill", colorPicker.color.hexString);
          });
        }
        a.set("fill", colorPicker.color.hexString);
        this.canvas.requestRenderAll();
      });
    });

    ["#H", "#S", "#L"].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        let h = querySelect("#H").value;
        let s = querySelect("#S").value;
        let l = querySelect("#L").value;
        colorPicker.color.hsl = { h, s, l };
        const a = this.canvas.getActiveObject();
        if (a && a._objects)
          a._objects.forEach((i) => {
            i.set("fill", colorPicker.color.hexString);
          });
        a.set("fill", colorPicker.color.hexString);
        this.canvas.requestRenderAll();
      });
    });

    ["#R2", "#G2", "#B2"].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        let r = querySelect("#R2").value;
        let g = querySelect("#G2").value;
        let b = querySelect("#B2").value;
        colorPickerText.color.rgb = { r, g, b };
        const a = this.canvas.getActiveObject();
        if (a._objects)
          a._objects.forEach((i) => {
            i.set("fill", colorPickerText.color.hexString);
          });
        a.set("fill", colorPickerText.color.hexString);
        this.canvas.requestRenderAll();
      });
    });

    ["#H2", "#S2", "#L2"].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        let h = querySelect("#H2").value;
        let s = querySelect("#S2").value;
        let l = querySelect("#L2").value;
        colorPickerText.color.hsl = { h, s, l };
        const a = this.canvas.getActiveObject();

        if (a._objects)
          a._objects.forEach((i) => {
            i.set("fill", colorPickerText.color.hexString);
          });

        a.set("fill", colorPickerText.color.hexString);
        this.canvas.requestRenderAll();
      });
    });

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
      console.log(hex);
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

    const solidColorEvent = () => {
      querySelect("#picker_color_mode").classList.remove("category_selected");
      querySelect("#solid_color_mode").classList.add("category_selected");
      querySelect("#solid_color_items").style.display = "flex";
      querySelect("#picker_color_items").style.display = "none";
      openPickerView = "none";
    };

    const pickerColorEvent = () => {
      querySelect("#solid_color_items").style.display = "none";
      querySelect("#picker_color_items").style.display = "flex";
      querySelect("#solid_color_mode").classList.remove("category_selected");
      querySelect("#picker_color_mode").classList.add("category_selected");
      querySelect("#picker_color_items").style.marginTop = "8px";
      openTextPickerView = "block";
    };

    const solidTextColorEvent = () => {
      querySelect("#picker_color_text_mode").classList.remove(
        "category_selected"
      );
      querySelect("#solid_color_text_mode").classList.add("category_selected");
      querySelect("#solid_color_items_text").style.display = "flex";
      querySelect("#picker_color_items_text").style.display = "none";
      openPickerView = "none";
    };

    const pickerTextColorEvent = () => {
      querySelect("#solid_color_items_text").style.display = "none";
      querySelect("#picker_color_items_text").style.display = "flex";
      querySelect("#solid_color_text_mode").classList.remove(
        "category_selected"
      );
      querySelect("#picker_color_text_mode").classList.add("category_selected");
      querySelect("#picker_color_items_text").style.marginTop = "8px";
      openTextPickerView = "block";
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
        "category_selected"
      );
      querySelect("#solid_color_text_modeBG").classList.add(
        "category_selected"
      );

      querySelect("#bg_solid_color_items_text").style.display = "flex";
      querySelect("#bg_picker_color_items_text").style.display = "none";
      openPickerViewBG = "none";
    };

    const pickerTextColorEventBG = () => {
      querySelect("#bg_solid_color_items_text").style.display = "none";
      querySelect("#bg_picker_color_items_text").style.display = "flex";

      querySelect("#solid_color_text_modeBG").classList.remove(
        "category_selected"
      );
      querySelect("#picker_color_text_modeBG").classList.add(
        "category_selected"
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

    [("#R_BG", "#G_BG", "#B_BG")].forEach((id) => {
      querySelect(id).addEventListener("input", () => {
        const r = querySelect("#R_BG").value;
        const g = querySelect("#G_BG").value;
        const b = querySelect("#B_BG").value;
        colorPickerBG.color.rgb = { r, g, b };
        const bgColor = colorPickerBG.color.hexString;
        // console.log(bgColor);
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
      removeClasses = true
    ) => {
      if (removeClasses)
        document
          .querySelectorAll(".bg-settings-container .color_mode_title")
          .forEach((i) => i.classList.remove("active"));

      querySelect(element1 + "_view_BG").classList.remove(
        "color_mode_title-active"
      );
      querySelect(element1 + "_view_BG").style.display = "none";

      querySelect(element2 + "_view_BG").classList.remove(
        "color_mode_title-active"
      );
      querySelect(element2 + "_view_BG").style.display = "none";

      querySelect(activeElement + "_view_BG").classList.add(
        "color_mode_title-active"
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
      console.log(color);

      changeBgColorInputValues(color);
      colorChangingBG = false;
    });

    colorPickerBG.on("input:end", (color) => {
      updatePreview();
      this.canvas.save();
    });

    solidColorEvent();
    solidTextColorEvent();

    solidColorMode.addEventListener("click", solidColorEvent);
    pickerColorMode.addEventListener("click", pickerColorEvent);

    solidColorTextMode.addEventListener("click", solidTextColorEvent);
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
        if (activeObj._objects)
          activeObj._objects.forEach((i) => i.set("fill", color));
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
      }
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
      }
    );

    querySelectAll("#solid_color").forEach((item) => {
      item.addEventListener("click", (event) => {
        if (this.canvas) {
          const activeObj = this.canvas.getActiveObject();
          if (activeObj) {
            const bgColor = event.target.style.backgroundColor;
            const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bgColor);
            if (match) {
              const green = parseInt(match[2]);
              const red = parseInt(match[1]);
              const blue = parseInt(match[3]);
              const hexColor = convertRGBtoHex(red, green, blue);
              if (activeObj._objects) {
                activeObj._objects.forEach((i) => {
                  i.set("fill", hexColor);
                });
              }
              activeObj.set("fill", hexColor);
              colorPicker.color.set(hexColor);

              const logoColorPickers = querySelectAll("#color-layers-pickers");
              logoColorPickers.forEach((i) => i.remove());
              updateColorPickers();
              this.canvas.renderAll();
              updatePreview();
              captureCanvasState();
              this.canvas.save();
            }
          }
        }
      });
    });

    querySelectAll("#solid_color_text").forEach((item) => {
      item.addEventListener("click", (event) => {
        if (this.canvas) {
          const activeObj = this.canvas.getActiveObject();
          if (activeObj) {
            const bgColor = event.target.style.backgroundColor;
            const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bgColor);
            if (match) {
              const red = parseInt(match[1]);
              const green = parseInt(match[2]);
              const blue = parseInt(match[3]);
              const hexColor = convertRGBtoHex(red, green, blue);
              activeObj.set("fill", hexColor);
              colorPickerText.color.set(hexColor);
              this.canvas.renderAll();
              updatePreview();
              captureCanvasState();
              this.canvas.save();
              changeColorPickerText(colorPickerText.color);
            }
          }
        }
      });
    });

    querySelectAll("#solid_color-bg").forEach((item) => {
      item.addEventListener("click", (event) => {
        if (this.canvas) {
          const bgColor = event.target.style.backgroundColor;
          const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bgColor);
          if (match) {
            const red = parseInt(match[1]);
            const green = parseInt(match[2]);
            const blue = parseInt(match[3]);
            const hexColor = convertRGBtoHex(red, green, blue);
            this.canvas.setBackgroundColor(hexColor);

            const logoColorPickers = querySelectAll("#color-layers-pickers");
            logoColorPickers.forEach((i) => i.remove());
            updateColorPickers();
            this.canvas.renderAll();
            captureCanvasState();
            this.canvas.save();
          }
          updatePreview();
        }
      });
    });

    const updateColorTextPickers = () => {
      let itemFill, colPicker;
      canvasObjects.forEach((item) => {
        itemFill = item.get("fill");

        colPicker = document.createElement("input");
        colPicker.setAttribute("id", "color-layers-pickers");
        colPicker.setAttribute("type", "color");

        if (typeof itemFill === "string") {
          colPicker.setAttribute("value", itemFill);
        } else {
          const gradientColor = itemFill.colorStops[0].color;
          const rgbValues = gradientColor.match(/\d+/g);
          if (rgbValues && rgbValues.length === 3) {
            const hexColor = convertRGBtoHex(
              parseInt(rgbValues[0]),
              parseInt(rgbValues[1]),
              parseInt(rgbValues[2])
            );
            colPicker.setAttribute("value", hexColor);
          }
        }

        colPicker.className = "color-picker";
        colPicker.style.borderRadius = "5px";

        colPicker.addEventListener("input", (event) => {
          const color = event.target.value;
          item.set("fill", color);
          this.canvas.requestRenderAll();
        });
      });
      captureCanvasState();
      updatePreview();
    };

    updateColorTextPickers();

    colorPickerText.on("color:init", (color) => {
      color.set(pickerDefaultColor);
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
      updateColorPickers();
      this.canvas.requestRenderAll();
    };
    colorPickerText.on("input:change", changeColorPickerText);
    colorPickerText.on("input:move", changeColorPickerText);
    colorPickerText.on("input:end", () => {
      updatePreview();
      this.canvas.save();
    });

    const handleColorModeClick = (activeElement, element1, element2) => {
      querySelect(element1 + "_view").classList.remove(
        "color_mode_title-active"
      );
      querySelect(element1 + "_view").style.display = "none";

      querySelect(element2 + "_view").classList.remove(
        "color_mode_title-active"
      );
      querySelect(element2 + "_view").style.display = "none";

      querySelect(activeElement + "_view").classList.add(
        "color_mode_title-active"
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
              !i.text && !i?.dublicate && !i.id?.includes("external_layer_")
          ),
        {
          canvas: this.canvas,
        }
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
      this.canvas.setBackgroundColor(this.canvasBG);
      updatePreview();
      this.canvas.requestRenderAll();
      captureCanvasState();
    });

    const discardSelectionForAlignments = () => {
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
    };

    function setlogoPosition(position, canvas) {
      if (!canvas) throw new Error("Canvas", canvas);
      switch (position) {
        case "1":
          centerAndResizeElements(
            "topBottom",
            46,
            22,
            "center",
            1.3,
            1.45,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "2":
          centerAndResizeElements(
            "topBottom",
            40,
            20,
            "center",
            1.3,
            1.45,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "3":
          centerAndResizeElements(
            "topBottom",
            46,
            22,
            "center",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "4":
          centerAndResizeElements(
            "bottomTop",
            46,
            22,
            "center",
            3.8,
            5.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "5":
          centerAndResizeElements(
            "bottomTop",
            40,
            18,
            "center",
            3.5,
            5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "6":
          centerAndResizeElements(
            "bottomTop",
            46,
            22,
            "center",
            3.3,
            4.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "7":
          centerAndResizeElements(
            "leftRight",
            32,
            25,
            "center",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "8":
          centerAndResizeElements(
            "leftRight",
            32,
            25,
            "left",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "9":
          centerAndResizeElements(
            "leftRight",
            32,
            25,
            "left",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "10":
          centerAndResizeElements(
            "rightLeft",
            32,
            25,
            "center",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "11":
          centerAndResizeElements(
            "rightLeft",
            32,
            25,
            "left",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "12":
          centerAndResizeElements(
            "rightLeft",
            32,
            25,
            "center",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "13":
          centerAndResizeElements(
            "topBottom",
            46,
            22,
            "center",
            1.32,
            1.5,
            true,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "14":
          centerAndResizeElements(
            "leftRight",
            32,
            25,
            "center",
            1.32,
            1.5,
            true,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
        case "15":
          centerAndResizeElements(
            "rightLeft",
            32,
            25,
            "center",
            1.32,
            1.5,
            true,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;

        default:
          scaleLogo(200);
          centerAndResizeElements(
            "topBottom",
            46,
            22,
            "center",
            1.32,
            1.5,
            false,
            canvas,
            logoNameElement,
            sloganNameElement
          );
          break;
      }
      canvas.requestRenderAll();
    }

    var logoPosition;
    var external_layer;
    var external_text;
    var external_img;

    async function fetchCanvasData(canvas) {
      querySelect("#loader_main").style.display = "block";
      const logoId = querySelect("#logo_id").value;
      if (!logoId) return toastNotification("Error!! Logo ID Not Found");

      let response;
      const apiCheckValue = querySelect("#api_check").value;
      if (apiCheckValue === "1") {
        response = await axios.get(
          `https://www.mybrande.com/api/find/logo/${logoId}`
        );
      } else {
        response = await axios.get(
          `https://www.mybrande.com/api/find/logo/buyer/${logoId}`
        );
      }

      const bg = response.data?.AllData?.logo_backgroundcolor;
      logoPosition = response.data?.AllData?.logo_position;
      const svgData = response.data?.AllData?.svg_data;

      external_layer = response.data?.AllData?.externalLayerElements;
      external_text = response.data?.AllData?.externalTextElements;
      external_img = response.data?.AllData?.images;
      // console.log("EXTERNAL IMAGE", response.data);
      loadExternalLayers(external_layer, external_text, external_img);

      if (svgData) {
        localStorage.setItem("logo-file", svgData);
      }

      return { bg, logoPosition, svgData: response.data };
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
    };
    let anythingApplied = false;

    for (const singleEl in alignmentOptions) {
      let scaleValue = alignmentOptions[singleEl];
      querySelect(`#${singleEl}`).addEventListener("click", () => {
        if (anythingApplied) return true;
        discardSelectionForAlignments();
        this.alignId = getAttr(`#${singleEl}`, "data-align-id");

        scaleLogo(scaleValue);
        anythingApplied = true;
        // console.log("ALIGN ID", this.alignId)
        setlogoPosition(this.alignId, this.canvas);
        setTimeout(() => {
          this.canvas.save();
          anythingApplied = false;
        }, 100);
      });
    }

    // Load External Layers Function
    const loadExternalLayers = (layers = null, text = null, img = null) => {
      layers = layers ? JSON.parse(layers) : [];
      text = text ? JSON.parse(text) : [];
      img = img ? JSON.parse(img) : [];
      let self = this;

      const externalLayers = [...layers, ...text, ...img];
      if (!externalLayers.length) return false;

      const loadSVGObject = (layer, objects, options) => {
        objects.map((obj) => {
          obj.set({
            fill: layer.fill,
          });
        });

        let img = fabric.util.groupSVGElements(objects, options);
        img.scaleToWidth(layer.cacheWidth);
        img.scaleToHeight(layer.cacheHeight);

        img.set({
          left: layer.left,
          top: layer.top,
          angle: layer.angle,
          scaleX: layer.scaleX,
          scaleY: layer.scaleY,
          opacity: layer.opacity,
          flipX: layer.flipX,
          flipY: layer.flipY,
          selectable: true,
          id: layer.id,
          layerType: layer.layerType,
          fill: layer.fill,
        });

        self.canvas.add(img);

        self.canvas.requestRenderAll();
        return img;
      };

      for (const layer of externalLayers) {
        let { layerType, ext } = layer;
        if (layerType == "text") {
          let textLayer = new fabric.IText(layer.text, layer);
          this.canvas.add(textLayer);
        } else if (ext == "svg") {
          fabric.loadSVGFromURL(layer.dataUrl, (objects, options) => {
            // console.log(layer);
            let img = loadSVGObject(layer, objects, options);
            img.set("dataUrl", layer.dataUrl);
          });
        } else if (layerType === "image") {
          fabric.Image.fromURL(layer.dataUrl, (img) => {
            img.set({
              dataUrl: layer.dataUrl,
              left: layer.left,
              top: layer.top,
              angle: layer.angle,
              scaleX: layer.scaleX,
              scaleY: layer.scaleY,
              opacity: layer.opacity,
              flipX: layer.flipX,
              flipY: layer.flipY,
              selectable: true,
              id: "upload_external_layer_" + uploadLayerCounter,
              layerType: layer.layerType,
              fill: layer.fill,
            });

            this.canvas.add(img);
            this.canvas.requestRenderAll();
            uploadLayerCounter++;
          });
        } else {
          let { category, itemId } = layer;
          if (!category) continue;
          let svgContent = this.loadedIcons[category][parseInt(itemId)];
          if (!svgContent) return false;

          svgContent = svgContent.svg;
          fabric.loadSVGFromString(svgContent, (objects, options) => {
            let img = loadSVGObject(layer, objects, options);
            img.set({
              itemId,
              category,
            });
            this.canvas.requestRenderAll();
          });
        }

        this.canvas.requestRenderAll();
      }
    };
    
    (async () => {
      let response = await fetch(
        "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyA3WEzwS9il6Md6nJW5RI3eMlerTso8tII"
      );
      response = await response.json();
      console.log(response)
      let { items } = response;

      let liItems = "";

      items.forEach((item, i) => {
        let { family } = item,
          loaded = false;
        this.loadedFonts[family] = {
          variants: item.variants,
        };

        if (i < 800) {
          WebFont.load({
            google: {
              families: [family],
            },
          });
          loaded = true;
        }

        liItems += `<li value="${family}" class="font-family-item" data-loaded="${loaded}"><span style="font-family:${family}" class="text">${family}</span></li>`;
      });

      querySelect(".font-family-selectbox .ms-select-list-menu").innerHTML += liItems;
      initMSList();
    })();

    const initMSList = () => {
      let msLists = document.querySelectorAll(".ms-select-list");
      msLists.forEach((list) => {
        let menu = list.querySelector(".ms-select-list-menu"),
          defaultVal = list
            .querySelector(".ms-list-toggle .ms-list-value")
            .getAttribute("value");

        list.setAttribute("data-default-value", defaultVal);

        list
          .querySelector(".ms-list-toggle")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            let lists = document.querySelectorAll(".ms-select-list");
            let parent = this.parentElement;
            lists.forEach((item) =>
              item != parent ? item.classList.remove("show") : item
            );
            parent.classList.toggle("show");
          });

        menu.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", function (e) {
            e.stopPropagation();

            let value = this.getAttribute("value"),
              text = this.innerText,
              parent = this.parentElement.parentElement;
            parent.classList.remove("show");
            let toggleBtn = parent.querySelector(".ms-list-toggle");

            toggleBtn.querySelector(".ms-list-value").innerText = text;
            parent.setAttribute("data-value", value);
            parent.dispatchEvent(new Event("change"));
            this.classList.add("selected");
          });
        });

        list.addEventListener("valueChange", function (e) {
          e.stopPropagation();

          let value = this.getAttribute("data-value"),
            toggleBtn = this.querySelector(".ms-list-toggle");

          let text = this.querySelector(
            `.ms-select-list-menu li[value="${value}"]`
          );
          if (value == "undefined") {
            text = this.getAttribute("data-default-value");
          } else if (text) text = text.innerText;

          toggleBtn.querySelector(".ms-list-value").innerText = text;
        });
      });

      document.onclick = function (e) {
        let target = e.target;
        if (
          !target.classList.contains("ms-select-list") &&
          !target.classList.contains("live-search")
        ) {
          msLists.forEach((list) => list.classList.remove("show"));
        }
      };
    };

    const fontLiveSearch = function (element) {
      let val = element.value.toLowerCase();
      if (!element.hasAttribute("data-target")) return false;
      let targetSelector = element.getAttribute("data-target");
      let radius = element.getAttribute("data-radius") || "body";
      let radiusElement = element.closest(radius);
      if (!radiusElement) return;

      let targets = radiusElement.querySelectorAll(targetSelector);
      targets.forEach((target) => {
        let dataTarget = element.hasAttribute("data-match")
          ? target.querySelector(element.getAttribute("data-match"))
          : target;
        let txt = dataTarget ? dataTarget.textContent : "";
        if (txt) {
          if (txt.toLowerCase().startsWith(val)) {
            target.style.display = "inherit";
          } else target.style.display = "none";
        }
      });
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
