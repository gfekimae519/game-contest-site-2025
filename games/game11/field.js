// game.js に追加する Field クラスの定義
class Field {
    constructor(ctx, startX, startY, size, count,shapeName) {
        this.ctx = ctx;
        this.startX = startX;
        this.startY = startY;
        this.size = size;
        this.count = count;
        this.cellSize = size / count;
        this.shapes=FieldShape[shapeName].shapes;
        this.bonusPrice=FieldShape[shapeName].bonus;
        // 線のスタイルは一度設定すれば良い
        this.colorMap = [];
        for(let i=0;i<count;i++){
            const row=[];
            for(let j=0;j<count;j++){
                let temp={color:"white",alpha:1}
                if(this.shapes[i][j]===0){
                    temp.color="black";
                }
                row.push(temp);
            }
            this.colorMap.push(row);
        }
    }
    
    draw() {
        const { ctx, startX, startY, count, cellSize,colorMap } = this;

        ctx.beginPath();

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        for(let y=0;y<count;y++){
            for(let x=0;x<count;x++){
                const drawX=startX+x*cellSize;
                const drawY=startY+y*cellSize;
                const cellcolor = colorMap[y][x].color;
                const cellalpha = colorMap[y][x].alpha;
                ctx.fillStyle = cellcolor;
                this.ctx.globalAlpha=cellalpha;
                ctx.fillRect(drawX,drawY,cellSize,cellSize);
                ctx.strokeRect(drawX,drawY,cellSize,cellSize);
            }
        }
        this.ctx.globalAlpha=1;
        ctx.stroke();
    }

