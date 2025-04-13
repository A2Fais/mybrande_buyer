export class CreateLayerSection {
  constructor(layer) {
    this.layer = layer;
    this.deviceType = window.innerWidth <= 800 ? "mobile" : "desktop";
  }

  create(obj, idx, after = null) {
    if (obj?.text) return;

    function getUniqueId(len = 30) {
      let nums = "0123456789",
        chars = "abcdefghijklmnopqrstuvwxyz",
        str = "",
        length = len;
      for (let i = 0; i < length; i++) {
        if (i % 2 == 0) str += nums[Math.floor(Math.random() * nums.length)];
        else str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    }

    const id = getUniqueId();
    obj.set("layerId", id);
    const imgElem = document.createElement("img");
    imgElem.className = "layer-img";
    imgElem.src = obj.toDataURL();
    const layerSpan = document.createElement("span");
    layerSpan.className = "layer-span";
    layerSpan.textContent = `Layer ${idx + 1}`;
    const layerContainer = document.createElement("div");
    layerContainer.setAttribute("tabindex", "0");
    layerContainer.className = "layer-container";

    if (this.deviceType === "mobile") {
      imgElem.style.width = "15px";
      imgElem.style.height = "15px";
      layerSpan.style.fontSize = "12px";
      layerSpan.style.width = "max-width"
      layerContainer.style.textAlign = "center";
      layerContainer.style.gap = "0px";
      layerContainer.style.margin = 0;
    }

    layerContainer.setAttribute("layer-id", id);
    layerContainer.appendChild(imgElem);
    layerContainer.appendChild(layerSpan);

    if (after) {
      after.insertAdjacentElement("afterend", layerContainer);
    } else {
      this.layer.insertBefore(layerContainer, this.layer.firstChild);
    }
  }
}
