import { fabric } from "fabric";

export class applyLinearGradient {
  constructor(canvas, grad1, grad2) {
    this.canvas = canvas;
    this.grad1 = grad1;
    this.grad2 = grad2;
    this.active = canvas.getActiveObject();
  }
  setColor(isBG = false) {
    const color = new fabric.Gradient({
      type: "linear",
      coords: {
        x1: 0,
        y1: 0,
        x2: isBG ? this.canvas.width : this.active.width,
        y2: isBG ? this.canvas.height : this.active.height,
      },
      colorStops: [
        { offset: 0, color: this.grad1 ? this.grad1 : "#ffffff" },
        { offset: 1, color: this.grad2 ? this.grad2 : "#000000" },
      ],
    });
    isBG ? this.canvas.setBackgroundColor(color) : this.active.set("fill", color);
    this.canvas.renderAll();
  }
}
