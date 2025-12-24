const canvas =document.getElementById("gameCanvas");
const ctx =canvas.getContext("2d");

//==================================================
// 1. スケール係数の導入とリサイズ処理
//==================================================

//-----------------------------------------------------------------------------
let scaleFactor = 1; // スケール係数
const baseWidth = 700; // HTMLで設定されたキャンバスの論理幅 (width="700")

function resizeCanvas() {
    // 実際の表示サイズを取得 (CSSでスケーリングされたサイズ)
    const displayWidth = canvas.clientWidth;

    // スケール係数を計算: 
    // (表示幅) / (論理幅) -> これでマウス座標を補正する
    scaleFactor = displayWidth / baseWidth;
}

// 初期ロード時とウィンドウサイズ変更時に実行
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 初期実行


//--------------------------------------------------------------------------------------
// タッチイベント用のヘルパー関数
function getTouchPos(canvas, touchEvent) {
    const rect = canvas.getBoundingClientRect();
    // 最初の指の情報を取得
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    
    // ブラウザ上の座標からキャンバス上の座標（CSSスケーリング後）を計算
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // スケール係数で割って論理座標（ゲーム内の700x700座標系）に変換
    const logicalX = touchX / scaleFactor;
    const logicalY = touchY / scaleFactor;
    
    return { x: logicalX, y: logicalY };
}

//==================================================
// 2. ゲーム初期設定 (変更なし)
//==================================================

//ゲーム設定
let random;
let isGameClear=false;
let isGmaeOver=false;
let nowState=0;
const gameState=[
    "game",
    "result",
    "shop"
];
let Stage=1;
let MyMoney=0;
let usePieceCount=0;//所持ピースの数-使ったピースの数

//フィールドの設定
let field;
const fieldSize=400;
const gridCount=5;
const sellSize=fieldSize/gridCount;
let fileldX=(baseWidth-fieldSize)/2;
let fileldY=50;
const fShapeArray=Object.keys(FieldShape);


//ピース設定
let pieceCount=9;
let pieces=[];
let pieceMag=0.5;
const pieceStartX=50;
const pieceStartY=400;
const keyArray=Object.keys(PIECES);

//スロット設定
let slots=[];
const allSlotWidth=600;
const slotSize=allSlotWidth/3;
const slotStartX=(baseWidth-allSlotWidth)/2;
const slotStartY=fileldY+fieldSize+sellSize;
let maxslotCount=9;

//行動記録の設定
let memorySlot=[];
let backNum=0;

//キーの設定
let isZPress=false;
let isYPress=false;
let isKeyMoving = false; // キーボードによるピース移動中フラグ
let isMouseMoving=false;
let isSpacePress = false; // スペース/エンターキーのキーリピート防止用フラグ
let isWASDPress = false; // WASDキーのキーリピート防止（全モード共通）
let isDragging = false; // ドラッグ中かどうかを示すフラグ


let selectPiece;
let selectGrid={col:0,row:0};
let canDrop;
let gridX=0;
let gridY=0;
let beforeGridX=0;
let beforeGridY=0;

let speed=5;
let isRot = false; 

//shop
let shopScene;
const shopScenePos={x:50,y:50}

//
let resultScene;

//デバッグ用
let tempFlag;

let offsetX, offsetY;   // マウス他とオブジェクトの原点との距離を保持する変数
//---------------------------------------------------------------------------------------------------


function ToShop(){
    shopScene=new ShopScene(
        ctx,
        canvas,
        keys,
        shopScenePos,
        sellSize,
        slots,
        MyMoney,
        ExitShop
    );
    
    slots=[];
    field=null;
    nowState=2;

    resultScene=null;
    draw();
    stsrtGameLoop();
}
function ExitShop(){
    const random=Math.floor(Math.random()*shopScene.nextFiled.length);
    
    ResetGame(
        shopScene.nextFiled[random],
        shopScene.money,
        shopScene.MySlots,
        Stage
    );

    shopScene=null;
    draw();
    stsrtGameLoop();
}
function ToResult(gameClearFlag,func){
    if(resultScene)resultScene=null;
    resultScene=new ResultScene(
        ctx,
        canvas,
        keys,
        MyMoney,
        field.bonusPrice,
        usePieceCount,
        Stage,
        gameClearFlag,
        field,
        func
    );
    if(gameClearFlag){
        let pieceBounus=0;
        if(usePieceCount<=5){
            pieceBounus=6-usePieceCount;
        }
        MyMoney+=field.bonusPrice+pieceBounus;
        Stage++;
    }
    nowState=1;
    draw();
    stsrtGameLoop();
}
function ExitResult(){
    //resultScene=null;
    field=null;
    Start();
}
function GameClear(){
    ToResult(true,ToShop);
}

