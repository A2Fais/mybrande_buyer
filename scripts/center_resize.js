const querySelect = (element) => document.querySelector(element);

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
  sloganNameElement
) => {
  const objects = canvas?.getObjects().filter((i) => i.id !== "external_layer");;
  logoNameElement.charSpacing = 0;
  sloganNameElement.charSpacing = 0;
  const logoMain = objects.filter((i) => !i.text && i.id !== "external_layer");

  const timeout = 5;

  switch (type) {
    case "topBottom":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#logoMainField").value.toLowerCase()
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase()
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
        }

        logoNameElement?.centerH();
        sloganNameElement?.centerH();

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
        // this.logoOrientation = 'vertical';
      }, timeout);
      break;
    case "bottomTop":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#logoMainField").value.toLowerCase()
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase()
        );

        logoNameElement.set("fontSize", logoSize);
        sloganNameElement.set("fontSize", sloganSize);

        logoNameElement.centerH();
        sloganNameElement.centerH();

        logoNameElement.set("top", canvas.height / logoNameTop);
        sloganNameElement.set("top", canvas.height / sloganTop);

        const newGrp = new fabric.Group(objects);
        canvas.viewportCenterObject(newGrp);
        newGrp.ungroupOnCanvas();
        canvas.requestRenderAll();
        // this.logoOrientation = 'vertical';
      }, timeout);
      break;
    case "leftRight":
      setTimeout(() => {
        const logoNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#logoMainField").value.toLowerCase()
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase()
        );

        console.log("Left Right");

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
          console.log("left");

          logoNameElement.set("top", canvas.height / 2.3);
          sloganNameElement.set("top", canvas.height / 1.9);

          logoNameElement.set("left", canvas.width / 2.4);
          sloganNameElement.set("left", logoNameElement.left);
        } else {
          console.log("center");
          logoNameElement.viewportCenterH();
          sloganNameElement.viewportCenterH();

          if (logoNameElement.text.length <= 40) {
            logoNameElement.set("left", canvas.width - 570);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2 -
                sloganNameElement.width / 2
            );
          } else if (logoNameElement.text.length <= 30) {
            logoNameElement.set("left", canvas.width - 500);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2 -
                sloganNameElement.width / 2
            );
          } else {
            logoNameElement.set("left", canvas.width / 2.5);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2 -
                sloganNameElement.width / 2
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
          sloganNameElement.set(
            "left",
            logoNameElement.left +
              logoNameElement.width / 2 -
              sloganNameElement.width / 2
          );
        }

        logoMain.forEach((i) => (i.left -= 200));
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
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#logoMainField").value.toLowerCase()
        );

        const sloganNameElement = objects.find(
          (obj) =>
            obj.type === "text" &&
            obj.text.toLowerCase() ===
              querySelect("#sloganNameField").value.toLowerCase()
        );
        console.log("rightLeft");

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

          logoNameElement.set("left", canvas.width / 6);
          sloganNameElement.set(
            "left",
            logoNameElement.left +
              logoNameElement.width -
              sloganNameElement.width
          );

          if (letterSpaced) {
            logoNameElement.text = toTitleCase(logoNameElement.text);
            sloganNameElement.text = toSentenceCase(sloganNameElement.text);

            logoNameElement.set("fontFamily", "Poppins");
            sloganNameElement.set("fontFamily", "Poppins");

            sloganNameElement.set("charSpacing", 322);
            sloganNameElement.set("fontSize", 27);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width -
                sloganNameElement.width
            );
          }
        } else {
          console.log("center");

          logoNameElement.viewportCenterH();
          sloganNameElement.viewportCenterH();

          if (logoNameElement.text.length <= 20) {
            logoNameElement.set("left", canvas.width / 6);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5
            );
          } else if (logoNameElement.text.length <= 30) {
            console.log("<= 30");
            logoNameElement.set("left", canvas.width / 14);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5
            );
          } else if (logoNameElement.text.length <= 40) {
            console.log("40");
            logoNameElement.set("left", -200);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2.5 -
                sloganNameElement.width / 2.5
            );
          } else {
            logoNameElement.set("left", canvas.width / 6);
            sloganNameElement.set(
              "left",
              logoNameElement.left +
                logoNameElement.width / 2 -
                sloganNameElement.width / 2
            );
          }
        }

        logoMain.forEach((i) => {
          i.left += 150;
          i.top += 40;
        });
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
  canvas.requestRenderAll();
};
