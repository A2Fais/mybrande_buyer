import { canvas } from "./main.js";

export function mobileLogoShadowMenu(activeObject) {
  const sliders = [
    { id: "#blur-mobile-slider", prop: "blur", title: "#blur-value" },
    { id: "#x-mobile-slider", prop: "offsetX", title: "#x-value" },
    { id: "#y-mobile-slider", prop: "offsetY", title: "#y-value" },
  ];

  sliders.forEach(({ id, prop, title }) => {
    document.querySelector(id)?.addEventListener("input", (e) => {
      const value = parseInt(e.target.value, 10);
      document.querySelector(title).innerText = `${value}px`;

      const applyShadow = (object) => {
        const currentShadow = object.get("shadow") || {
          blur: 0,
          offsetX: 0,
          offsetY: 0,
        };

        object.set("shadow", {
          ...currentShadow,
          [prop]: value,
        });
      };

      if (activeObject.type === "group") {
        activeObject._objects.forEach((groupedItem) => {
          applyShadow(groupedItem);
        });
      } else {
        applyShadow(activeObject);
      }

      canvas.renderAll();
    });
  });
}