function GameOver(){
    ToResult(false,ExitResult);
}
function ResetGame(newField,money,myslots,stage){
    isGameClear=false;
    isGmaeOver=false;
    Stage=stage;
    MyMoney=money;
    usePieceCount=0;
    nowState=0;

    fileldX=(baseWidth-fieldSize)/2;
    fileldY=50;
    field=newField;
    field.ResetSize(fileldX,fileldY,fieldSize,gridCount);

    pieceCount=9;
    pieceMag=0.5;

    slots=[];
    slots=myslots;
    maxslotCount=9;

    memorySlot=[];
    backNum=0;

    isKeyMoving = false; 
    isMouseMoving=false;
    isSpacePress = false;
    selectGrid={col:0,row:0};
    isWASDPress = false; 

    selectPiece=null;
    canDrop=null;
    gridX=0;
    gridY=0;
    beforeGridX=0;
    beforeGridY=0;

    speed=5;

    isRot = false; 
    isDragging = false;
    offsetX=0;
    offsetY=0; 

    slots[selectGrid.col + selectGrid.row * 3].isSelecting=true;
}
function checkGameOver() {
    const fieldRows = field.count;
    const fieldCols = field.count;

    // スロットに残っているピースが一つでも配置可能であれば false
    for (const slot of slots) {
        if (slot.piece) {
            let currentShape = slot.piece;
            
            // 4方向の回転をチェック (0度, 90度, 180度, 270度)
            for (let r = 0; r < 4; r++) {
                // フィールドの全マスをチェック（ピースの左上が来る可能性のある位置）
                for (let row = 0; row < fieldRows; row++) {
                    for (let col = 0; col < fieldCols; col++) {
                        // ピースの形状とフィールド上の位置を渡して配置判定
                        if (field.canPlace(currentShape.mapdata, col, row)) {
                            return false; // 配置可能なピースが見つかった
                        }
                    }
                }
                // 次の回転を試すために形状を回転させる（一時的なデータ）
                currentShape.rotaion();
            }
        }
    }
    return true; // 全てのピースが配置不能
}

// 3. キーボード入力の管理
const keys = {}
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});


// ==================================================
// 共通操作処理関数
// ==================================================



/**
 * ドラッグ中のピースの位置を更新する処理
 * @param {number} x - 論理X座標
 * @param {number} y - 論理Y座標
 */
function handleDragMove() {
    if (!isDragging || !selectPiece) return;

    // 配置可能かどうかの判定を更新
    beforeGridX = gridX;
    beforeGridY = gridY;
    gridX = Math.floor((selectPiece.Pos.x - field.startX) / field.cellSize);
    gridY = Math.floor((selectPiece.Pos.y - field.startY) / field.cellSize);
    canDrop = field.canPlace(selectPiece.mapdata, gridX, gridY);

    draw();
}

/**
 * ピースをフィールドにドロップし、配置を確定する処理
 * @param {number} gridX - フィールドグリッドX座標
 * @param {number} gridY - フィールドグリッドY座標
 * @param {boolean} canDrop - 配置可能かどうか
 */
