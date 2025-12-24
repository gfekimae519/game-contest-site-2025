class ResultScene{
    constructor(ctx,canvas,keys,money,award,usePiece,stage,gameClaerFlag,filed,func){
        this.ctx=ctx;
        this.canvas=canvas;
        this.keys=keys;

        //所持金
        this.money=money;
        //報酬
        this.award=award;
        this.usePiece=usePiece;
        this.stage=stage;
        this.filed=filed;
        
        this.gameClaerFlag=gameClaerFlag;

        this.func=func;

        let string;
        if(this.gameClaerFlag){
            string="ショップへ";
        }else{
            string="最初から";
        }
        this.btn_next=new Button(this.ctx,500,1000,
            150,50,this.func,string
        );
        

        this.isKeyMoving = false;
        this.isMouseMoving=false;
        this.isSpacePress = false; 
        this.isWASDPress = false; 
    }
   
    Update(){
        
    }
    Draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.filed.draw();

        this.ctx.beginPath();
        ctx.textAlign = "center";
            ctx.textBaseline = "middle";
        this.ctx.fillStyle = "black";
        this.ctx.font = "40px Arial";

        const halfWidth=this.canvas.width/2;
        if(this.gameClaerFlag){
            
            this.ctx.fillText(`ステージ${this.stage}クリア`,halfWidth,550);
            this.ctx.fillText(`ステージ報酬：${this.award}G`,halfWidth,650);
            let pieceBounus=0;
            if(this.usePiece<=5){
                pieceBounus=6-this.usePiece;
            }
            this.ctx.fillText("5手以内クリアボーナス",halfWidth,700);
            this.ctx.fillText(`${this.usePiece}手クリア：${pieceBounus}G`,halfWidth,750);
            const sumBounus=this.award+pieceBounus;
            this.ctx.fillText(`所持金：${this.money}G → ${this.money+sumBounus}G`,halfWidth,800);
        }else{
            this.ctx.fillText("ゲームオーバー",halfWidth,600);
            this.ctx.fillText(`達成ステージ数：${this.stage}`,halfWidth,650);
            this.ctx.fillText(`所持金：${this.money}G`,halfWidth,700);
        }

        this.ctx.stroke();
        this.btn_next.Draw();
    }
  
    MouseDown(mouseX,mouseY){
        if(!this.isKeyMoving){
            if(this.btn_next.ButtonOver(mouseX,mouseY)){
                this.btn_next.ButtonOn(false);
                this.Draw();
            }
        }
    }
   
    MouseUp(){
        if(!this.isKeyMoving){
            if(this.btn_next.isOn){
                this.btn_next.ButtonOff(true);
            }else{
                this.Draw();
            }
            
        }
    }
}