import axios from "axios";
import { toastNotification } from "./toast_notification";
import { rgbToHex } from "./color_converter";
import { querySelect } from "./selectors";

export function getTextCase(text) {
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
}

export function putAngleDownIcon(className, additionalFunction) {
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-angle-down";
  querySelect(className).append(icon);

  if (typeof additionalFunction === "function") {
    icon.addEventListener("click", additionalFunction);
  }
}

export async function saveCanvas(
  logoId,
  canvas,
  backgroundcolor,
  logoNameElement,
  sloganNameElement,
  alignId,
  isPackage = false,
) {
  let externalLayers = canvas._objects.filter((obj) => {
    return obj.id && obj.id.includes("external_layer_");
  });

  let externalLayerElements = [],
    externalTextElements = [],
    externalImages = [];

  externalLayers.map((layer) => {
    let data = layer.toJSON([
      "itemId",
      "category",
      "cacheHeight",
      "cacheWidth",
      "id",
      "layerType",
      "dataUrl",
      "ext",
    ]);
    if (layer.text) {
      externalTextElements.push(data);
    } else if (layer.id.includes("upload_external_layer_")) {
      externalImages.push(data);
    } else {
      externalLayerElements.push(data);
    }
    canvas.remove(layer);
  });

  const bgColor = canvas.get("backgroundColor");
  // canvas.setBackgroundImage(null);
  canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));

  const currentCanvasSVG = canvas.toSVG();

  const addExternalLayersBackToCanvas = (externalLayers) => {
    return new Promise((resolve) => {
      externalLayers.map((rmObj) => {
        canvas.add(rmObj);
        canvas.renderAll();
      });
      const thumbnailSVG = canvas.toSVG();
      resolve(thumbnailSVG);
    });
  };

  const thumbnailSVG = await addExternalLayersBackToCanvas(externalLayers);

  if (currentCanvasSVG) {
    const getDropShadowValue = (element) => {
      if (!element) return null;
      const { blur, offsetX, offsetY } = element;
      const result = [blur ?? 0, offsetX ?? 0, offsetY ?? 0];
      const resultString = result.join(",");

      for (let i = 0; i < result.length; i++) {
        if (result[i] === result[i + 1]) {
          return "0";
        }
      }

      return resultString;
    };

    const brandColor = logoNameElement.get("fill");
    const sloganColor = sloganNameElement.get("fill");
    const apiCheck = querySelect("#api_check").value;

    const postData = {
      buyer_logo_id: querySelect("#buyer_logo_id")?.value, // from response hidden input field
      buyer_id: querySelect("#buyer_Id")?.value, // hidden input field
      logo_id: logoId, // svg data id
      brand_name: querySelect("#logoMainField").value,
      slogan: querySelect("#sloganNameField").value,
      svg_data: thumbnailSVG, // thumbnailSVG
      editor_svg_data: currentCanvasSVG,
      /* logo_position: alignId, */
      logo_position: 1,
      logo_backgroundcolor: bgColor === "#efefef" ? "transparent" : bgColor,

      brandName_color: !brandColor.includes("#")
        ? rgbToHex(brandColor)
        : brandColor,
      brandName_fontFamely: logoNameElement.get("fontFamily"),
      brandName_fontSize: logoNameElement.get("fontSize"),

      brandName_curve_diameter: logoNameElement.diameter,
      brand_curve_percentage: logoNameElement.get("percentage"),

      brandName_letterCase: getTextCase(logoNameElement.text),
      brandName_fontStyle: logoNameElement.get("fontStyle"),
      brandName_letterSpace: logoNameElement.get("charSpacing") / 10,
      brandName_droupShadow: getDropShadowValue(logoNameElement.get("shadow")),

      slogan_color: !sloganColor.includes("#")
        ? rgbToHex(sloganColor)
        : sloganColor,
      slogan_fontFamely: sloganNameElement.get("fontFamily"),
      slogan_fontSize: sloganNameElement.get("fontSize"),

      slogan_curve_diameter: sloganNameElement.get("diameter"),
      slogan_curve_percentage: sloganNameElement.get("percentage"),

      slogan_letterCase: getTextCase(sloganNameElement.text),
      slogan_fontStyle: sloganNameElement.get("fontStyle"),
      slogan_letterSpace: sloganNameElement.get("charSpacing") / 10,
      slogan_droupShadow: getDropShadowValue(sloganNameElement.get("shadow")),
      externalLayerElements: JSON.stringify(externalLayerElements),
      externalTextElements: JSON.stringify(externalTextElements),
      images: JSON.stringify(externalImages),
      // thumbnail: localStorage?.getItem("thumbnail"),
      api_check: apiCheck,
    };

    try {
      if (canvas.get("backgroundColor") !== null)
        return toastNotification("backgroundColor issue while saving api");
      const response = await axios.post(
        `https://www.mybrande.com/api/buyer/logo/store`,
        postData,
      );
      if (response?.status === 200) {
        const { buyer_logo_id } = response.data;

        if (!buyer_logo_id) {
          return toastNotification("Error encountered with buyer logo ID");
        }

        querySelect("#buyer_logo_id").value = buyer_logo_id;
        canvas.setBackgroundColor(bgColor, canvas.renderAll.bind(canvas));
        // canvas.setBackgroundImage(
        //   "/static/pattern.png",
        //   canvas.renderAll.bind(canvas),
        //   {
        //     opacity: 0.6,
        //     originX: "left",
        //     originY: "top",
        //     top: 0,
        //     left: 0,
        //     scaleX: 0.3,
        //     scaleY: 0.3,
        //   },
        // );
        isPackage
          ? (location.href = `https://www.mybrande.com/buyer/logo/downloadandpayment/${buyer_logo_id}`)
          : (location.href = `https://www.mybrande.com/user/logo/preview/${buyer_logo_id}`);
        toastNotification("Logo Saved Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