function handleDrop(gridX, gridY, canDrop) {
    if (!isDragging || !selectPiece) return;

    if (canDrop) {
        // フィールドに色を塗り、変更されたグリッド情報を取得
        const memoryGrid = field.setColor(selectPiece.mapdata, gridX, gridY, selectPiece.color);

        let slotIndex = -1;
        // どのスロットからピースが配置されたか特定し、スロットをクリア
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].selectFlag) {
                slots[i].piece = null;
                slots[i].selectFlag = false;
                slotIndex = i; // インデックスを記録
                break;
            }
        }

        // backNumが0でない場合（アンドゥ履歴がある場合）、リドゥ履歴を破棄
        if (backNum > 0) {
            memorySlot.splice(memorySlot.length - backNum);
            backNum = 0;
        }

        // 履歴に追加
        const memory = { piece: selectPiece, grids: memoryGrid, index: slotIndex };
        memorySlot.push(memory);

        usePieceCount++;
    } else {
        
        // 選択フラグを解除
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].selectFlag) {
                slots[i].selectFlag = false;
                break;
            }
        }
    }
    isGameClear=field.CheckField();
    isGmaeOver = checkGameOver();
    if(isGameClear){
        GameClear();
    }else if(isGmaeOver){
        tempFlag=true;
        GameOver();
    }
    // ゲームクリアではない、かつ、全てのピースが配置不可能になった場合
    /*if (!isGameClear && checkGameOver()) {
        isGmaeOver = true;
    }*/
    selectPiece.Pos.x = selectPiece.startPos.x;
    selectPiece.Pos.y = selectPiece.startPos.y;
    selectPiece = null;
    // 選択スロットをハイライトし直す
    const index = selectGrid.col + selectGrid.row * 3;
    if (slots[index]) {
        slots[index].isSelecting = true;
    }
}
//==================================================
// 3. マウスイベント (座標を scaleFactor で補正)
//==================================================
// --- mousedown の修正 ---
canvas.addEventListener('mousedown', (e) => {
    // マウス座標を論理座標に変換
    const mouseX = e.offsetX / scaleFactor;
    const mouseY = e.offsetY / scaleFactor;
    switch(gameState[nowState]){
        case "game":
            if(!isKeyMoving){
                for (let i = 0; i < slots.length; i++) {
                    // ... (ピース選択ロジック) ...
                    if (slots[i].piece && slots[i].piece.IsHit(mouseX, mouseY)) {
                        selectPiece = slots[i].piece;
                        // スロットのハイライト解除（キーボードで選択していた場合）
                        if (slots[i].isSelecting) slots[i].isSelecting = false; 
                    
                        offsetX = mouseX - selectPiece.Pos.x;
                        offsetY = mouseY - selectPiece.Pos.y;
                        isDragging = true;
                        slots[i].selectFlag = true;
                    
                        break; 
                    }
                }
                isMouseMoving=true;
            }
            break;
        case "result":
            resultScene.MouseDown(mouseX,mouseY);
            break;
        case "shop":
            shopScene.MouseDown(mouseX,mouseY);
            break;
    }
    
    
});

// --- mousemove の修正 ---
canvas.addEventListener('mousemove', (e) => {
    switch(gameState[nowState]){
        case "game":
            if(!isKeyMoving&&isMouseMoving){
            // マウス座標を論理座標に変換
                const mouseX = e.offsetX / scaleFactor;
                const mouseY = e.offsetY / scaleFactor;
                selectPiece.Pos.x = mouseX - offsetX;
                selectPiece.Pos.y = mouseY - offsetY;
                // 共通関数を呼び出す
                handleDragMove();
            }
            break;
        case "result":
            break;
        case "shop":
            
            break;
    }
    
    
});

// --- mouseup の修正 ---
canvas.addEventListener('mouseup', (e) => {
    switch(gameState[nowState]){
        case "game":
            if(!isKeyMoving&&isMouseMoving){
                // gridX, gridY, canDrop は handleDragMove または update() で最新の状態が保持されている
                handleDrop(gridX, gridY, canDrop);
                isDragging=false;
                draw();
                isMouseMoving=false;
            }
            break;
        case "result":
            resultScene.MouseUp();
            break;
        case "shop":
            shopScene.MouseUp();
            break;
    }
    
});
//==================================================
// 4. タッチイベントの追加 (モバイル対応)
//==================================================

