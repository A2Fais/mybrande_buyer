import { querySelect } from "./selectors.js";

const paletteMarkup = /*html*/ `
<div style="display: flex; flex-direction: column; height: 100%; align-items: center; gap: 10px;">
    <div id="color-mode" class="color-mode-selector" style="display: flex; flex-direction: row-reverse; height: 100%; justify-content: space-around; gap: 30px; align-items: center;">
      <div id="gradient-panel-viewer" style="display: flex; flex-direction: column; align-items: center;">
        <div id="color-palette-gradient" class="color-palette-gradient" style="height: 30px; width: 200px; border: none; transform: rotate(180deg); background: linear-gradient(-90deg, #ffffff, #000000);"></div>
          <!-- <div style="text-align: center; font-size: 12px; color: var(--gray-light);">Linear Gradient Panel</div> -->
      </div>


      <div id="gradient-panel" style="display: flex; justify-content: center; gap: 20px; width: 100%;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <input type="color" value="#ffffff" id="grad-1" style="width: 40px; height: 30px; border: none; outline: none; background: #ffffff;">
          <!-- <div style="text-align: center; font-size: 12px; color: var(--gray-light);">Color 1</div> -->
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <input type="color" value="#000000" id="grad-2" style="width: 40px; height: 30px; border: none; outline: none; background: #ffffff">
          <!-- <div style="text-align: center; font-size: 12px; color: var(--gray-light);">Color 2</div> -->
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
    const grad1 = this.querySelector("#grad-1");
    const grad2 = this.querySelector("#grad-2");
    const dispatchChangeEvent = () => {
      this.dispatchEvent(
        new CustomEvent("colorChange", {
          detail: {
            grad1Value: grad1.value,
            grad2Value: grad2.value,
          },
        }),
      );
    };

    grad1.addEventListener("input", () => {
      this.querySelector("#color-palette-gradient").style.background =
        `linear-gradient(-90deg, ${grad1.value}, ${grad2.value})`;
      dispatchChangeEvent();
    });

    grad2.addEventListener("input", () => {
      this.querySelector("#color-palette-gradient").style.background =
        `linear-gradient(-90deg, ${grad1.value}, ${grad2.value})`;
      dispatchChangeEvent();
    });

    [grad1, grad2].forEach((item) => {
      item.addEventListener("change", () => {
        this.dispatchEvent(
          new CustomEvent("colorChanged", { detail: { color: item.value } }),
        );
      });
    });
  }
}

customElements.define("mobile-pallete-component", Palette);
