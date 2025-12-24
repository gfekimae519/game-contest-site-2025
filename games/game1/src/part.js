/**
 * 顔のパーツの基底クラス (OOP: カプセル化、抽象化)
 */
class Part {
    constructor(imagePath, containerWidth, containerHeight, partWidth, partHeight) {
        this.imagePath = imagePath;
        this.x = 0;
        this.y = 0;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;

        this.width = partWidth; 
        this.height = partHeight;
        
        this.element = this.createElement();
    }

    // 画像のDOM要素を作成
    createElement() {
        const img = document.createElement('img');
        img.src = this.imagePath;
        img.style.position = 'absolute';
        img.style.userSelect = 'none';
        
        img.style.width = `${this.width}px`;
        img.style.height = `auto`; 
        return img;
    }

    // DOM要素の位置を更新
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    appendTo(parentElement) {
        parentElement.appendChild(this.element);
    }

    randomlyPlaceY(minRatioY, maxRatioY, areaRatioX = 0.8) {
        const partWidth = this.width;

        // X軸のランダム計算
        const bufferX = (this.containerWidth - partWidth) * (1 - areaRatioX) / 2;
        const availableRangeX = this.containerWidth - partWidth - 2 * bufferX;
        this.x = Math.floor(Math.random() * availableRangeX) + bufferX;

        // Y軸のランダム計算：指定された範囲 (minRatioY 〜 maxRatioY) 内に収まるようにする
        const minY = this.containerHeight * minRatioY;
        const maxY = this.containerHeight * maxRatioY; 
        
        // 範囲内でのランダムなY座標を決定
        const rangeY = maxY - minY;
        this.y = Math.floor(Math.random() * rangeY) + minY;
        this.updatePosition();
    }
}