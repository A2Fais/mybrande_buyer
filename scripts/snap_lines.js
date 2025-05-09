function CanvasGuides(canvas) {
  const l = console.log.bind(this);
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const guideStrokeWidth = isMobile ? 2 : 0.5;

  function createNewId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function showPositioningLine(type, point, props) {
    let name = point + type;
    let line = canvas._objects.find((obj) => obj.name === name),
      properties = {};
    
    if (type === "X") properties.top = point;
    if (type === "Y") properties.left = point;
    
    let coords;
    if (type === "X") {
      coords = [-canvas.getWidth() * 2, point, canvas.getWidth() * 3, point];
    } else if (type === "Y") {
      coords = [point, -canvas.getHeight() * 2, point, canvas.getHeight() * 3];
    }

    if (line) {
      line.set({
        opacity: 1,
        x1: coords[0],
        y1: coords[1],
        x2: coords[2],
        y2: coords[3],
        ...properties,
      });
      canvas.renderAll();
      return true;
    }

    line = new fabric.Line(coords, {
      stroke: "red",
      strokeWidth: guideStrokeWidth,
      selectable: false,
      opacity: 1,
      id: createNewId(),
      name: name,
      isPositioningLine: true,
      ...properties,
    });
    canvas.add(line);
  }

  function hideAllPositioningLines() {
    let positionlines = canvas._objects.filter((obj) => obj.isPositioningLine);
    for (let i = 0; i < positionlines.length; i++) {
      canvas.remove(positionlines[i]);
    }
  }

  function hidePositioningLine(type, point) {
    let name = point + type;
    let line = canvas._objects.find((obj) => obj.name === name);
    if (line) {
      line.set({
        opacity: 0,
      });
    }
  }

  function getPositioningPoints(obj) {
    let width = obj.getScaledWidth(),
      height = obj.getScaledHeight(),
      left = obj.left,
      top = obj.top,
      pointsX = [left, left + width / 2, left + width],
      pointsY = [top, top + height / 2, top + height];

    pointsX = pointsX.map((point) => Math.round(point));
    pointsY = pointsY.map((point) => Math.round(point));

    let pointsXFull = [];
    pointsX.forEach((point, i) => {
      pointsXFull.push({
        point,
        p2: pointsY[0],
      });
    });

    let pointsYFull = [];
    pointsY.forEach((point, i) => {
      pointsYFull.push({
        point,
        p2: pointsX[0],
      });
    });
    return {
      x: pointsXFull,
      y: pointsYFull,
    };
  }

  function getCanvasPositioningPoints() {
    let width = canvas.getWidth(),
      height = canvas.getHeight(),
      pointsX = [0, width / 2, width],
      pointsY = [0, height / 2, height];
    
    let pointsXFull = pointsX.map((point) => {
      return {
        point,
        p2: 0,
        pointType: "canvas",
      };
    });
    let pointsYFull = pointsY.map((point) => {
      return {
        point,
        p2: 0,
        pointType: "canvas",
      };
    });

    return {
      x: pointsXFull,
      y: pointsYFull,
    };
  }

  function getObjById(id) {
    let targetObj = null;
    let targetObject = null;
    canvas._objects.forEach((obj) => {
      if (targetObject) return true;
      if (obj.id == id) {
        targetObject = obj;
      } else if (obj._objects) {
        let groupObj = obj._objects.find((object) => object.id == id);
        if (groupObj) {
          targetObject = groupObj;
        }
      }
    });
    return targetObject;
  }

  function getAllPositioningPoints() {
    let pointsX = [],
      pointsY = [],
      canvasPoints = getCanvasPositioningPoints(),
      activeObj = canvas.getActiveObject(),
      activeObjId = activeObj?.id;
    pointsX = pointsX.concat(canvasPoints.x);
    pointsY = pointsY.concat(canvasPoints.y);

    if (isObjInGroup(activeObjId)) {
      if (activeObj.group) activeObjId = activeObj.group.id;
    }

    function isObjInGroup(id) {
      let obj = getObjById(id);
      if (!obj) return false;
      return obj.group == undefined ? false : true;
    }

    canvas._objects.forEach((obj) => {
      if (obj.id == activeObjId) return true;
      if (activeObj.type === "activeSelection") {
        let isActiveObj = activeObj._objects.find((item) => item.id == obj.id);
        if (isActiveObj) return true;
      }
      let objPoints = getPositioningPoints(obj);
      pointsX = pointsX.concat(objPoints.x);
      pointsY = pointsY.concat(objPoints.y);
    });
    return {
      x: pointsX,
      y: pointsY,
    };
  }

  function isObjectOnPoint(objPoints, points, type) {
    let data = {
      onPoint: false,
    };
    points.forEach((item) => {
      let { point, p2 } = item;
      hidePositioningLine(type, point);
      if (data.onPoint) return true;

      let minPoint = point - 5,
        maxPoint = point + 5,
        positions = ["left", "center", "right"];
      objPoints.forEach((objItem, i) => {
        let position = objItem.point;
        if (position >= minPoint && position <= maxPoint) {
          data = item;
          data.onPoint = true;
          data.position = positions[i];
          return false;
        }
      });
    });
    return data;
  }
  let isObjMoved = false;
  canvas.on("object:moving", function (e) {
    isObjMoved = true;
    let obj = e.target;

    if (obj.type == "curved-text") obj.refreshCtx();

    let x = obj.left,
      y = obj.top,
      width = obj.getScaledWidth(),
      height = obj.getScaledHeight(),
      objPoints = getPositioningPoints(obj),
      points = getAllPositioningPoints(obj);
    let onXPoints = isObjectOnPoint(objPoints.x, points.x, "Y");
    if (onXPoints.onPoint) {
      let point = onXPoints.point,
        leftPos = point;
      if (onXPoints.position === "center") leftPos = leftPos - width / 2;
      else if (onXPoints.position === "right") leftPos = leftPos - width;

      obj.set("left", leftPos);

      showPositioningLine("Y", point, onXPoints);
    } else {
      points.x.forEach((point) => {
        hidePositioningLine("Y", point);
      });
    }
    let onYPoints = isObjectOnPoint(objPoints.y, points.y, "X");
    if (onYPoints.onPoint) {
      let point = onYPoints.point,
        topPos = point;
      if (onYPoints.position === "center") topPos = topPos - height / 2;
      else if (onYPoints.position === "right") topPos = topPos - height;

      obj.set("top", topPos);
      showPositioningLine("X", point, onYPoints);
    } else {
      points.y.forEach((point) => {
        hidePositioningLine("X", point);
      });
    }
    canvas.renderAll();
  });

  canvas.on("mouse:up", function (e) {
    hideAllPositioningLines();

    if (isObjMoved) {
      canvas.save();
      let obj = e.target;
      isObjMoved = false;

      if (obj.type == "curved-text") obj.refreshCtx(true);
    }
  });

  canvas.on("object:scaling", function (e) {
    let obj = e.target;
    if (obj.type == "curved-text") {
      obj.refreshCtx(true);
      obj._updateObj("scaleX", obj.scaleX);
      obj._updateObj("scaleY", obj.scaleY);
    }
  });

  document.onkeydown = function (e) {
    let obj = canvas.getActiveObject();
    if (!obj) return true;
    let keyCode = e.keyCode || e.which,
      validKeys = [37, 38, 39, 40],
      data = {
        left: obj.left,
        top: obj.top,
      };
    if (!validKeys.includes(keyCode)) {
      return true;
    }
    if ($(":focus").length) return true;
    e.preventDefault();
    if (keyCode == 37) {
      data.left -= 1;
    }
    else if (keyCode == 38) {
      data.top -= 1;
    }
    else if (keyCode == 39) {
      data.left += 1;
    }
    else if (keyCode == 40) {
      data.top += 1;
    }
    obj.set(data);
    canvas.renderAll();
  };
}

export { CanvasGuides };
