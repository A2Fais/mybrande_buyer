export class CreateLayerSection {
  constructor(layers) {
    this.layers = layers;
  }
  create(obj, idx) {
    if (obj.text) return;

    function getUniqueId(len = 30) {
      let nums = "0123456789",
        chars = "abcdefghijklmnopqrstuvwxyz",
        str = '',
        length = len;
      for (let i = 0; i < length; i++) {
        if (i % 2 == 0) str += nums[Math.floor(Math.random() * nums.length)];
        else str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    }

    let id = getUniqueId();
    obj.set("layerId", id);
    const imgElem = document.createElement('img');
    imgElem.className = 'layer-img';
    imgElem.src = obj.toDataURL();
    const layerSpan = document.createElement('span');
    layerSpan.className = 'layer-span';
    layerSpan.textContent = `Layer ${idx + 1}`;
    const layerContainer = document.createElement('div');
    layerContainer.setAttribute('tabindex', '0');
    layerContainer.className = 'layer-container';
    layerContainer.setAttribute('data_layer', idx);
    layerContainer.setAttribute("data-id", id);
    layerContainer.append(imgElem, layerSpan);
    this.layers.append(layerContainer);
  }
}