// --- touchstart の修正 ---
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const { x: mouseX, y: mouseY } = getTouchPos(canvas, e);
    
    // 共通関数を呼び出す
    handleStartDrag(mouseX, mouseY);
});

// --- touchmove の修正 ---
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const { x: mouseX, y: mouseY } = getTouchPos(canvas, e);
    
    // 共通関数を呼び出す
    handleDragMove(mouseX, mouseY);
});

// --- touchend の修正 ---
canvas.addEventListener('touchend', (e) => {
    // gridX, gridY, canDrop は touchmove で最新の状態が保持されている
    handleDrop(gridX, gridY, canDrop);
});

//==================================================
// 5. ゲームループと描画 (変更なし)
//==================================================

// Rキーが押されている間、回転が繰り返されるのを防ぐためのフラグとして使用


function draw() {
    // 1. 全体をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    switch(gameState[nowState]){
        case "game":
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("所持ピース", 130,500);
            ctx.fillText("ステージ"+Stage, baseWidth/2,20);
            ctx.fillText("所持金", 620,100);
            ctx.fillText(MyMoney+"G", 620,150);
            ctx.fillText("現在手数", 620,200);
            ctx.fillText(usePieceCount+"手", 620,250);
            ctx.fillText("報酬金", 620,300);
            ctx.fillText(field.bonusPrice+"G", 620,350);
            // ピースの位置が変わったとき、または回転が実行されたフレームのとき、影をクリア
            // isRotがtrueになったフレームは、必ず影をクリアします
            if(beforeGridX != gridX || beforeGridY != gridY || isRot) {
                field.shadowClear();
            }

            // ドラッグ中、現在の位置で配置可能かチェックし直す
            if (isDragging) {
                // 回転直後も含め、最新のmapdataで配置判定
                canDrop = field.canPlace(selectPiece.mapdata, gridX, gridY);

                if (canDrop) {
                    field.drawShadow(selectPiece.mapdata, gridX, gridY, selectPiece.color, 0.5);
                }
            }

            field.draw();

            for(let i=0;i<slots.length;i++){
                //pieces[i].draw();
                slots[i].Draw();
            }
            for(let i=0;i<slots.length;i++){
                //pieces[i].draw();
                if(slots[i].piece!==null){
                    slots[i].piece.draw();//スロットと分けて描写するのは描画順でスロットの下にピースが隠れてしまわないようにするため
                }
            }

            break;
        case "result":
            resultScene.Draw();
            break;
        case "shop":
            shopScene.Draw();
            break;
    }
    //ctx.fillText("tempFlag:"+tempFlag, 500,500);
}


function Start(){
    isGameClear=false;
    isGmaeOver=false;
    Stage=1;
    MyMoney=0;
    usePieceCount=0;
    nowState=0;

    fileldX=(baseWidth-fieldSize)/2;
    fileldY=50;
    field=new Field(ctx,fileldX,fileldY,fieldSize,gridCount,'3x3');

    pieceCount=9;
    pieces=[];
    pieceMag=0.5;

    slots=[];
    maxslotCount=9;

    memorySlot=[];
    backNum=0;

    isKeyMoving = false; 
    isMouseMoving=false;
    isSpacePress = false;
    selectGrid={col:0,row:0};
    isWASDPress = false; 

    selectPiece=null;
    canDrop=null;
    gridX=0;
    gridY=0;
    beforeGridX=0;
    beforeGridY=0;

    speed=5;

    isRot = false; 
    isDragging = false;
    offsetX=0;
    offsetY=0; 

    shopScene=null;
    resultScene=null;

    const startPiece=[
        'O3',
        'L',
        'J',
        'I3',
        'O2',
        'T',
        'I2',
        'L2',
        '1'

    ];
    for(let i=0;i<pieceCount;i++){
        const slotX=slotStartX+(i%3)*(slotSize+5);
        const slotY=slotStartY+(Math.floor(i/3))*(slotSize+5);//+2は枠線の分だけ

        //--------------------------------------------------------------------------------
        random=Math.floor(Math.random()*PIECE_COLORS.length);
        // ピースの色はPIECE_COLORSから取得するように変更（任意）
        const color = PIECE_COLORS[random]; 
        //--------------------------------------------------------------------------------
        random=Math.floor(Math.random()*startPiece.length);
        const pieceName=startPiece[i];
        const centerPos=(slotSize-PIECES[pieceName].shapes.length*sellSize*pieceMag)/2;
        const x=slotX+centerPos;//要調整
        const y=slotY+centerPos;
        let tempPiece=new Piece(ctx,color,pieceName,x,y,sellSize*pieceMag);
        
        const slot =new PieceSlot(ctx,slotX,slotY,slotSize,tempPiece);//配列の最後の要素
        slots.push(slot);
    }

    slots[selectGrid.col + selectGrid.row * 3].isSelecting=true;

    stsrtGameLoop();
    draw();
    //ToShop();

}

