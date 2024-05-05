class SaveHistory {
    editorHistory = {
        state: false,
        undo: [],
        redo: [],
    };

    undoBtn = document.querySelector("#undo-btn");
    redoBtn = document.querySelector("#redo-btn");

    constructor(canvas) {
        this.canvas = canvas;
        this.eventListeners(); // Initialize Event Listeners
    }

    // Undo Changes
    undoChanges() {
        let self = this;
        return new Promise(async (res, rej) => {
            if (self.editorHistory.undo.length == 0) res(true);
            else
                await self.changeHistory(self.editorHistory.undo, self.editorHistory.redo);
            res(true);
        });
    }

    // Redo Changes
    redoChanges() {
        let self = this;
        return new Promise(async (res, rej) => {
            if (self.editorHistory.redo.length == 0) res(true)
            else
                await self.changeHistory(self.editorHistory.redo, self.editorHistory.undo);
            res(true);
        });
    }

    // Event Listeners
    eventListeners() {
        let self = this;
        // udno
        this.undoBtn.addEventListener("click", async function () {
            this.style.pointerEvents = 'none';
            let undo = this.querySelector('.fa-undo');
            undo.classList.add('spin');
            if (self.editorHistory.undo) await self.undoChanges();
            this.style.pointerEvents = 'auto';
            undo.classList.remove('spin')
        });

        // redo
        this.redoBtn.addEventListener("click", async function () {
            this.style.pointerEvents = 'none';
            let redo = this.querySelector('.fa-redo');
            redo.classList.add('spin');
            if (self.editorHistory.redo.length) await self.redoChanges();
            this.style.pointerEvents = 'auto';
            redo.classList.remove('spin');
        });
    }

    // Save History
    saveHistory() {
        this.editorHistory.redo = [];

        if (this.editorHistory.state)
            this.editorHistory.undo.push(this.editorHistory.state);

        let canvasData = this.canvas.toJSON(['id']);

        // # Filter Canvas Data

        let curvedTextObj = [];

        canvasData.objects.forEach((obj, i) => {
            if (obj.type == 'curved-text') {
                curvedTextObj.push(obj);
                canvasData.objects.splice(i, 1);
            }
        })

        canvasData.curvedTextObjects = curvedTextObj;
        // Save History
        this.editorHistory.state = { json: canvasData };
        console.log("History Saved");
    }
    // Change History
    async changeHistory(playStack, saveStack) {
        saveStack.push(this.editorHistory.state);
        this.editorHistory.state = playStack.pop();
        // Add State To canvas
        this.canvas.clear();
        let stateData = this.editorHistory.state
        if (!stateData) return false;
        await this.canvasLoadFromJSON(stateData.json);
        this.canvas.updatePreview()
    }

    // Load Canvas From JSON
    canvasLoadFromJSON(jsonData) {
        let self = this;
        return new Promise(async (res, rej) => {
            this.canvas.loadFromJSON(jsonData, function () {

                // # Load Curved Text
                jsonData.curvedTextObjects.forEach(obj => {
                    self.canvas.add(new fabric.CurvedText(obj.text, obj));
                });

                self.canvas.renderAll();
                res(true);
            });
        });
    }

}


export default SaveHistory;