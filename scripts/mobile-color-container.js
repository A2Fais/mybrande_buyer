const paletteMarkup = `
<div style="display: flex; flex-direction: column; height: 100%; align-items: center; gap: 10px;">
    <div id="color-mode" class="color-mode-selector" style="display: flex; flex-direction: row-reverse; height: 100%; justify-content: space-around; gap: 30px; align-items: center;">
      <div id="gradient-panel-viewer" style="display: flex; flex-direction: column; align-items: center;">
        <div id="color-palette-gradient" class="color-palette-gradient" style="height: 30px; width: 200px; border: none; transform: rotate(180deg); background: linear-gradient(-90deg, #ffffff, #000000);"></div>
      </div>

      <div id="gradient-panel" style="display: flex; justify-content: center; gap: 20px; width: 100%;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <input type="color" value="#ffffff" id="grad-1" style="width: 40px; height: 30px; border: none; outline: none; background: #ffffff;">
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <input type="color" value="#000000" id="grad-2" style="width: 40px; height: 30px; border: none; outline: none; background: #ffffff">
        </div>
      </div>
  </div>
</div>`;

class Palette extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = paletteMarkup;
  }

  connectedCallback() {
    const modeSelector = this.querySelector("#color-mode");
    const gradientPanelViewer = this.querySelector("#gradient-panel-viewer");
    const gradientPanel = this.querySelector("#gradient-panel");
    const grad1 = this.querySelector("#grad-1");
    const grad2 = this.querySelector("#grad-2");
    const colorPaletteGradient = this.querySelector("#color-palette-gradient");

    [grad1, grad2].forEach((grad) => {
      grad.addEventListener("input", () => {
        const grad1Value = grad1.value;
        const grad2Value = grad2.value;
        colorPaletteGradient.style.background = `linear-gradient(-90deg, ${grad1Value}, ${grad2Value})`;
      });
    });
  }
}

customElements.define("mobile-pallete-component", Palette);