function update(){
    switch(gameState[nowState]){
        case "game":
            if(isDragging){
                // Rキーが押されている場合
                if(keys['r'] || keys['R']){
                    // isRotがfalse（前回のRキー押下から離された後）なら回転を実行
                    if(!isRot){
                        selectPiece.rotaion();

                        // 形状が変わったので、canDrop判定を更新
                        gridX = Math.floor((selectPiece.Pos.x - field.startX) / field.cellSize);
                        gridY = Math.floor((selectPiece.Pos.y - field.startY) / field.cellSize);
                        canDrop = field.canPlace(selectPiece.mapdata, gridX, gridY);

                        // 回転を実行したため、isRotをtrueに設定
                        isRot = true;

                        // 回転直後に描画を強制し、視覚的な遅延をなくす
                        draw();
                    }
                }else{
                    // Rキーが離されたら、isRotをfalseに戻し、次回のキー押下を受け付ける
                    isRot = false; 
                }
                if(isKeyMoving){
                    if (keys['w'] || keys['W'] || keys['a'] || keys['A'] || 
                    keys['s'] || keys['S'] || keys['d'] || keys['D'] ) { // 回転もキーリピートをチェック
                        /*if (keys['w'] || keys['W']) { selectPiece.Pos.y-=speed; } // 上
                        else if (keys['s'] || keys['S']) { selectPiece.Pos.y+=speed; } // 下
                        else if (keys['a'] || keys['A']) { selectPiece.Pos.x-=speed; } // 左
                        else if (keys['d'] || keys['D']) { selectPiece.Pos.x+=speed; }
                        handleDragMove();*/
                        if (!isWASDPress) {
                            isWASDPress=true;
                        }
                    }else{
                        isWASDPress=false;
                    }
                    if((keys[' '] || keys['Enter'])){
                        if(!isSpacePress){
                            gridX = Math.floor((selectPiece.Pos.x - field.startX) / field.cellSize);
                            gridY = Math.floor((selectPiece.Pos.y - field.startY) / field.cellSize);
                            canDrop = field.canPlace(selectPiece.mapdata, gridX, gridY);
                            //handleDrop(gridX,gridY,canDrop);
                            isSpacePress=true;
                            isKeyMoving=false;
                        }
                    } else {
                        isSpacePress = false;
                    }
                }

            }else{
                if(keys['z'] || keys['Z']){
                    // Zキーが押された瞬間のみ実行
                    if (!isZPress) { 
                        if(backNum < memorySlot.length){
                            // 現在のポインタ (memorySlot.length - 1 - backNum) にある履歴を取得
                            const indexToUndo = memorySlot.length - 1 - backNum;
                            const temp = memorySlot[indexToUndo];

                            // 1. ピースをスロットに戻す
                            // slots[temp.index] は PieceSlot オブジェクトなので、その piece プロパティに戻す。
                            slots[temp.index].piece = temp.piece;

                            // 2. フィールドの色を白に戻す (アンドゥ)
                            for(let i=0;i<temp.grids.length;i++){
                                const grid = temp.grids[i]; 
                                field.colorMap[grid.row][grid.col].color="white";
                                field.colorMap[grid.row][grid.col].alpha=1; 
                            }

                            // 3. backNumをインクリメントし、一つ前の状態を指すようにする
                            backNum++;
                        
                            usePieceCount--;

                            // 4. 描画を強制する
                            draw();
                        }
                        isZPress = true; // キーが押された状態を記録
                    }
                } else {
                    isZPress = false; // Zキーが離されたらリセット
                }
                if(keys['y'] || keys['Y']){
                    // Yキーが押された瞬間のみ実行
                    if (!isYPress) { 
                        if(backNum > 0){ // アンドゥの履歴が残っている場合のみリドゥ可能
                            // backNumをデクリメントし、リドゥする履歴のインデックスを計算
                            backNum--;
                            const indexToRedo = memorySlot.length - 1 - backNum;
                            const temp = memorySlot[indexToRedo];

                            // 1. スロットからピースを削除し、フィールドに色を再設定
                            slots[temp.index].piece = null;

                            // 2. フィールドに色を再設定 (リドゥ)
                            for(let i=0;i<temp.grids.length;i++){
                                const grid = temp.grids[i]; 
                                // piece オブジェクトに保存されている色を使用する必要があるが、
                                // memorySlot に格納されている piece オブジェクトから色を取得
                                field.colorMap[grid.row][grid.col].color=temp.piece.color;
                                field.colorMap[grid.row][grid.col].alpha=1; 
                            }

                            usePieceCount++;

                            // 3. 描画を強制する
                            draw();
                        }
                        isYPress = true; // キーが押された状態を記録
                    }
                } else {
                    isYPress = false; // Yキーが離されたらリセット
                }
                // WASDキーの処理（キーリピート防止）
                if (keys['w'] || keys['W'] || keys['a'] || keys['A'] || 
                    keys['s'] || keys['S'] || keys['d'] || keys['D'] ) { // 回転もキーリピートをチェック
                    isKeyMoving=true;
                    if (!isWASDPress) {
                    
                        // 前に選択されていたスロットのハイライトを解除
                        const prevIndex = selectGrid.col + selectGrid.row * 3;
                        if (slots[prevIndex]) {
                            slots[prevIndex].isSelecting = false;
                        }
                        // グリッドを移動
                        /*if (keys['w'] || keys['W']) { selectGrid.row = Math.max(0, selectGrid.row - 1); } // 上
                        if (keys['s'] || keys['S']) { selectGrid.row = Math.min((maxslotCount/3)-1, selectGrid.row + 1); } // 下
                        if (keys['a'] || keys['A']) { selectGrid.col = Math.max(0, selectGrid.col - 1); } // 左
                        if (keys['d'] || keys['D']) { selectGrid.col = Math.min(2, selectGrid.col + 1); } // 右
                        // 新しく選択されたスロットをハイライト
                        const newIndex = selectGrid.col + selectGrid.row * 3;
                        if (slots[newIndex]) {
                            slots[newIndex].isSelecting = true;
                        }*/
                        draw();
                        isWASDPress = true;
                    }
                } else {
                    isWASDPress = false;
                    isKeyMoving=false;
                }
                 // --- Space / Enter キーによる処理 ---
                if(keys[' '] || keys['Enter']){
                    if(!isSpacePress){
                        // 1. スロット選択モードでの確定
                        const prevIndex = selectGrid.col + selectGrid.row * 3;
                            if (slots[prevIndex]&& slots[prevIndex].piece) {
                                slots[prevIndex].isSelecting = false;
                                slots[prevIndex].selectFlag=true;
                                selectPiece=slots[prevIndex].piece;
                                isDragging=true;
                                isKeyMoving=true;
                            }
                        isSpacePress=true;
                    }

                } else {
                    isSpacePress = false;
                }
            }
            break;
        case "result":
        break;
        case "shop":
            shopScene.Update();
            break;
    }
    
}



let gameLoopId=null;
// 6. メインのゲームループ
function gameLoop() {
    update(); // 状態更新

    // 次のフレームで gameLoop を再度呼び出す
    gameLoopId = requestAnimationFrame(gameLoop);
}

function stsrtGameLoop(){
    if(!gameLoopId){
        gameLoop();
    }
}

Start();
