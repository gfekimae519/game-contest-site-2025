/**
 * 目のパーツを表すクラス。Partを継承。
 * (OOP: 継承)
 */
class Eye extends Part {
    // side ('left' or 'right') を追加で受け取る
    constructor(imagePath, containerWidth, containerHeight, partWidth, partHeight, side) {
        super(imagePath, containerWidth, containerHeight, partWidth, partHeight);
        this.side = side; // 左目か右目かを保持
    }
}