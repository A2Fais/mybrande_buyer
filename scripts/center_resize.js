const querySelect = (element) => document.querySelector(element);

const getCurveAngle = (logoNameElement) => {
  const value = logoNameElement.get("diameter");
  const per = logoNameElement.get("percentage");
  let percentage = value >= 2500 ? (value - 2500) / 25 : -((2500 - value) / 25);
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
    .filter((i) => !i.id?.includes("external_layer_") && !i?.dublicate);
  logoNameElement.charSpacing = 0;
  sloganNameElement.charSpacing = 0;
  const logoMain = objects.filter(
    (i) =>
      !i?.dublicate &&
      !i.text &&
      !i.id?.includes("external_layer_") &&
      !i.id?.includes("Layer_1"),
  );

  const timeout = 2;

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

  switch (type) {
    case "topBottom":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" ||
            (obj.type === "curved-text" &&
              obj.text.toLowerCase() ===
                querySelect("#logoMainField").value.toLowerCase()),
        );
        const { angle, isPositiveOpening } = getCurveAngle(logoNameElement);
        console.log(angle);
        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase(),
        );

        logoNameElement?.set("fontSize", logoSize);
        sloganNameElement?.set("fontSize", sloganSize);

        logoNameElement?.set("charSpacing", 0);
        sloganNameElement?.set("charSpacing", 0);

        logoNameElement?.centerH();
        sloganNameElement?.centerH();

        logoNameElement?.set("top", canvas.height / logoNameTop);
        sloganNameElement?.set("top", canvas.height / sloganTop);

        if (letterSpaced) {
          logoNameElement.text = toTitleCase(logoNameElement.text);
          sloganNameElement.text = toSentenceCase(sloganNameElement.text);

          logoNameElement?.set("fontFamily", "Poppins");
          sloganNameElement?.set("fontFamily", "Poppins");

          const logoNameWidth = logoNameElement.width;
          sloganNameElement?.set("width", logoNameWidth);

          sloganNameElement?.set("charSpacing", 322);
          sloganNameElement?.set("fontSize", 27);

          logoNameElement?.set("top", (logoNameElement.top += 20));
          sloganNameElement?.set("top", (sloganNameElement.top += 20));
        }

        const bottomPosition = logoNameElement.top + logoNameElement.height;
        if (parseInt(angle)) {
          sloganNameElement.set("fontSize", 30);
          if (parseInt(angle) < -180) {
            console.log("FALLING IN THIS CONDITION < -180");
            if (isPositiveOpening) {
              sloganNameElement.set("top", bottomPosition);
            } else {
              logoNameElement.set("top", logoNameElement.get("top") - 140);
              sloganNameElement.set("top", bottomPosition - 100);
            }
          } else if (parseInt(angle) < -200) {
            console.log("FALLING IN THIS CONDITION < -200");
            logoNameElement.set("top", logoNameElement.get("top") - 200);
            sloganNameElement.set("top", bottomPosition);
          } else if (parseInt(angle) > -180) {
            sloganNameElement.set("top", bottomPosition);
            if (!isPositiveOpening) {
              logoNameElement.set("top", logoNameElement.get("top") - 80);
              sloganNameElement.set("top", bottomPosition - 50);
            }
          }
        }

        logoNameElement.centerH();
        sloganNameElement.centerH();

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.renderAll();
        // this.logoOrientation = 'vertical';
      }, timeout);
      break;
    case "bottomTop":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" ||
            (obj.type === "curved-text" &&
              obj.text.toLowerCase() ===
                querySelect("#logoMainField").value.toLowerCase()),
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase(),
        );

        const { angle, isPositiveOpening } = getCurveAngle(logoNameElement);
        logoNameElement.set("fontSize", logoSize);
        sloganNameElement.set("fontSize", sloganSize);

        logoNameElement.centerH();
        sloganNameElement.centerH();

        logoNameElement.set("top", canvas.height / logoNameTop);
        sloganNameElement.set("top", canvas.height / sloganTop);

        if (parseInt(angle)) {
          sloganNameElement.set("fontSize", 30);
          if (!isPositiveOpening) {
            logoNameElement.set("top", canvas.height / logoNameTop - 170);
            sloganNameElement.set("top", sloganNameElement.get("top") - 30);
          } else {
            logoNameElement.set("top", logoNameElement.get("top") - 30);
            sloganNameElement.set("top", sloganNameElement.get("top") + 15);
          }
          sloganNameElement.centerH();
        }

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.renderAll();
        // this.logoOrientation = 'vertical';
      }, timeout);
      break;
    case "leftRight":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" ||
            (obj.type === "curved-text" &&
              obj.text.toLowerCase() ===
                querySelect("#logoMainField").value.toLowerCase()),
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase(),
        );

        logoNameElement.center();
        sloganNameElement.center();

        logoNameElement.set("top", canvas.height / 2.3);
        sloganNameElement.set("top", canvas.height / 1.9);

        logoNameElement.set("fontSize", 46);
        sloganNameElement.set("fontSize", 22);

        logoNameElement.set("charSpacing", 0);
        sloganNameElement.set("charSpacing", 0);

        if (textPosition === "left") {
          logoNameElement.viewportCenter();
          sloganNameElement.viewportCenter();

          logoNameElement.set("top", canvas.height / 2.3);
          sloganNameElement.set("top", canvas.height / 1.9);

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
            logoNameElement.set("left", canvas.width / 1.5);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
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

          logoNameElement.set("left", canvas.width / 1.6);
          sloganNameElement.set("left", logoNameElement.left);
        }

        const { angle, isPositiveOpening } = getCurveAngle(logoNameElement);
        const bottomPosition = logoNameElement.top + logoNameElement.height;
        if (parseInt(angle)) {
          logoNameElement.set("fontSize", 40);
          sloganNameElement.set("fontSize", 30);
          sloganNameElement.set("left", sloganNameElement.get("left") * 1.04);
          if (!isPositiveOpening) {
            logoNameElement.set("top", canvas.height / logoNameTop - 260);
            sloganNameElement.set("top", sloganNameElement.get("top") + 30);
          } else {
            logoNameElement.set("top", logoNameElement.get("top") - 60);
            sloganNameElement.set("top", bottomPosition - 40);
          }
        }

        // logoMain.forEach((i) => (i.left -= 500));
        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObjectH(newGrp);
        canvas.viewportCenterObjectV(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
        // this.logoOrientation = 'horizontal';
      }, timeout);
      break;
    case "rightLeft":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" ||
            (obj.type === "curved-text" &&
              obj.text.toLowerCase() ===
                querySelect("#logoMainField").value.toLowerCase()),
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase(),
        );

        logoNameElement.center();
        sloganNameElement.center();

        logoNameElement.set("top", canvas.height / 2.3);
        sloganNameElement.set("top", canvas.height / 1.9);

        logoNameElement.set("fontSize", 46);
        sloganNameElement.set("fontSize", 22);

        logoNameElement.set("charSpacing", 0);
        sloganNameElement.set("charSpacing", 0);

        if (textPosition === "left") {
          logoNameElement.viewportCenter();
          sloganNameElement.viewportCenter();

          logoNameElement.set("top", canvas.height / 2.3);
          sloganNameElement.set("top", canvas.height / 1.9);

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", -(canvas.width / 100));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", -(canvas.width / 7));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 1.25 -
                sloganNameElement.width / 1.25,
            );
          } else if (logoNameElement.text.length <= 40) {
            logoNameElement.set("left", -(canvas.width / 2.9));
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

            const logoNameWidth = logoNameElement.width;
            sloganNameElement?.set("width", logoNameWidth);

            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width -
                sloganNameElement.width,
            );
          }
        } else {
          logoNameElement.viewportCenterH();
          sloganNameElement.viewportCenterH();

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", -(canvas.width / 100));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", -(canvas.width / 8));
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
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
            logoNameElement.set("left", -(canvas.width / 3.6));

            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5,
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", -(canvas.width / 4));
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
        const { angle, isPositiveOpening } = getCurveAngle(logoNameElement);
        const bottomPosition = logoNameElement.top + logoNameElement.height;
        if (parseInt(angle)) {
          logoNameElement.set("fontSize", 40);
          sloganNameElement.set("fontSize", 30);
          sloganNameElement.set("left", sloganNameElement.get("left") / 1.1);
          if (!isPositiveOpening) {
            logoNameElement.set("top", canvas.height / logoNameTop - 260);
            sloganNameElement.set("top", sloganNameElement.get("top") + 30);
          } else {
            logoNameElement.set("top", logoNameElement.get("top") - 60);
            sloganNameElement.set("top", bottomPosition - 40);
          }
        }

        // logoMain.forEach((i) => (i.left -= 500));
        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObjectH(newGrp);
        canvas.viewportCenterObjectV(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
        // this.logoOrientation = 'horizontal';
      }, timeout);
      break;
  }
  // captureCanvasState();
  canvas.renderAll();
};
