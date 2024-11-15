function resizeCanvas(self) {
    const SMALL_SCREEN_WIDTH = 1280;
    const MEDIUM_SCREEN_WIDTH = 1400;
    const LARGE_SCREEN_MIN_WIDTH = 2048;
    const LARGE_SCREEN_MAX_WIDTH = 2560;
    
    const SMALL_HEIGHT_DIVISOR = 1.2;
    const SMALL_WIDTH_DIVISOR = 1.6;
    const MEDIUM_HEIGHT_DIVISOR = 1.8;
    const MEDIUM_WIDTH_DIVISOR = 2;
    const LARGE_HEIGHT_DIVISOR = 2;
    const DEFAULT_HEIGHT_DIVISOR = 1.3;
    const DEFAULT_WIDTH_DIVISOR = 2;
    
    const SCALE_FACTOR = 0.8;

    if (window.innerWidth <= MEDIUM_SCREEN_WIDTH) {
      if (window.innerWidth <= SMALL_SCREEN_WIDTH) {
        self.canvas.setHeight(window.innerHeight / SMALL_HEIGHT_DIVISOR);
        self.canvas.setWidth(window.innerWidth / SMALL_WIDTH_DIVISOR);
      } else {
        self.canvas.setHeight(window.innerHeight / MEDIUM_HEIGHT_DIVISOR);
        self.canvas.setWidth(window.innerWidth / MEDIUM_WIDTH_DIVISOR);
      }

      self.canvas.setZoom(SCALE_FACTOR);
      self.canvas.getObjects().forEach(function (object) {
        object.scaleX *= SCALE_FACTOR;
        object.scaleY *= SCALE_FACTOR;
        object.left *= SCALE_FACTOR;
        object.top *= SCALE_FACTOR;
        object.setCoords();
      });
      self.canvas.renderAll();
    } else if (window.innerWidth <= LARGE_SCREEN_MAX_WIDTH && window.innerWidth >= LARGE_SCREEN_MIN_WIDTH) {
      self.canvas.setHeight(window.innerHeight / LARGE_HEIGHT_DIVISOR);
    } else {
      self.canvas.setHeight(window.innerHeight / DEFAULT_HEIGHT_DIVISOR);
      self.canvas.setWidth(window.innerWidth / DEFAULT_WIDTH_DIVISOR);
    }
    self.canvas.renderAll();
  }

  export default resizeCanvas