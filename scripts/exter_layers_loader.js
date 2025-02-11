const loadExternalLayers = async (canvas, loadedIcons) => {
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

      canvas.add(img);
      canvas.requestRenderAll();
      return img;
    };

    const loadLayers = async (layers = null, text = null, img = null) => {
      layers = layers ? JSON.parse(layers) : [];
      text = text ? JSON.parse(text) : [];
      img = img ? JSON.parse(img) : [];
      let uploadLayerCounter = 0;

      const externalLayers = [...layers, ...text, ...img];
      if (!externalLayers.length) return false;

      for (const layer of externalLayers) {
        let { layerType, ext } = layer;
        if (layerType == "text") {
          let textLayer = new fabric.IText(layer.text, layer);
          canvas.add(textLayer);
        } else if (ext == "svg") {
          await new Promise((resolve) => {
            fabric.loadSVGFromURL(layer.dataUrl, (objects, options) => {
              let img = loadSVGObject(layer, objects, options);
              img.set("dataUrl", layer.dataUrl);
              resolve();
            });
          });
        } else if (layerType === "image") {
          await new Promise((resolve) => {
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

              canvas.add(img);
              canvas.requestRenderAll();
              uploadLayerCounter++;
              resolve();
            });
          });
        } else {
          let { category, itemId } = layer;
          if (!category) continue;
          let svgContent = loadedIcons[category][parseInt(itemId)];
          if (!svgContent) return false;

          svgContent = svgContent.svg;
          await new Promise((resolve) => {
            fabric.loadSVGFromString(svgContent, (objects, options) => {
              let img = loadSVGObject(layer, objects, options);
              img.set({
                itemId,
                category,
              });
              canvas.requestRenderAll();
              resolve();
            });
          });
        }
        canvas.requestRenderAll();
      }
    };

    return loadLayers;
  };

  export default loadExternalLayers;