    canPlace(pieceShape, startCol, startRow) {
        // 外部からフィールドデータを受け取る必要がなく、this.gridData を直接使用できる
        const fieldRows = this.count;
        const fieldCols = this.count;

        for (let py = 0; py < pieceShape.length; py++) {
            for (let px = 0; px < pieceShape[py].length; px++) {
                
                if (pieceShape[py][px] === 1) {
                    const currentFieldY = startRow + py;
                    const currentFieldX = startCol + px;

                    // 1. 境界チェック (this.rows/this.cols を使用)
                    if (currentFieldY < 0 || currentFieldY >= fieldRows ||
                        currentFieldX < 0 || currentFieldX >= fieldCols) {
                        return false;
                    }

                    // 2. 空きチェック (this.gridData を使用)
                    if (this.colorMap[currentFieldY][currentFieldX].color !== "white" &&this.colorMap[currentFieldY][currentFieldX].alpha===1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    drawShadow(pieceShape, startCol, startRow,color,alpha) {
        
        //this.ctx.globalAlpha = 0.3;
        for (let py = 0; py < pieceShape.length; py++) {
            for (let px = 0; px < pieceShape[py].length; px++) {
                //this.colorMap[currentFieldY][currentFieldX].alpha=1;
                if (pieceShape[py][px] === 1) {
                    const currentFieldY = startRow + py;
                    const currentFieldX = startCol + px;

                    this.colorMap[currentFieldY][currentFieldX].color=color;
                    this.colorMap[currentFieldY][currentFieldX].alpha=alpha;
                }
            }
        }
        //this.ctx.globalAlpha = 1.0;
    }

    shadowClear(){
        for(let y=0;y<this.count;y++){
            for(let x=0;x<this.count;x++){
                if(this.colorMap[y][x].alpha!==1){
                    this.colorMap[y][x].alpha=1;
                    this.colorMap[y][x].color="white";
                }
            }
        }
    }

    setColor(pieceShape, startCol, startRow,color) {
        let changeGrids=[];
        for (let py = 0; py < pieceShape.length; py++) {
            for (let px = 0; px < pieceShape[py].length; px++) {
                if (pieceShape[py][px] === 1) {
                    const currentFieldY = startRow + py;
                    const currentFieldX = startCol + px;

                    this.colorMap[currentFieldY][currentFieldX].color=color;
                    this.colorMap[currentFieldY][currentFieldX].alpha=1;

                    const changeGrid={col:currentFieldX,row:currentFieldY};
                    changeGrids.push(changeGrid);
                }
            }
        }
        return changeGrids;
    }

    CheckField(){
        for (let y = 0; y < this.colorMap.length; y++) {
            for (let x = 0; x < this.colorMap[y].length; x++) {
                if (this.shapes[y][x] === 1) {
                    if(this.colorMap[y][x].color==="white"){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    ResetSize(startX, startY, size, count){
        this.startX = startX;
        this.startY = startY;
        this.size = size;
        this.count = count;
        this.cellSize = size / count;
    }
}

const FieldShape={
    // Iミノ (水色)
    '3x3': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,0],
            [0, 1, 1, 1,0], // 4x4グリッドで定義
            [0, 1, 1, 1,0],
            [0, 1, 1, 1,0],
            [0, 0, 0, 0,0]
        ],
        bonus:7
    },
    'Rhombus': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 1, 0,0],
            [0, 1, 1, 1,0], // 4x4グリッドで定義
            [1, 1, 1, 1,1],
            [0, 1, 1, 1,0],
            [0, 0, 1, 0,0]
        ],
        bonus:14
    },
    'Stair2': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,0],
            [0, 1, 1, 0,0], // 4x4グリッドで定義
            [0, 1, 1, 1,0],
            [0, 1, 1, 1,0],
            [0, 0, 0, 0,0]
        ],
        bonus:8
    },
    'Stair2_R': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,0],
            [0, 0, 1, 1,0], // 4x4グリッドで定義
            [0, 1, 1, 1,0],
            [0, 1, 1, 1,0],
            [0, 0, 0, 0,0]
        ],
        bonus:8
    },
    'Stair3': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,0],
            [0, 1, 0, 0,0], // 4x4グリッドで定義
            [0, 1, 1, 0,0],
            [0, 1, 1, 1,0],
            [0, 0, 0, 0,0]
        ],
        bonus:7
    },
    'Stair3_R': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,0],
            [0, 0, 0, 1,0], // 4x4グリッドで定義
            [0, 0, 1, 1,0],
            [0, 1, 1, 1,0],
            [0, 0, 0, 0,0]
        ],
        bonus:7
    },
    '4x4': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,0],
            [0, 1, 1, 1,1], // 4x4グリッドで定義
            [0, 1, 1, 1,1],
            [0, 1, 1, 1,1],
            [0, 1, 1, 1,1]
        ],
        bonus:9
    },
    'Stair4': {
        // 最初の回転パターン
        shapes: [
            [0, 1, 0, 0,0],
            [0, 1, 1, 0,0], // 4x4グリッドで定義
            [0, 1, 1, 1,0],
            [0, 1, 1, 1,1],
            [0, 0, 0, 0,0]
        ],
        bonus:10
    },
    'Stair4_R': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,1],
            [0, 0, 0, 1,1], // 4x4グリッドで定義
            [0, 0, 1, 1,1],
            [0, 1, 1, 1,1],
            [0, 0, 0, 0,0]
        ],
        bonus:10
    },
    'L': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 0, 0,0],
            [1, 1, 0, 0,0], // 4x4グリッドで定義
            [1, 1, 0, 0,0],
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1]
        ],
        bonus:14
    },
    '5x5': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1], // 4x4グリッドで定義
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1]
        ],
        bonus:14
    },
    'Face': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 0, 1, 0,1], // 4x4グリッドで定義
            [1, 1, 1, 1,1],
            [1, 1, 0, 1,1],
            [1, 1, 1, 1,1]
        ],
        bonus:14
    },
    'H': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 0, 1,1],
            [1, 1, 0, 1,1], // 4x4グリッドで定義
            [1, 1, 1, 1,1],
            [1, 1, 0, 1,1],
            [1, 1, 0, 1,1]
        ],
        bonus:12
    },
    'T': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1], // 4x4グリッドで定義
            [0, 0, 1, 0,0],
            [0, 0, 1, 0,0],
            [0, 0, 1, 0,0]
        ],
        bonus:12
    },
    'Creeper': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 0, 1, 0,1], // 4x4グリッドで定義
            [1, 1, 0, 1,1],
            [1, 0, 0, 0,1],
            [1, 0, 1, 0,1]
        ],
        bonus:18
    },
    'Stair5': {
        // 最初の回転パターン
        shapes: [
            [1, 0, 0, 0,0],
            [1, 1, 0, 0,0], // 4x4グリッドで定義
            [1, 1, 1, 0,0],
            [1, 1, 1, 1,0],
            [1, 1, 1, 1,1]
        ],
        bonus:12
    },
    'Stair5_R': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0,1],
            [0, 0, 0, 1,1], // 4x4グリッドで定義
            [0, 0, 1, 1,1],
            [0, 1, 1, 1,1],
            [1, 1, 1, 1,1]
        ],
        bonus:12
    },
    'Pillars5': {
        shapes: [
            [1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1]
        ],
        bonus:14
    },
    'Pyramid5': {
        shapes: [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ],
        bonus:9
    },
    'Slalom5': {
        shapes: [
            [1, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 1, 1, 1]
        ],
        bonus: 16
    },
    'Slalom5_R': {
        shapes: [
            [0, 1, 1, 1, 1],
            [0, 1, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [1, 1, 1, 1, 0]
        ],
        bonus: 16
    },
    'O5': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 0, 0, 0,1], // 4x4グリッドで定義
            [1, 0, 0, 0,1],
            [1, 0, 0, 0,1],
            [1, 1, 1, 1,1]
        ],
        bonus:14
    },
    'O2': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1], // 4x4グリッドで定義
            [1, 1, 0, 1,1],
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1]
        ],
        bonus:16
    },
    'n': {
        // 最初の回転パターン
        shapes: [
            [1, 1, 1, 1,1],
            [1, 1, 1, 1,1], // 4x4グリッドで定義
            [1, 1, 0, 1,1],
            [1, 1, 0, 1,1],
            [1, 1, 0, 1,1]
        ],
        bonus:14
    },
    'Star': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 1, 0,0],
            [0, 1, 1, 1,0], // 4x4グリッドで定義
            [1, 1, 1, 1,1],
            [0, 1, 0, 1,0],
            [1, 0, 0, 0,1]
        ],
        bonus:18
    }
};