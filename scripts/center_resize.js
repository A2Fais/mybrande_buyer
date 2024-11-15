const querySelect = (element) => document.querySelector(element);

const getCurveAngle = (logoNameElement) => {
  const diameter = logoNameElement.get("diameter");
  const per = logoNameElement.get("percentage");
  let percentage =
    diameter >= 2500 ? (diameter - 2500) / 25 : -((2500 - diameter) / 25);
  let angle = (percentage * 3.6).toFixed(0);
  const isPositiveOpening = per < 0 ? false : true;
  return { angle, percentage, isPositiveOpening };
};

export const centerAndResizeElements = (
  type,
  logoSize,
  sloganSize,
  textPosition,
  sloganTop,
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

  const logo = objects.find(
    (obj) =>
      (obj.type === "text" || obj.type === "curved-text") &&
      obj.text.toLowerCase() ===
        querySelect("#logoMainField").value.toLowerCase(),
  );

  const slogan = objects.find(
    (obj) =>
      (obj.type === "text" || obj.type === "curved-text") &&
      obj.text.toLowerCase() ===
        querySelect("#sloganNameField").value.toLowerCase(),
  );

  switch (type) {
    case "topBottom":
      setTimeout(() => {
        const logoNameElement = logo;
        const sloganNameElement = slogan;

        // const { angle, isPositiveOpening } = getCurveAngle(logoNameElement);

        logoNameElement.set("fontSize", logoSize);
        sloganNameElement.set("fontSize", sloganSize);

        canvas.renderAll();

        const logoTopPosition = canvas.height / logoNameTop;
        const sloganTopPosition = canvas.height / sloganTop;

        logoNameElement.set("top", logoTopPosition);
        sloganNameElement.set("top", sloganTopPosition);

        logoNameElement.set("charSpacing", 0);
        sloganNameElement.set("charSpacing", 0);
        canvas.renderAll();

        if (letterSpaced) {
          logoNameElement.text = toTitleCase(logoNameElement.text);
          sloganNameElement.text = toSentenceCase(sloganNameElement.text);

          logoNameElement.set("fontFamily", "Poppins");
          sloganNameElement.set("fontFamily", "Poppins");

          const logoNameWidth = logoNameElement.width;
          sloganNameElement.set("width", logoNameWidth);

          sloganNameElement.set("charSpacing", 322);
          sloganNameElement.set("fontSize", 27);
          canvas.renderAll();

          logoNameElement.set("top", (logoNameElement.top += 30));
          sloganNameElement.set("top", (sloganNameElement.top += 60));
        }

        centerHorizontally(logoNameElement, sloganNameElement);
        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.renderAll();
      }, timeout);
      break;
    case "bottomTop":
      setTimeout(() => {
        const logoNameElement = logo;
        const sloganNameElement = slogan;

        logoNameElement.set("fontSize", logoSize);
        sloganNameElement.set("fontSize", sloganSize);
        canvas.renderAll();

        centerHorizontally(logoNameElement, sloganNameElement);

        const logoTopPosition = canvas.height / logoNameTop;
        const sloganTopPosition = canvas.height / sloganTop;
        logoNameElement.set("top", logoTopPosition);
        sloganNameElement.set("top", sloganTopPosition);

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.renderAll();
      }, timeout);
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
            logoNameElement.set("left", canvas.width / 1.6);
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

        // logoMain.forEach((i) => (i.left += 500));
        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObjectH(newGrp);
        canvas.viewportCenterObjectV(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
      }, timeout);
      break;
  }
};
