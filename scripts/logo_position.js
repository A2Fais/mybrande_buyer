import { centerAndResizeElements } from "./center_resize";
import { querySelect, querySelectAll } from "./selectors";

function setlogoPosition(
  self,
  { logoPosition, logoNameElement, sloganNameElement, scaleLogo },
) {
  const canvas = self.canvas;
  const position = logoPosition;

  if (!canvas) throw new Error("Canvas", canvas);

  querySelectAll(".right-bar .svg__icon").forEach((i) => {
    i.classList.remove("active");
  });

  querySelect(`.svg__icon[data-align-id="${position}"]`).classList.add(
    "active",
  );

  switch (position) {
    case "1":
      centerAndResizeElements(
        "topBottom",
        46,
        22,
        "center",
        1.2,
        1.38,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "2":
      centerAndResizeElements(
        "topBottom",
        40,
        20,
        "center",
        1.22,
        1.38,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "3":
      centerAndResizeElements(
        "topBottom",
        46,
        22,
        "center",
        1.25,
        1.45,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "4":
      centerAndResizeElements(
        "bottomTop",
        46,
        22,
        "center",
        5.2,
        12,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "5":
      centerAndResizeElements(
        "bottomTop",
        40,
        18,
        "center",
        5.2,
        12,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "6":
      centerAndResizeElements(
        "bottomTop",
        46,
        22,
        "center",
        4.8,
        11,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "7":
      centerAndResizeElements(
        "leftRight",
        32,
        25,
        "center",
        1.1,
        1.8,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
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
        sloganNameElement,
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
        sloganNameElement,
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
        sloganNameElement,
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
        sloganNameElement,
      );
      break;
    case "12":
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
        sloganNameElement,
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
        sloganNameElement,
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
        sloganNameElement,
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
        sloganNameElement,
      );
      break;

    case "16":
      scaleLogo(200);
      centerAndResizeElements(
        "curve_2",
        46,
        32,
        "center",
        1.3,
        8,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      centerAndResizeElements(
        "curve_1",
        46,
        32,
        "center",
        1.3,
        8,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "17":
      centerAndResizeElements(
        "curve_3",
        46,
        32,
        "center",
        5,
        2,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      centerAndResizeElements(
        "curve_2",
        46,
        32,
        "center",
        5,
        2,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
    case "18":
      centerAndResizeElements(
        "curve_3",
        46,
        38,
        "center",
        1.4,
        8,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      centerAndResizeElements(
        "curve_3",
        46,
        38,
        "center",
        1.4,
        8,
        false,
        canvas,
        logoNameElement,
        sloganNameElement,
      );
      break;
  }
  canvas.renderAll();

  self.canvas.updatePreview();
}

export default setlogoPosition;
