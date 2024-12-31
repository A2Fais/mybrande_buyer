export const mobileBackgroundView = `
<div id="mobile-background-view">

<div id="mobile-background-view-categories" style="display: flex; justify-content: space-around; align-items: center;">
    <!-- Solid Category -->
    <div id="mobile-solid-category" style="text-align: center;">
        <i class="fas fa-square" style="font-size: 20px; color: var(--gray);"></i>
        <p style="margin-top: 10px; font-size: 12px; color: var(--gray);">Solid</p>
    </div>

    <!-- Linear Category -->
    <div id="mobile-linear-category" style="text-align: center;">
        <i class="fas fa-arrows-alt-h" style="font-size: 20px; color: var(--gray);"></i>
        <p style="margin-top: 10px; font-size: 12px; color: var(--gray);">Linear</p>
    </div>

    <!-- None Category -->
    <div id="mobile-none-category" style="text-align: center;">
        <i class="fas fa-ban" style="font-size: 20px; color: var(--gray);"></i>
        <p style="margin-top: 10px; font-size: 12px; color: var(--gray);">None</p>
    </div>
</div>

<!-- Solid Colors Section -->
<div id="mobile-solid-color-section" style="display: grid; grid-template-colums: repeat(4, 1fr); gap: 5px; justify-content: flex-start; padding-inline: 30px; overflow-x: scroll; display: none;">
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #000000;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #545454;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #737373;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a6a6a6;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d9d9d9;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f5f5f5;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffffff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b25d1f;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e37627;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fc832b;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fd964b;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #febb8a;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fedfc9;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fff2e9;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ab2d2d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #de3a3a;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f74040;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f85d5d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fcb3b3;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fed0d0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffeded;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #8a6e10;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b89e1e;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e5c100;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffdd00;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffea66;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #fff59d;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ffffe0;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #126f43;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #168a53;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #1dbf73;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #62d49f;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a6eaca;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #c9f4e0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #e8faf4;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #1b8996;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #25a1b0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #3ad0e6;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #75dfee;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #afedf7;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #cdf5fb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ecfcff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #284389;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #3f63c8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #4a73e8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #819ef0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #9db4f3;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d4defb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f0f4ff;"></span>
  </div>
  <div style="display: flex;">
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #6731a1;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #984ae8;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #a866ec;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #b881f0;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #d8b9f7;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #ecddfb;"></span>
    <span id="solid_color-bg-mobile" class="color-picker solid_color_section" style="background-color: #f8f0ff;"></span>
  </div>
</div>

<div id="mobile-linear-color-section" style="display: flex; gap: 5px; justify-content: center;overflow-x: scroll; display: none;">
  <mobile-pallete-component id="mobile-bg-pallete"></mobile-pallete-component>
</div>

<div id="mobile-none-color-section" style="display: flex; gap: 5px; justify-content: flex-start; padding-right: 30px; overflow-x: scroll; display: none;">
  <h1>None</h1> </div>

</div>`;
