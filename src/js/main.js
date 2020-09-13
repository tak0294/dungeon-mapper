import Common from "./_modules/_common";
import Map from "./_modules/_map";

class Main {

    constructor() {
        this._isShift = false
        this.initializeCommon();
    }

    /******************************************************************
     * 全ページ共通処理
     *****************************************************************/
    initializeCommon() {

        const _this = this;
        this._common = new Common();
        this._map = new Map();
        // this._map.DebugUpdateCell()
        $(window).on("keyup", function(e) {
            if(e.keyCode == 16) {
                _this._isShift = false;
            }

        })

        $(window).on("keydown", function(e) {

            if(e.keyCode == 17 || e.keyCode == 82) return;
            if(e.keyCode == 16) {
                _this._isShift = true;
            }

            // move
            if(e.keyCode == 38) {
                _this._map.moveCursor('up')
            }
            if(e.keyCode == 39) {
                _this._map.moveCursor('right')
            }
            if(e.keyCode == 40) {
                _this._map.moveCursor('down')
            }
            if(e.keyCode == 37) {
                _this._map.moveCursor('left')
            }

            // wall
            if(e.keyCode == 87) {
                // w
                _this._map.toggleWall('n', _this._isShift)
            }
            if(e.keyCode == 65) {
                // a
                _this._map.toggleWall('w', _this._isShift)
            }
            if(e.keyCode == 83) {
                // s
                _this._map.toggleWall('s', _this._isShift)
            }
            if(e.keyCode == 68) {
                // d
                _this._map.toggleWall('e', _this._isShift)
            }

            // label
            if(e.keyCode === 76) {
                const inputText =  window.prompt("ラベルを入力してください", _this._map.getLabel());
                _this._map.addLabel(inputText)
            }

            // save
            if(e.keyCode === 49) {
                _this._map.save()
            }

            // load
            if(e.keyCode === 50) {
                _this._map.load()
            }


            e.preventDefault();
        });

    }
}

$(function() {
    new Main();
});
