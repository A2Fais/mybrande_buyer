import { fabric } from "fabric";
import { querySelect } from "./selectors";

export const centerAndResizeElements = (
  type,
  logoSize,
  sloganSize,
  textPosition,
  sloganNameTop,
  logoNameTop,
  letterSpaced = false,
  canvas,
  logoNameElement,
  sloganNameElement,
) => {
  const objects = canvas
    ?.getObjects()
    .filter((i) => !i.id?.includes("external_layer_") && !i?.duplicate);
  logoNameElement.charSpacing = 0;
  sloganNameElement.charSpacing = 0;
  const timeout = 5;

  const toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  };

  const windowWidth = window.innerWidth
  const isMobileUser = navigator?.userAgent?.includes("Mobile") && windowWidth < 600

  function triggerSliderEvent(value, obj) {
    obj && canvas.setActiveObject(obj);
    const slider = querySelect("#text-curve-range");
    slider.value = value;
    const event = new Event("input", { bubbles: true });
    slider.dispatchEvent(event);
    canvas.discardActiveObject();
    canvas.renderAll();
  }

  const centerHorizontally = (...elements) => {
    elements.forEach((element) => {
      element.centerH();
    });
  };

  const toSentenceCase = (str) => {
    const stack = [];
    stack.push(str[0].toUpperCase());
    for (let i = 1; i < str.length; i++) {
      stack.push(str[i].toLowerCase());
    }
    return stack.join("");
  };

  let logo = objects.find(
    (obj) =>
      (obj.type === "text" || obj.type === "curved-text") &&
      obj.text.toLowerCase() ===
        querySelect("#logoMainField").value.toLowerCase(),
  );

  let slogan = objects.find(
    (obj) =>
      (obj.type === "text" || obj.type === "curved-text") &&
      obj.text.toLowerCase() ===
        querySelect("#sloganNameField").value.toLowerCase(),
  );

  if (!logo && !slogan) return 

  switch (type) {
    case "topBottom":

    if (isMobileUser) {
      logoNameTop = 1.2
    }

      if (logo.type === "curved-text") {
        const { diameter, _percentage, ...options } = logo;

        const linearText = new fabric.Text(logo.text, options);
        canvas.remove(logo);
        canvas.add(linearText);
        logo = linearText;
        canvas.requestRenderAll();
      }

      if (slogan.type === "curved-text") {
        const { diameter, _percentage, ...sloganOptions } = slogan;

        const linearSloganText = new fabric.Text(slogan.text, sloganOptions);
        canvas.remove(slogan);
        canvas.add(linearSloganText);
        slogan = linearSloganText;
        canvas.requestRenderAll();
      }

      logo.set("fontSize", logoSize);
      slogan.set("fontSize", sloganSize);
      canvas.renderAll();

      const logoTopPosition = canvas.height / logoNameTop;
      const sloganTopPosition = canvas.height / sloganNameTop;

      logo.set("top", logoTopPosition);
      slogan.set("top", sloganTopPosition);
      canvas.renderAll();

      logo.set("charSpacing", 0);
      slogan.set("charSpacing", 0);
      canvas.renderAll();

      if (letterSpaced) {
        logo.text = toTitleCase(logo.text);
        slogan.text = toSentenceCase(slogan.text);

        logo.set("fontFamily", "Poppins");
        slogan.set("fontFamily", "Poppins");

        const logoNameWidth = logo.width;
        slogan.set("width", logoNameWidth);

        slogan.set("charSpacing", 322);
        slogan.set("fontSize", 27);
        canvas.renderAll();

        logo.set("top", (logo.top += 30));
        slogan.set("top", (slogan.top += 60));
      }

      centerHorizontally(logo, slogan);

      const newGrp = new fabric.Group(objects);
      canvas.viewportCenterObject(newGrp);
      newGrp.ungroupOnCanvas();
      canvas.renderAll();
      break;

    case "bottomTop":
      if (logo.type === "curved-text") {
        const { diameter, _percentage, ...options } = logo;

        const linearText = new fabric.Text(logo.text, options);
        canvas.remove(logo);
        canvas.add(linearText);
        canvas.requestRenderAll();
      }

      if (slogan.type === "curved-text") {
        const { diameter, _percentage, ...sloganOptions } = slogan;

        const linearSloganText = new fabric.Text(slogan.text, sloganOptions);
        canvas.remove(slogan);
        canvas.add(linearSloganText);
        canvas.requestRenderAll();
      }

      logo.set("fontSize", logoSize);
      slogan.set("fontSize", sloganSize);
      canvas.renderAll();

      centerHorizontally(logo, slogan);

      const logoTopPos = canvas.height / logoNameTop;
      const sloganTopPos = canvas.height / sloganNameTop;
      logo.set("top", logoTopPos);
      slogan.set("top", sloganTopPos);
      canvas.requestRenderAll();

      canvas.discardActiveObject();
      const objGrp = new fabric.Group(objects);
      canvas.viewportCenterObject(objGrp);
      objGrp.top -= 40;
      objGrp.ungroupOnCanvas();
      canvas.renderAll();
      break;

    case "leftRight":
      setTimeout(() => {
        const logoNameElement = logo;
        const sloganNameElement = slogan;

        logoNameElement.center();
        sloganNameElement.center();

        logoNameElement.set("top", canvas.height / 2.3);
        sloganNameElement.set("top", canvas.height / 1.8);

        logoNameElement.set("fontSize", 46);
        sloganNameElement.set("fontSize", 22);

        logoNameElement.set("charSpacing", 0);
        sloganNameElement.set("charSpacing", 0);
        canvas.renderAll();

        if (textPosition === "left") {
          logoNameElement.viewportCenter();
          sloganNameElement.viewportCenter();

          logoNameElement.set("top", canvas.height / 2.3);
          sloganNameElement.set("top", canvas.height / 1.8);

          if (logoNameElement.text.length <= 40) {
          if (window.innerWidth <= 500) {
            logoNameElement.set("left", canvas.width / 1.2);
          } else {
            logoNameElement.set("left", canvas.width / 1.6);
          }
   
            sloganNameElement.set("left", logoNameElement.left);
          } else {
            logoNameElement.set("left", canvas.width / 2.4);
            sloganNameElement.set("left", logoNameElement.left);
          }
        } else {
          logoNameElement.viewportCenterH();
          sloganNameElement.viewportCenterH();

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", canvas.width / 1.6);

            sloganNameElement.set(
              "left",
              logoNameElement.left +
                (logoNameElement.width - sloganNameElement.width) / 2,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", canvas.width / 1.6);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          } else if (logoNameElement.text.length <= 40) {
            logoNameElement.set("left", canvas.width / 1.6);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          }
        }

        if (letterSpaced) {
          logoNameElement.text = toTitleCase(logoNameElement.text);
          sloganNameElement.text = toSentenceCase(sloganNameElement.text);

          logoNameElement.set("fontFamily", "Poppins");
          sloganNameElement.set("fontFamily", "Poppins");

          sloganNameElement.set("charSpacing", 322);
          sloganNameElement.set("fontSize", 27);
          canvas.renderAll();

          logoNameElement.set("left", canvas.width / 1.6);
          sloganNameElement.set("left", logoNameElement.left);
        }

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObjectH(newGrp);
        canvas.viewportCenterObjectV(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
      }, timeout);
      break;
    case "rightLeft":
      setTimeout(() => {
        const logoNameElement = logo;
        const sloganNameElement = slogan;

        logoNameElement.center();
        sloganNameElement.center();

        logoNameElement.set("top", canvas.height / 2.3);
        sloganNameElement.set("top", canvas.height / 1.8);

        logoNameElement.set("fontSize", 46);
        sloganNameElement.set("fontSize", 22);

        logoNameElement.set("charSpacing", 0);
        sloganNameElement.set("charSpacing", 0);
        canvas.renderAll();

        if (textPosition === "left") {
          logoNameElement.viewportCenter();
          sloganNameElement.viewportCenter();

          logoNameElement.set("top", canvas.height / 2.3);
          sloganNameElement.set("top", canvas.height / 1.8);

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", -Math.round(canvas.width / 10));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width -
                sloganNameElement.width,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", -Math.round(canvas.width / 3));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width -
                sloganNameElement.width,
            );
          } else if (logoNameElement.text.length <= 40) {
            logoNameElement.set("left", -Math.round(canvas.width / 3.5));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 1.25 -
                sloganNameElement.width / 1.25,
            );
          } else {
            logoNameElement.set("left", canvas.width / 6);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2 -
                sloganNameElement.width / 2,
            );
          }

          if (letterSpaced) {
            logoNameElement.text = toTitleCase(logoNameElement.text);
            sloganNameElement.text = toSentenceCase(sloganNameElement.text);

            logoNameElement.set("fontFamily", "Poppins");
            sloganNameElement.set("fontFamily", "Poppins");

            sloganNameElement.set("charSpacing", 322);
            sloganNameElement.set("fontSize", 27);

            canvas.renderAll();

            const logoNameWidth = logoNameElement.width;
            sloganNameElement?.set("width", logoNameWidth);
          }
        } else {
          logoNameElement.viewportCenterH();
          sloganNameElement.viewportCenterH();

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", -Math.round(canvas.width / 10));

            sloganNameElement.set(
              "left",
              logoNameElement.left +
                (logoNameElement.width - sloganNameElement.width) / 2,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", -Math.round(canvas.width / 3));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2 -
                sloganNameElement.width / 2,
            );
          } else if (logoNameElement.text.length <= 40) {
            logoNameElement.set("left", -(canvas.width / 3));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          }
        }

        if (letterSpaced) {
          logoNameElement.text = toTitleCase(logoNameElement.text);
          sloganNameElement.text = toSentenceCase(sloganNameElement.text);

          logoNameElement.set("fontFamily", "Poppins");
          sloganNameElement.set("fontFamily", "Poppins");

          sloganNameElement.set("charSpacing", 322);
          sloganNameElement.set("fontSize", 27);

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", -Math.round(canvas.width / 10));

            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width -
                sloganNameElement.width,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", -Math.round(canvas.width / 3));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          } else if (logoNameElement.text.length <= 40) {
            logoNameElement.set("left", -(canvas.width / 2.7));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          }
        }

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObjectH(newGrp);
        canvas.viewportCenterObjectV(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
      }, timeout);
      break;

    case "curve_1":
      console.log("CURVE_1");

      function setCurve() {
        logo.set("fontSize", logoSize);
        slogan.set("fontSize", sloganSize);
        canvas.renderAll();

        centerHorizontally(slogan);

        const logoTopPosition = canvas.height / logoNameTop;
        const sloganTopPosition = canvas.height / sloganNameTop;
        logo.set("top", logoTopPosition);
        slogan.set("top", sloganTopPosition);

        canvas.setActiveObject(logo);
        triggerSliderEvent(4500);
        centerHorizontally(logo);

        canvas.setActiveObject(slogan);
        triggerSliderEvent(2500);

        canvas.discardActiveObject();
        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.renderAll();
      }
      setCurve();
      break;

    case "curve_2":
      console.log("CURVE_2");

      function setCurveTwo() {
        logo.set("fontSize", logoSize);
        slogan.set("fontSize", sloganSize);
        canvas.renderAll();

        const logoTopPosition = canvas.height / logoNameTop;
        const sloganTopPosition = canvas.height / sloganNameTop;
        logo.set("top", logoTopPosition);
        slogan.set("top", sloganTopPosition);

        canvas.setActiveObject(logo);
        triggerSliderEvent(500);

        canvas.setActiveObject(slogan);
        triggerSliderEvent(2500);

        centerHorizontally(logo, slogan);
      }
      setCurveTwo();
      break;

    case "curve_3":
      console.log("CURVE_3");

      function setBothCurve() {
        logo.set("fontSize", logoSize);
        slogan.set("fontSize", sloganSize);
        canvas.renderAll();

        centerHorizontally(logo, slogan);

        const logoTopPosition = canvas.height / logoNameTop;
        const sloganTopPosition = canvas.height / sloganNameTop;
        logo.set("top", logoTopPosition);
        slogan.set("top", sloganTopPosition);

        canvas.setActiveObject(slogan);
        triggerSliderEvent(500);

        canvas.setActiveObject(logo);
        triggerSliderEvent(4500);

        canvas.discardActiveObject();
        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.renderAll();
      }
      setBothCurve();
      break;
  }
};
