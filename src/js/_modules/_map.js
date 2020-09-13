export default class Map{
    constructor() {

        this._mapPixelWidth = 800
        this._mapPixelHeight = 800

        this._mapCol = 100
        this._mapRow = 100
        this._viewportCol = 20
        this._viewportRow = 20
        this._mapChipSize = 20
        this._bgLayer = null
        this._mapLayer = null
        this._uiLayer = null
        this._bgGraphics = null
        this._mapGraphics = null
        this._uiGraphics = null

        this._cursorX = 10
        this._cursorY = 20

        this._cells = []
        this._texts = []
        this._textsHandle = 1

        this.setupPIXI()
        this.setupMapSystem()
    }

    setupPIXI() {
        this._app = new PIXI.Application({
            width: this._mapPixelWidth, height: this._mapPixelHeight,
            transparent:true, resolution: 1,
        });
        $("#map").append(this._app.view)
    }


    setupMapSystem(){
        this._bgLayer = new PIXI.Container()
        this._mapLayer = new PIXI.Container()
        this._uiLayer = new PIXI.Container()
        this._bgGraphics = new PIXI.Graphics()
        this._mapGraphics = new PIXI.Graphics()
        this._uiGraphics = new PIXI.Graphics()
        this._bgLayer.addChild(this._bgGraphics)
        this._mapLayer.addChild(this._mapGraphics)
        this._uiLayer.addChild(this._uiGraphics)
        this._app.stage.addChild(this._bgLayer, this._mapLayer, this._uiLayer)
        this.drawMapBG()
        this.drawCursor()
        this.setupCells()
        this.drawMap()

    }

    setupCells(){
        for(let ii=0;ii<this._mapRow;ii++) {
            this._cells[ii] = []
            for(let jj=0;jj<this._mapCol;jj++) {
                this._cells[ii][jj] = {w:Map.WallType.None,
                                       n:Map.WallType.None,
                                       e:Map.WallType.None,
                                       s:Map.WallType.None,
                                       memo:'',
                                       label:'',
                                       labelObj:0}
            }
        }
    }

    loadLabels(){
        const cursorX = this._cursorX
        const cursorY = this._cursorY
        
        for(let ii=0;ii<this._mapRow;ii++) {
            for(let jj=0;jj<this._mapCol;jj++) {
                this._cursorX = jj
                this._cursorY = ii
                if(this._cells[ii][jj]['label'] !== '') {
                    this._cells[ii][jj]['labelObj'] = 0
                    this.addLabel(this._cells[ii][jj]['label'])
                }
            }
        }

        this._cursorX = cursorX
        this._cursorY = cursorY
    }


    drawMapBG(){
        this._bgGraphics.lineStyle(1, 0xaaaaaa, 1);
        for(let ii=0;ii<this._mapRow;ii++) {
            this._bgGraphics.moveTo(0, ii*this._mapChipSize);
            this._bgGraphics.lineTo(this._mapCol*this._mapChipSize, ii*this._mapChipSize);
        }
        for(let jj=0;jj<this._mapCol;jj++) {
            this._bgGraphics.moveTo(jj*this._mapChipSize, 0);
            this._bgGraphics.lineTo(jj*this._mapChipSize,this._mapRow*this._mapChipSize);
        }
    }

    drawMap(){
        const mapGraphics = this._mapGraphics
        const chipSize = this._mapChipSize
        mapGraphics.clear()
        mapGraphics.lineStyle(2, 0x222222, 1);
        for(let ii=0;ii<this._mapRow;ii++) {
            for(let jj=0;jj<this._mapCol;jj++) {
                // this._cels[ii][jj] = {w:1,n:0,e:0,s:0,memo:''}
                const cell = this._cells[ii][jj]

                /*********************************************************************
                 * WALL
                 *********************************************************************/
                if(cell.w === Map.WallType.Wall) {
                    mapGraphics.moveTo(jj*chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize, ii*chipSize+chipSize)
                }

                if(cell.e === Map.WallType.Wall) {
                    mapGraphics.moveTo(jj*chipSize+chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize, ii*chipSize+chipSize)
                }
                if(cell.n === Map.WallType.Wall) {
                    mapGraphics.moveTo(jj*chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize, ii*chipSize)
                }
                if(cell.s === Map.WallType.Wall) {
                    mapGraphics.moveTo(jj*chipSize, ii*chipSize+chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize, ii*chipSize+chipSize)
                }


                
                /*********************************************************************
                 * DOOR
                 *********************************************************************/
                if(cell.w === Map.WallType.Door) {
                    mapGraphics.moveTo(jj*chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize, ii*chipSize+chipSize*.3)

                    mapGraphics.moveTo(jj*chipSize, ii*chipSize+chipSize)
                    mapGraphics.lineTo(jj*chipSize, ii*chipSize+chipSize-chipSize*.3)
                }
                if(cell.e === Map.WallType.Door) {
                    mapGraphics.moveTo(jj*chipSize+chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize, ii*chipSize+chipSize*.3)

                    mapGraphics.moveTo(jj*chipSize+chipSize, ii*chipSize+chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize, ii*chipSize+chipSize-chipSize*.3)
                }
                if(cell.n === Map.WallType.Door) {
                    mapGraphics.moveTo(jj*chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize*.3, ii*chipSize)

                    mapGraphics.moveTo(jj*chipSize+chipSize, ii*chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize-chipSize*.3, ii*chipSize)
                }
                if(cell.s === Map.WallType.Door) {
                    mapGraphics.moveTo(jj*chipSize, ii*chipSize+chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize*.3, ii*chipSize+chipSize)

                    mapGraphics.moveTo(jj*chipSize+chipSize, ii*chipSize+chipSize)
                    mapGraphics.lineTo(jj*chipSize+chipSize-chipSize*.3, ii*chipSize+chipSize)

                }
            }
        }
    }

    drawCursor(){
        this._uiGraphics.clear()
        this._uiGraphics.beginFill(0xdd0000);
        this._uiGraphics.drawRect(this._cursorX*this._mapChipSize+2,
                                  this._cursorY*this._mapChipSize+2,
                                  this._mapChipSize-4,
                                  this._mapChipSize-3);
        this._uiGraphics.endFill();
    }

    moveCursor(direction){
        if(direction == 'up') {
            this._cursorY -= 1
        }
        if(direction == 'down') {
            this._cursorY += 1
        }
        if(direction == 'left') {
            this._cursorX -= 1
        }
        if(direction == 'right') {
            this._cursorX += 1
        }
        this.drawCursor()
    }

    toggleWall(direction, isShift){
        
        let wall = Map.WallType.Wall
        if(isShift){
            wall = Map.WallType.Door
        }

        // 設定済みなら空にする
        if(this._cells[this._cursorY][this._cursorX][direction] === wall) {
            wall = Map.WallType.None
        }
        this._cells[this._cursorY][this._cursorX][direction] = wall;
        this.drawMap()
    }

    addLabel(text){
        this._cells[this._cursorY][this._cursorX]["label"] = text;
        
        // Empty case
        if(text === '' && this._cells[this._cursorY][this._cursorX]["labelObj"]){
            this._uiLayer.removeChild(this._texts[this._cells[this._cursorY][this._cursorX]["labelObj"]])
            this._cells[this._cursorY][this._cursorX]["labelObj"] = 0
            return
        }

        if(this._cells[this._cursorY][this._cursorX]["labelObj"] == 0) {
            let label = new PIXI.Text(text,{fontFamily : 'Arial', fontSize: 16, fill : 0x222222, align : 'left'});
            label.x = this._cursorX*this._mapChipSize+2
            label.y = this._cursorY*this._mapChipSize+2
            this._cells[this._cursorY][this._cursorX]["labelObj"] = this._textsHandle
            this._texts[this._textsHandle] = label
            this._textsHandle++
            this._uiLayer.addChild(label)
        }else{
            this._texts[this._cells[this._cursorY][this._cursorX]["labelObj"]].text = text
        }
    }

    getLabel(){
        return this._cells[this._cursorY][this._cursorX]["label"]
    }

    DebugUpdateCell(){
        this._cells[2][10].w = 1;
        this.drawMap()
    }

    save(){
        const jsonString = JSON.stringify(this._cells)
        localStorage.setItem('mapdata', jsonString)
    }

    load(){
        const jsonString = localStorage.getItem('mapdata')
        this._cells = JSON.parse(jsonString)
        this.drawMap()
        this.loadLabels()
    }
}

Map.WallType = {}
Map.WallType.None = 0;
Map.WallType.Wall = 1;
Map.WallType.Door = 2;

Map.FloorType = {}
Map.FloorType.None = 0;
Map.FloorType.Normal = 1;
Map.FloorType.Gray = 2;

