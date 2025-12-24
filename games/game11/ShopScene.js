class ShopScene{
    constructor(ctx,canvas,keys,ScenePos,cellSize,MySlots,money,onExit){
        this.ctx=ctx;
        this.canvas=canvas;
        this.keys=keys;

        this.sceneX=ScenePos.x;
        this.sceneY=ScenePos.y;
        //所持ピース
        this.MySlots=MySlots;
        //販売ピース
        this.slots=[];
        this.maxSlotCount=6;
        this.allSlotSize=400;
        this.pieceMag=0.3;
        this.cellSize=cellSize;
        this.slotSize=this.allSlotSize/3;
        this.slotStartX=50;
        this.slotStartY=70;
        //所持金
        this.money=money;
        //価格
        this.price=0;

        this.rerollPrice=2;

        this.onExit=onExit;
        

        for(let i=0;i<this.maxSlotCount;i++){
            const slotX=this.slotStartX+(i%3)*(this.slotSize+5);
            const slotY=this.slotStartY+(Math.floor(i/3))*(this.slotSize+5);//+2は枠線の分だけ

            let random=Math.floor(Math.random()*PIECE_COLORS.length);
            // ピースの色はPIECE_COLORSから取得するように変更（任意）
            const color = PIECE_COLORS[random]; 
            
            const keyArray=Object .keys(PIECES);
            random=Math.floor(Math.random()*keyArray.length);
            const pieceName=keyArray[random];
            const centerPos=(this.slotSize-PIECES[pieceName].shapes.length*this.cellSize*this.pieceMag)/2;
            const x=slotX+centerPos;//要調整
            const y=slotY+centerPos;
            let tempPiece=new Piece(this.ctx,color,pieceName,x,y,this.cellSize*this.pieceMag);
            
            const slot =new PieceSlot(this.ctx,slotX,slotY,this.slotSize,tempPiece);//配列の最後の要素
            this.slots.push(slot);
        }
        this.selectGrid={col:0,row:0};
        this.slots[this.selectGrid.col + this.selectGrid.row * 3].isSelecting=true;
        this.currentIndex=0;//購入する時の販売スロットの番号

        this.btn_yes=new Button(this.ctx,50,430,
            80,50,this.Buy.bind(this),"はい"
        );
        this.btn_No=new Button(this.ctx,230,430,
            80,50,this.Cancel.bind(this),"いいえ"
        );
        this.btn_end=new Button(this.ctx,500,420,
            150,50,this.onExit,"次のステージへ"
        );

        this.btn_reroll=new Button(this.ctx,500,350,
            150,50,this.Reroll.bind(this),"更新：2G"
        );
        this.btn_sell=new Button(this.ctx,250,this.canvas.height-50,
            150,50,this.Sell.bind(this),"売る"
        );
        this.btn_quit=new Button(this.ctx,450,this.canvas.height-50,
            150,50,this.QuitSell.bind(this),"やめる"
        );

        if(!this.sellSelecting){
            this.btn_sell.deActive=true;
        }

        if(this.money<this.rerollPrice){
            this.btn_reroll.deActive=true;
        }

        this.state=[
            "ChoosePiece",
            "YesorNo"
        ];
        this.currentState=0;
        this.nowButton=0;
        
        this.emptyIndex=MySlots.length;


        this.isKeyMoving = false;
        this.isMouseMoving=false;
        this.isSpacePress = false; 
        this.isWASDPress = false; 

        this.tempFlag=1;

        this.nextFiled=[];
        const fShapeArray=Object.keys(FieldShape);
        const fieldStartX=500;
        const fieldStartY=100;
        const fieldSize=50;
        for(let i=0;i<4;i++){
            let startX=fieldStartX+(fieldSize+10)*(i%2);
            let startY=fieldStartY+Math.floor(i/2)*(fieldSize+10);
            const random=Math.floor(Math.random()*fShapeArray.length);
            const field=new Field(this.ctx,startX,startY,fieldSize,5,fShapeArray[random]);
            this.nextFiled.push(field);
        }

        this.sellSelectIndex=0;
        this.sellSelecting=false;
    }
    Start(){

    }
    Update(){
        switch(this.state[this.currentState]){
            case "ChoosePiece":
                
                    if (this.keys['w'] || this.keys['W'] || this.keys['a'] || this.keys['A'] || 
                    this.keys['s'] || this.keys['S'] || this.keys['d'] || this.keys['D'] ) { // 回転もキーリピートをチェック
                        if (!this.isWASDPress) {
                            const prevIndex = this.selectGrid.col + this.selectGrid.row * 3;
                            if (this.slots[prevIndex]) {
                                this.slots[prevIndex].isSelecting = false;
                            }
                        
                            // グリッドを移動
                            if (this.keys['w'] || this.keys['W']) { this.selectGrid.row = Math.max(0, this.selectGrid.row - 1); } // 上
                            if (this.keys['s'] || this.keys['S']) { this.selectGrid.row = Math.min((this.maxSlotCount/3)-1, this.selectGrid.row + 1); } // 下
                            if (this.keys['a'] || this.keys['A']) { this.selectGrid.col = Math.max(0, this.selectGrid.col - 1); } // 左
                            if (this.keys['d'] || this.keys['D']) { this.selectGrid.col = Math.min(2, this.selectGrid.col + 1); } // 右
                        
                            // 新しく選択されたスロットをハイライト
                            const newIndex = this.selectGrid.col + this.selectGrid.row * 3;
                            if (this.slots[newIndex]) {
                                this.slots[newIndex].isSelecting = true;
                            }
                        
                            this.Draw();
                            this.isWASDPress=true;
                            this.isKeyMoving=true;
                        }
                    }else if((this.keys[' '] || this.keys['Enter'])){
                        if(!this.isSpacePress){
                            this.slots[this.selectGrid.col + this.selectGrid.row * 3].isSelecting=false;

                            this.slots[this.selectGrid.col + this.selectGrid.row * 3].selectFlag = true;
                            this.currentState=1;

                            this.Draw();
                            if(this.slots[this.currentIndex].selectFlag ){
                                this.price=this.slots[this.currentIndex].piece.price;
                                this.emptyIndex=this.MySlots.length;
                                for(let i=this.MySlots.length-1;i>=0;i--){
                                    if(this.MySlots[i].piece===null){
                                        this.emptyIndex=i;
                                    }
                                }
                                if(this.emptyIndex>=this.MySlots.length||
                                    this.money-this.price<0
                                ){
                                    this.btn_yes.deActive=true;
                                }
                                this.currentState=1;
                            }
                            this.isSpacePress=true;
                            this.isKeyMoving=true;
                        }
                    } else {
                        this.isWASDPress=false;
                        this.isSpacePress = false;
                        this.isKeyMoving=false;
                    }
                
                break;
            case "YesorNo":
                if(!this.isWASDPress){
                    if (this.keys['a'] || this.keys['A'] || 
                    this.keys['d'] || this.keys['D'] ) { 

                        // グリッドを移動
                        if (this.keys['a'] || this.keys['A']) { this.nowButton = Math.max(0, this.nowButton - 1); } // 左
                        if (this.keys['d'] || this.keys['D']) { this.nowButton = Math.min(1, this.nowButton + 1); } // 右
                    
                    
                        this.Draw();
                        this.isWASDPress=true;
                        this.isKeyMoving=true;
                    }
                }else if((this.keys[' '] || this.keys['Enter'])){
                    if(!this.isSpacePress){
                        if(this.nowButton===0){
                            if(this.buyFlag)this.btn_yes.ButtonOn(false);
                        }else{
                            this.btn_No.ButtonOn(false);
                        }
                        
                        this.isSpacePress=true;
                        this.isKeyMoving=false;
                    }
                } else {
                    if(this.isSpacePress){
                        if(this.isKeyMoving){
                            if(this.nowButton===0){
                                if(this.buyFlag)this.btn_yes.ButtonOff(true);
                            }else{
                                this.btn_No.ButtonOff(true);
                            }
                        }
                        this.isSpacePress = false;
                        this.isKeyMoving=false;
                        this.Draw();
                    }
                    

                    this.isWASDPress=false;
                }
                
                break;    
        }
    }
    Draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(20,10,660,500);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";

        this.ctx.fillStyle = "black";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("shop", this.canvas.width/2,45);
        this.ctx.font = "25px Arial";
        this.ctx.fillText(`所持金：${this.money}G`, 560,250);
        this.ctx.fillText(`ピース価格：${this.price}G`, 560,300);

        this.ctx.font = "20px Arial";
        this.ctx.fillText("次のフィールド", 560,80);

        this.ctx.stroke();
        switch(this.state[this.currentState]){
            case "ChoosePiece":
                
                this.btn_sell.Draw();
                if(this.sellSelecting){
                    this.btn_quit.Draw();
                    this.ctx.font = "30px Arial";
                    this.ctx.fillText(`売却額：${Math.floor(this.MySlots[this.sellSelectIndex].piece.price/2)}G`,
                     150,this.canvas.height-20);
                }else{
                    this.btn_end.Draw();
                    this.btn_reroll.Draw();
                }
                break;
            case "YesorNo":
                this.ctx.font = "25px Arial";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("購入しますか？", 180,360);
                if(this.money-this.price>=0){
                    this.ctx.fillText(`所持金：${this.money}G → ${this.money-this.price}G`, 180,400);
                }else{
                    this.ctx.fillText("購入できません", 180,400);
                }
                
                this.btn_yes.Draw();
                this.btn_No.Draw();
                break;
        }
        for(let i=0;i<this.slots.length;i++){
            this.slots[i].Draw();
        }
        for(let i=0;i<this.slots.length;i++){
            if(this.slots[i].piece!==null){
                this.slots[i].piece.draw();//スロットと分けて描写するのは描画順でスロットの下にピースが隠れてしまわないようにするため
            }
        }

        //所持ピース
        for(let i=0;i<this.MySlots.length;i++){
            //pieces[i].draw();
            this.MySlots[i].Draw();
        }
        for(let i=0;i<this.MySlots.length;i++){
            //pieces[i].draw();
            if(this.MySlots[i].piece!==null){
                this.MySlots[i].piece.draw();//スロットと分けて描写するのは描画順でスロットの下にピースが隠れてしまわないようにするため
            }
        }

        for(let i=0;i<this.nextFiled.length;i++){
            this.nextFiled[i].draw();
        }
    }
    Buy(){
        this.money-=this.price;
        this.price=0;
        let buyPiece=new Piece(
            this.ctx,
            this.slots[this.currentIndex].piece.color,
            this.slots[this.currentIndex].piece.pieceName,
            this.MySlots[this.emptyIndex].pieceStartPos.x,
            this.MySlots[this.emptyIndex].pieceStartPos.y,
            this.MySlots[this.emptyIndex].pieceCellSize
        );
        this.MySlots[this.emptyIndex].piece=buyPiece;
        this.tempFlag=this.MySlots[this.emptyIndex].pieceStartPos.x;
        this.slots[this.currentIndex].piece=null;
        
        this.slots[this.currentIndex].selectFlag = false;
        this.slots[this.selectGrid.col + this.selectGrid.row * 3].isSelecting=true;
        this.emptyIndex=this.MySlots.length;
        this.currentState=0;
        if(this.money<this.rerollPrice){
            this.btn_reroll.deActive=true;
        }

    }

    Cancel(){
        this.currentState=0;
        this.slots[this.currentIndex].selectFlag = false;
        this.slots[this.selectGrid.col + this.selectGrid.row * 3].isSelecting=true;
        if(this.btn_yes.deActive)this.btn_yes.deActive=false;
    }

    Reroll(){
        this.money-=this.rerollPrice;
        for(let i=0;i<this.maxSlotCount;i++){
            const slotX=this.slotStartX+(i%3)*(this.slotSize+5);
            const slotY=this.slotStartY+(Math.floor(i/3))*(this.slotSize+5);//+2は枠線の分だけ

            let random=Math.floor(Math.random()*PIECE_COLORS.length);
            // ピースの色はPIECE_COLORSから取得するように変更（任意）
            const color = PIECE_COLORS[random]; 
            
            const keyArray=Object .keys(PIECES);
            random=Math.floor(Math.random()*keyArray.length);
            const pieceName=keyArray[random];
            const centerPos=(this.slotSize-PIECES[pieceName].shapes.length*this.cellSize*this.pieceMag)/2;
            const x=slotX+centerPos;//要調整
            const y=slotY+centerPos;
            let tempPiece=new Piece(this.ctx,color,pieceName,x,y,this.cellSize*this.pieceMag);
            
            this.slots[i].piece=null;
            this.slots[i].piece=tempPiece;
        }
        this.slots[this.selectGrid.col + this.selectGrid.row * 3].isSelecting=true;
        if(this.money<this.rerollPrice){
            this.btn_reroll.deActive=true;
        }
        this.Draw();
    }

    Sell(){
        this.money+=Math.floor(this.MySlots[this.sellSelectIndex].piece.price/2);
        this.MySlots[this.sellSelectIndex].piece=null;
        this.MySlots[0].isSelecting=true;
        this.MySlots[this.sellSelectIndex].selectFlag=false;
        this.sellSelecting=false;
        if(!this.sellSelecting){
            this.btn_sell.deActive=true;
        }
        if(this.money>=this.rerollPrice){
            this.btn_reroll.deActive=false;
        }
        this.Draw();
    }

    QuitSell(){
        this.MySlots[0].isSelecting=true;
        this.MySlots[this.sellSelectIndex].selectFlag=false;
        this.sellSelecting=false;
        if(!this.sellSelecting){
            this.btn_sell.deActive=true;
        }
        this.Draw();
    }
    MouseDown(mouseX,mouseY){
        if(!this.isKeyMoving){
            switch(this.state[this.currentState]){
                case "ChoosePiece":
                    if(!this.sellSelecting){
                        for (let i = 0; i < this.MySlots.length; i++) {
                            // ... (ピース選択ロジック) ...
                            if (this.MySlots[i].piece && 
                                this.MySlots[i].startX <= mouseX && mouseX <= this.MySlots[i].startX + this.MySlots[i].size
                            && this.MySlots[i].startY <= mouseY && mouseY <= this.MySlots[i].startY + this.MySlots[i].size) {
                                this.sellSelectIndex=i;
                                // スロットのハイライト解除（キーボードで選択していた場合）
                                this.MySlots[i].isSelecting=false;

                                this.MySlots[i].selectFlag = true;
                                this.sellSelecting=true;
                                if(this.sellSelecting){
                                    this.btn_sell.deActive=false;
                                }
                                break; 
                            }
                        }
                    }
                    for (let i = 0; i < this.slots.length; i++) {
                    // ... (ピース選択ロジック) ...
                        if (this.slots[i].piece && 
                            this.slots[i].startX <= mouseX && mouseX <= this.slots[i].startX + this.slots[i].size
                        && this.slots[i].startY <= mouseY && mouseY <= this.slots[i].startY + this.slots[i].size) {
                            
                            // スロットのハイライト解除（キーボードで選択していた場合）
                            this.slots[this.selectGrid.col + this.selectGrid.row * 3].isSelecting=false;

                            this.currentIndex=i;
                            this.slots[i].selectFlag = true;
                            
                            break; 
                        }
                    }
                    if(this.slots[this.currentIndex].selectFlag ){
                        this.price=this.slots[this.currentIndex].piece.price;
                        this.emptyIndex=this.MySlots.length;
                        for(let i=this.MySlots.length-1;i>=0;i--){
                            if(this.MySlots[i].piece===null){
                                this.emptyIndex=i;
                            }
                        }
                        if(this.emptyIndex>=this.MySlots.length||
                            this.money-this.price<0
                        ){
                            this.btn_yes.deActive=true;
                        }
                        this.currentState=1;
                    }
                    if(this.btn_end.ButtonOver(mouseX,mouseY)){
                        this.btn_end.ButtonOn(false);
                    }
                    else if(this.btn_reroll.ButtonOver(mouseX,mouseY)){
                        this.btn_reroll.ButtonOn(false);
                    }
                    else if(this.btn_sell.ButtonOver(mouseX,mouseY)){
                        this.btn_sell.ButtonOn(false);
                    }
                    else if(this.btn_quit.ButtonOver(mouseX,mouseY)){
                        this.btn_quit.ButtonOn(false);
                    }
                    this.isMouseMoving=true;
                    break;
                case "YesorNo":
                    if(this.btn_yes.ButtonOver(mouseX,mouseY)){
                        this.btn_yes.ButtonOn(false);
                    }
                    else if(this.btn_No.ButtonOver(mouseX,mouseY)){
                        this.btn_No.ButtonOn(false);
                    }
                    this.Draw();
                    break;
            }
            
        }
        
    }
   
    MouseUp(){
        if(!this.isKeyMoving){
            switch(this.state[this.currentState]){
                case "ChoosePiece":
                    
                    if(this.btn_end.isOn){
                        this.btn_end.ButtonOff(true);
                    }
                    else if(this.btn_reroll.isOn){
                        this.btn_reroll.ButtonOff(true);
                    }
                    else if(this.btn_sell.isOn){
                        this.btn_sell.ButtonOff(true);
                    }
                    else if(this.btn_quit.isOn){
                        this.btn_quit.ButtonOff(true);
                    }
                    else{
                        this.Draw();
                    }
                    
                    break;
                case "YesorNo":
                    if(this.btn_yes.isOn){
                        this.btn_yes.ButtonOff(true);
                    }
                    else if(this.btn_No.isOn){
                        this.btn_No.ButtonOff(true);
                    }
                    
                    this.isMouseMoving=false;
                    this.Draw();
                    break;
            }
            
        }
    }
}