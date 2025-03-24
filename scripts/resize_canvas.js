function resizeCanvas(self) {
  const SMALL_SCREEN_WIDTH = 1280;
  const MEDIUM_SCREEN_WIDTH = 1400;
  const LARGE_SCREEN_MIN_WIDTH = 2048;
  const LARGE_SCREEN_MAX_WIDTH = 2560;

  const SMALL_HEIGHT_DIVISOR = 1;
  const MEDIUM_HEIGHT_DIVISOR = 1.8;
  const MEDIUM_WIDTH_DIVISOR = 2;
  const LARGE_HEIGHT_DIVISOR = 2;
  const DEFAULT_HEIGHT_DIVISOR = 1.3;
  const DEFAULT_WIDTH_DIVISOR = 2;

  const SMALL_SCALE_FACTOR = 0.4;
  const SCALE_FACTOR = 0.8;

  const isMobileUser = navigator?.userAgent?.includes("Mobile");
  
  const canvasContainer = document.getElementById("canvas-container");
  const mobileTopBar = document.querySelector("#mobile-top-bar");
  const mobileNavBar = document.querySelector("#mobile-nav-bar");

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (isMobileUser) {
    canvasContainer.style.position = "absolute";
    canvasContainer.style.top = "100px";
    self.canvas.setHeight(windowHeight / 1.6);
    self.canvas.setWidth(windowWidth);
    self.canvas.setZoom(SMALL_SCALE_FACTOR);
    mobileTopBar.style.display = "flex";
    mobileNavBar.style.display = "flex";
  } else {
    // DESKTOP VIEW
    mobileTopBar.style.display = "none";
    mobileNavBar.style.display = "none";

    if (windowWidth <= MEDIUM_SCREEN_WIDTH) {
      if (windowWidth <= SMALL_SCREEN_WIDTH) {
        self.canvas.setHeight(windowHeight / SMALL_HEIGHT_DIVISOR);
        self.canvas.setWidth(windowWidth + 100);
        self.canvas.setZoom(SMALL_SCALE_FACTOR);
      } else {
        self.canvas.setHeight(windowHeight / MEDIUM_HEIGHT_DIVISOR);
        self.canvas.setWidth(windowWidth / MEDIUM_WIDTH_DIVISOR);
        self.canvas.setZoom(SCALE_FACTOR);
      }

      self.canvas.getObjects().forEach(function (object) {
        object.scaleX *= SCALE_FACTOR;
        object.scaleY *= SCALE_FACTOR;
        object.left *= SCALE_FACTOR;
        object.top *= SCALE_FACTOR;
        object.setCoords();
      });
      self.canvas.renderAll();
    } else if (
      windowWidth <= LARGE_SCREEN_MAX_WIDTH &&
      windowWidth >= LARGE_SCREEN_MIN_WIDTH
    ) {
      self.canvas.setHeight(windowHeight / LARGE_HEIGHT_DIVISOR);
    } else {
      self.canvas.setHeight(windowHeight / DEFAULT_HEIGHT_DIVISOR);
      self.canvas.setWidth(windowWidth / DEFAULT_WIDTH_DIVISOR);
    }
  }

  self.canvas.renderAll();
}

export default resizeCanvas;
