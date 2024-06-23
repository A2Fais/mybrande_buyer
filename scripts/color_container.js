const paletteMarkup = /*html*/ `
<div class="bg-settings-container">
<div>
  <div id="color-mode" class="color-mode-selector">
    <span id="color-mode-title" class="color-mode-title" style="margin-left: -10px; margin-bottom: 40px;">Linear Colors
      <i class="fa-solid fa-angle-down"  style="visibility: hidden; display: none"></i>
    </span>
        <div id="bg-color-list" class="color-mode-list"></div>
    </div>

    <div id="gradient-panel-viewer" style="position: absolute; left: 50%; transform: translateX(-50%); margin-top: -130px;">
        <div id="color-palette-gradient" class="color-palette-gradient"></div>
    </div>

    <div id="gradient-panel" style="margin-top: 45px;  display: none; justify-content: flex-start; gap: 5px;">
        <input type="color" value="#ffffff" class="color-picker" id="grad-1">
        <input type="color" value="#000000" class="color-picker" id="grad-2">
      </div>
      
      <div id="solid-panel" style="margin-top: 60px;">
        <input type="color" value="#000000" class="color-picker" id="grad-solid">
    </div>

    <!-- <h3 id="color-angle-text" style="display: none">0deg</h3> -->
    <div id="slider-container" class="slider-container" style="margin-top: 20px; margin-left: -15px; display: none">
        <input class="slider" id="color-angle" type="range" value="0" min="0" max="360">
    </div>

  </div>
</div>`;

class Palette extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = paletteMarkup;
    const $ = (item) => this.querySelector(item);
    this.colorMode = 'Linear';

    const dataList = this.getAttribute('data-list');
    const mainDataList = eval(dataList);
    mainDataList.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      li.style.fontWeight = 500;
      $('#bg-color-list').append(li);
    });

    // $('#color-angle-text').style.display = 'block';
    $('#color-angle').style.display = 'block';
    $('#gradient-panel').style.display = 'flex';
    // $('#slider-container').style.display = 'block';
    $('#solid-panel').style.display = 'none';
    $('#color-palette-gradient').style.background = 'linear-gradient(0deg, rgb(255, 255, 255), rgb(0, 0, 0))';

  }

  connectedCallback() {
    const grad1 = this.querySelector('#grad-1');
    const grad2 = this.querySelector('#grad-2');
    const solid = this.querySelector('#grad-solid');
    const colorAngle = this.querySelector('#color-angle');
    const dispatchChangeEvent = () => {
      this.dispatchEvent(
        new CustomEvent('colorChange', {
          detail: {
            grad1Value: grad1.value,
            grad2Value: grad2.value,
            colorAngle: colorAngle.value,
            solidValue: solid.value,
            colorMode: this.colorMode,
          },
        })
      );
    };

    const $ = (item) => document.querySelector(item);

    const colorList = this.querySelector('#bg-color-list');

    colorList.addEventListener('click', (e) => {
      this.colorMode = e.target.innerText;
      const colorMode = this.colorMode;

      if (colorMode === 'Solid') {
        $('#gradient-panel').style.display = 'none';
        $('#color-angle').style.display = 'none';
        // $('#color-angle-text').style.display = 'none';
        $('#solid-panel').style.display = 'block';
        // $('#slider-container').style.display = 'none';
        $('#solid-panel').style.opacity = 1;
        $('#solid-panel').style.visibility = 'visible';
        $('#solid-panel').style.marginTop = '60px';
        $('#color-palette-gradient').style.background = '#000';
      } else if (colorMode === 'Linear') {
        // $('#color-angle-text').style.display = 'block';
        $('#color-angle').style.display = 'block';
        $('#gradient-panel').style.display = 'flex';
        // $('#slider-container').style.display = 'block';
        $('#solid-panel').style.display = 'none';
        $('#color-palette-gradient').style.background = '#000';
      } else if (colorMode === 'Transparent') {
        // $('#color-angle-text').style.display = 'none';
        $('#gradient-panel').style.display = 'none';
        $('#solid-panel').style.opacity = 0;
        $('#solid-panel').style.visibility = 'hidden';
        $('#solid-panel').style.marginTop = '-10px';
        $('#color-angle').style.display = 'none';
        $('#color-palette-gradient').style.background =
          'url(https://t3.ftcdn.net/jpg/03/76/74/78/240_F_376747823_L8il80K6c2CM1lnPYJhhJZQNl6ynX1yj.jpg)';
      } else if (colorMode === 'None') {
        dispatchChangeEvent();
      }

      colorList.classList.remove('show');
      colorModeTitle.innerText = colorMode;
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-angle-down';
      colorModeTitle.append(icon);
      self.dispatchEvent(new CustomEvent("colorChanged", { detail: { color: item.value } }));
    });

    grad1.addEventListener('input', () => {
      this.querySelector(
        '#color-palette-gradient'
      ).style.background = `linear-gradient(0deg, ${grad1.value}, ${grad2.value})`;
      dispatchChangeEvent();
    });

    grad2.addEventListener('input', () => {
      this.querySelector(
        '#color-palette-gradient'
      ).style.background = `linear-gradient(0deg, ${grad1.value}, ${grad2.value})`;
      dispatchChangeEvent();
    });

    solid.addEventListener('input', () => {
      this.querySelector('#color-palette-gradient').style.background = solid.value;
      dispatchChangeEvent();
    });

    let self = this;
    [solid, grad1, grad2].forEach((item) => {
      item.addEventListener('change', () => {
        self.dispatchEvent(new CustomEvent("colorChanged", { detail: { color: item.value } }));
      });
    });

  }
}

customElements.define('pallete-component', Palette);
