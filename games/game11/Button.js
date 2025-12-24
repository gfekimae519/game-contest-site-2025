class Button{
    constructor(ctx,startX,startY,width,height,onClick,label){
        this.ctx=ctx;
        this.startX=startX;
        this.startY=startY;
        this.width=width;
        this.height=height;
        this.label=label;
        this.centerPosX=this.startX+this.width/2;
        this.centerPosY=this.startY+this.height/2;
        this.selecting=false;
        this.Mag=0.6;//ボタンを押したときの大きさの変更
        this.isOn=false;
        this.onClick = onClick;
        this.deActive=false;
        this.startfontSize=20;
    }
    Draw(){
        this.ctx.save();
        let currentSizeX=this.width;
        let currentSizeY=this.height;
        let strokeColor="black";
        let color="cyan";

        if(this.deActive){
            color="gray";
        }else{
            if(this.isOn){
                currentSizeX=this.width*this.Mag;
                currentSizeY=this.height*this.Mag;
                color="red";
            }

            if(this.selecting){
                strokeColor="red";
            }
        }
        

        const PosX=this.centerPosX-(currentSizeX/2);
        const PosY=this.centerPosY-(currentSizeY/2);

        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 5;
        this.ctx.fillStyle=color;
        this.ctx.fillRect(PosX,PosY,currentSizeX,currentSizeY);
        this.ctx.strokeRect(PosX,PosY,currentSizeX,currentSizeY);

        //ボタンの文字設定
        this.ctx.fillStyle = "black";
        const fontSize = this.startfontSize * (currentSizeX / this.width);
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.label, this.centerPosX,this.centerPosY);

        //設定を戻す
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle="black";
        
       this. ctx.restore();
    }
    ButtonOver(X,Y){
        return (
            X >= this.startX && X <= this.startX + this.width &&
            Y >= this.startY && Y <= this.startY + this.height
        );
    }
    ButtonOn(useFuncFlag){
        if(this.deActive){
            return;
        }
        this.isOn=true;
        if(useFuncFlag)this.onClick();
    }
    ButtonOff(useFuncFlag){
        if(this.deActive){
            return;
        }
        this.isOn=false;
        if(useFuncFlag)this.onClick();
    }
}