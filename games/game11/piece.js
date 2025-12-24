class Piece{
    
    constructor(ctx,color,pieceName,startPosX,startPosY,sellSize){
        this.ctx=ctx;
        this.color=color;
        this.Pos={x:startPosX,y:startPosY};
        this.startPos={x:startPosX,y:startPosY};
        this.pieceName=pieceName;
        this.mapdata=PIECES[this.pieceName].shapes;
        this.price=PIECES[this.pieceName].price;
        this.sellSize=sellSize;
        this.square={width:this.mapdata.length*this.sellSize,height:this.mapdata[0].length*this.sellSize,}
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        for(let y=0;y<this.mapdata.length;y++){
            for(let x=0;x<this.mapdata[y].length;x++){
                const pieceX=this.Pos.x+x*this.sellSize;
                const pieceY=this.Pos.y+y*this.sellSize;
                if(this.mapdata[y][x]===1){
                    this.ctx.fillRect(pieceX,pieceY,this.sellSize,this.sellSize);
                    this.ctx.strokeRect(pieceX,pieceY,this.sellSize,this.sellSize);
                }
            }
        }
        // 描画後はパスを閉じる
        this.ctx.stroke();
    } 

    //90度右回転
    rotaion(){
        const N = this.mapdata.length; // ピースのサイズ (N x N)
        // 新しい配列を作成して、回転後のデータを格納
        const newMapdata = Array(N).fill(0).map(() => Array(N).fill(0));

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                // 90度右回転の公式: new[y][x] = old[N-1-x][y]
                newMapdata[y][x] = this.mapdata[N - 1 - x][y];
            }
        }
        
        // this.mapdataを更新
        this.mapdata = newMapdata;

        // 回転によって縦横のサイズが変わる可能性があるので、当たり判定のサイズも更新 (例: Iミノの縦と横)
        // mapdataはN x Nの正方行列なので、widthとheightは常に同じになります。
        this.square.width = this.mapdata.length * this.sellSize;
        this.square.height = this.mapdata.length * this.sellSize;
    }

    // ... (Piece クラスの他のメソッドは省略) ...

    IsHit(mouseX,mouseY){
        // 矩形判定を削除し、グリッド単位で判定を行う

        // 1. まず、クリック座標がピースの全体を囲む矩形内にあるかをチェック (高速化のため)
        if(!(this.Pos.x <= mouseX && mouseX <= this.Pos.x + this.square.width
            && this.Pos.y <= mouseY && mouseY <= this.Pos.y + this.square.height)
        ){
            return false; // 全体矩形から外れていたら即座にfalse
        }

        // 2. マウス座標がピースのどのセル（グリッド）に該当するかを計算
        // ピースの原点からの相対座標
        const relativeX = mouseX - this.Pos.x;
        const relativeY = mouseY - this.Pos.y;

        // 該当するピースグリッドのインデックスを計算
        // sellSize は piece.js の Piece クラス内で定義されたピースの各セルのサイズ
        const gridX = Math.floor(relativeX / this.sellSize);
        const gridY = Math.floor(relativeY / this.sellSize);

        // 3. 該当セルが mapdata 内のブロック（値が 1）であるかをチェック
        if (
            gridY >= 0 && gridY < this.mapdata.length && // 範囲チェック
            gridX >= 0 && gridX < this.mapdata[0].length // 範囲チェック
        ) {
            // mapdata[y][x] が 1 ならヒット
            if (this.mapdata[gridY][gridX] === 1) {
                return true;
            }
        }
        
        // 1のブロックではない、または範囲外の場合
        return false;
    }
}

class PieceSlot{
    constructor(ctx,startX,startY,size,piece){
        this.ctx=ctx;
        this.startX=startX;
        this.startY=startY;
        this.size=size;
        this.piece=piece;
        this.selectFlag=false;//移動ピース確定したことの判定
        this.isSelecting=false;//ピースを選択するときの選択中の判定

        this.pieceStartPos={x:this.piece.startPos.x,y:this.piece.startPos.y};
        this.pieceCellSize=this.piece.sellSize;
    }
    Draw(){
        this.ctx.beginPath();

        if(this.selectFlag){
            this.ctx.strokeStyle = "red";
        }
        else if(this.isSelecting){
            this.ctx.strokeStyle = "orange";
        }
        else{
            this.ctx.strokeStyle = "black";
        }
        
        this.ctx.lineWidth = 5;

        this.ctx.fillStyle="white";
        this.ctx.fillRect(this.startX,this.startY,this.size,this.size);
        this.ctx.strokeRect(this.startX,this.startY,this.size,this.size);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        
        ctx.stroke();
    }
}


// 各テトロミノの形状と回転パターンを保持する定数
const PIECES = {
    // Iミノ (水色)
    'I4': {
        // 最初の回転パターン
        shapes: [
            [0, 0, 0, 0],
            [1, 1, 1, 1], // 4x4グリッドで定義
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        price:4
    },
    'O3': {
        shapes: [
            [1, 1, 1],
            [1, 1, 1], // 3x3グリッドで定義
            [1, 1, 1]
        ],
        price:3
    },
    'C': {
        shapes: [
            [1, 1, 1],
            [1, 0, 0], // 3x3グリッドで定義
            [1, 1, 1]
        ],
        price:3
    },
    'O': {
        shapes: [
            [1, 1, 1],
            [1, 0, 1], // 3x3グリッドで定義
            [1, 1, 1]
        ],
        price:2
    },
    // Lミノ (オレンジ)
    'L': {
        shapes: [
            [0, 1, 0],
            [0, 1, 0], // 3x3グリッドで定義
            [0, 1, 1]
        ],
        price:3
    },
    // Jミノ (青)
    'J': {
        shapes: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ],
        price:3
    },
    'I3': {
        shapes: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ],
        price:4
    },
    // Oミノ (黄色)
    'O2': {
        // Oミノは回転しても形が変わらない
        shapes: [
            [1, 1], // 2x2グリッドで定義
            [1, 1]
        ],
        price:4
    },
    // Tミノ (紫)
    'T': {
        shapes: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ],
        price:2
    },
    // Sミノ (緑)
    'S': {
        shapes: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        price:2
    },
    // Zミノ (赤)
    'Z': {
        shapes: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        price:2
    },
    'I2': {
        shapes: [
            [1, 0],
            [1, 0]
        ],
        price:6
    },
    'L2': {
        shapes: [
            [1, 0],
            [1, 1]
        ],
        price:4
    },
    '1': {
        shapes: [
            [1]
        ],
        price:6
    },
};

const PIECE_COLORS = [
    'cyan',
    'orange',
    'blue',
    'yellow',
    'purple',
    'lime', // 緑
    'red',
    'cyan', // I2も水色
];

