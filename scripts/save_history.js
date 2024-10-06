import { querySelect } from "./selectors";

class SaveHistory {
  editorHistory = {
    state: false,
    undo: [],
    redo: [],
  };

  undoBtn = querySelect("#undo-btn");
  redoBtn = querySelect("#redo-btn");

  constructor(canvas) {
    this.canvas = canvas;
    this.eventListeners();
  }

  undoChanges() {
    let self = this;
    return new Promise(async (res) => {
      if (self.editorHistory.undo.length == 0) res(true);
      else
        await self.changeHistory(
          self.editorHistory.undo,
          self.editorHistory.redo,
        );
      res(true);
    });
  }

  redoChanges() {
    let self = this;
    return new Promise(async (res) => {
      if (self.editorHistory.redo.length == 0) res(true);
      else
        await self.changeHistory(
          self.editorHistory.redo,
          self.editorHistory.undo,
        );
      res(true);
    });
  }

  eventListeners() {
    let self = this;
    this.undoBtn.addEventListener("click", async function () {
      this.style.pointerEvents = "none";
      let undo = this.querySelector(".fa-undo");
      undo.classList.add("spin");
      if (self.editorHistory.undo) await self.undoChanges();
      this.style.pointerEvents = "auto";
      undo.classList.remove("spin");
      self.canvas.undoCB();
    });

    this.redoBtn.addEventListener("click", async function () {
      this.style.pointerEvents = "none";
      let redo = this.querySelector(".fa-redo");
      redo.classList.add("spin");
      if (self.editorHistory.redo.length) await self.redoChanges();
      this.style.pointerEvents = "auto";
      redo.classList.remove("spin");
      self.canvas.undoCB();
    });
  }

  saveHistory() {
    this.editorHistory.redo = [];

    if (this.editorHistory.state)
      this.editorHistory.undo.push(this.editorHistory.state);

    let canvasData = this.canvas.toJSON(["id", "layerId"]);

    let curvedTextObj = [];

    canvasData.objects.forEach((obj, i) => {
      if (obj.type == "curved-text") {
        curvedTextObj.push(obj);
        canvasData.objects.splice(i, 1);
      }
    });
    canvasData.curvedTextObjects = curvedTextObj;
    this.editorHistory.state = { json: canvasData };
  }

  async changeHistory(playStack, saveStack) {
    saveStack.push(this.editorHistory.state);
    this.editorHistory.state = playStack.pop();
    this.canvas.clear();
    let stateData = this.editorHistory.state;
    if (!stateData) return false;
    await this.canvasLoadFromJSON(stateData.json);
    this.canvas.updatePreview();
  }

  canvasLoadFromJSON(jsonData) {
    let self = this;
    return new Promise(async (res) => {
      this.canvas.loadFromJSON(jsonData, function () {
        jsonData.curvedTextObjects.forEach((obj) => {
          self.canvas.add(new fabric.CurvedText(obj.text, obj));
        });

        self.canvas.renderAll();
        res(true);
      });
    });
  }
}

export default SaveHistory;
