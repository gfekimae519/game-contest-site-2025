// 【目、鼻、口それぞれ８種類の画像パスを用意】
const EYE_PATHS = [
    '../assets/eyes/eye1.png', '../assets/eyes/eye2.png', '../assets/eyes/eye3.png', '../assets/eyes/eye4.png',
    '../assets/eyes/eye5.png', '../assets/eyes/eye6.png', '../assets/eyes/eye7.png', '../assets/eyes/eye8.png'
];
const NOSE_PATHS = [
    '../assets/noses/nose1.png', '../assets/noses/nose2.png', '../assets/noses/nose3.png', '../assets/noses/nose4.png',
    '../assets/noses/nose5.png', '../assets/noses/nose6.png', '../assets/noses/nose7.png', '../assets/noses/nose8.png'
];
const MOUTH_PATHS = [
    '../assets/mouths/mouth1.png', '../assets/mouths/mouth2.png', '../assets/mouths/mouth3.png', '../assets/mouths/mouth4.png',
    '../assets/mouths/mouth5.png', '../assets/mouths/mouth6.png', '../assets/mouths/mouth7.png', '../assets/mouths/mouth8.png'
];

/**
 * アプリケーションの全体を制御するクラス
 */
class FukuwaraiApp {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.parts = []; // 挿入されたPartインスタンスを保持
        
        // コンテナのサイズは、アプリ初期化時の値を保持
        this.containerWidth = this.container.offsetWidth;
        this.containerHeight = this.container.offsetHeight;

        this.setupEventListeners();
    }

    // 【要件２：画像パスのランダム選択】
    getRandomImagePath(imagePaths) {
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        return imagePaths[randomIndex];
    }
    
    /**
     * 新しいパーツを生成し、DOMに追加、ランダムに配置する
     * @param {string} partType - 'eye', 'nose', 'mouth' のいずれか
     */
    addPart(partType) {
        // ⭐ ⭐ 目の場合は addEyePair() メソッドを呼び出すように変更 ⭐ ⭐
        if (partType === 'eye') {
            this.addEyePair();
            return; // ペア追加後はここで処理を終了
        }
        // ⭐ ⭐ ---------------------------------------------------- ⭐ ⭐

        let paths;
        let areaRatio; 
        let size = { w: 100 }; // 例としてデフォルトサイズを設定

        if (partType === 'nose') {
            paths = NOSE_PATHS;
            areaRatio = 0.7; // 鼻は中央寄りに
            size = { w: 100 }; 
        } else if (partType === 'mouth') {
            paths = MOUTH_PATHS;
            areaRatio = 0.7; // 口はやや広範囲
            size = { w: 100 };
        } else {
            // 'eye' 以外の無効な partType が来た場合は何もしない
            return;
        }

        const randomPath = this.getRandomImagePath(paths);
        
        // Part クラスのインスタンスを作成
        const newPart = new Part(
            randomPath, 
            this.containerWidth, 
            this.containerHeight,
            size.w,
            1 //height:autoにしたため、ダミー値を渡す
        );

        // DOMに追加し、ランダムな位置に配置
        newPart.appendTo(this.container);
        
        // Y軸のエリア制限の範囲を明確に定義する
        let minRatioY, maxRatioY;

        if (partType === 'nose') {
            // 鼻: 顔の中央付近 (例: 40%から65%の範囲)
            minRatioY = 0.40;
            maxRatioY = 0.65;
        } else if (partType === 'mouth') {
            // 口: 顔の下部 (例: 60%から85%の範囲)
            minRatioY = 0.60;
            maxRatioY = 0.85;
        } else {
            // 予期せぬエラー防止 (実際には'eye'でリターンされているので不要だが安全のため)
            return;
        }

        newPart.randomlyPlaceY(
            minRatioY, // 鼻なら 0.40、口なら 0.60
            maxRatioY, // 鼻なら 0.65、口なら 0.85
            areaRatio
        ); 

        // 配列に追加
        this.parts.push(newPart);
    }

    // fukuwarai.js (FukuwaraiApp クラス内)

addEyePair() {
    // 【パーツの画像とサイズ定義】
    const randomPath = this.getRandomImagePath(EYE_PATHS);
    const EYE_WIDTH = 120; // 目の固定幅 (W_e)
    const EYE_HEIGHT_DUMMY = 1; // 縦横比維持のため高さはダミー値
    
    // 【ランダム配置の制約定義】
    const MIN_EDGE_BUFFER = 10; // B_min: コンテナの縁から最低限必要な余白
    const MIN_GAP_FACTOR = 1.25; // 最小間隔を目の幅の 1.25倍とする
    const MIN_GAP = EYE_WIDTH * MIN_GAP_FACTOR; // 最小間隔 (150px 程度)
    const MAX_GAP_FACTOR = 0.8; // 最大間隔をコンテナ幅の 80% で計算

    // Y軸の配置エリアの比率
    const MIN_RATIO_Y = 0.05;
    const MAX_RATIO_Y = 0.70;
    
    // -------------------------------------------------------------------
    // 1. ランダムな目の間隔 (EYE_GAP) を決定
    // -------------------------------------------------------------------
    
    // 目と目の間に許容される理論上の最大間隔
    const theoreticalMaxGap = this.containerWidth - (2 * EYE_WIDTH) - (2 * MIN_EDGE_BUFFER);
    
    // 最小間隔と、理論上の最大間隔の差を計算
    const maxGapAllowed = Math.min(theoreticalMaxGap * MAX_GAP_FACTOR, theoreticalMaxGap);
    const gapRange = maxGapAllowed - MIN_GAP;
    
    // 最終的に採用するランダムな目の間隔 (EYE_GAP)
    const randomGap = Math.floor(Math.random() * gapRange) + MIN_GAP;

    // -------------------------------------------------------------------
    // 2. 左目を配置 (X軸のはみ出し防止制御付き)
    // -------------------------------------------------------------------
    
    const leftEye = new Eye(
        randomPath, this.containerWidth, this.containerHeight, EYE_WIDTH, EYE_HEIGHT_DUMMY, 'left'
    );
    
    // 左目のX軸の配置可能範囲を「右目が入る分」だけ左に制限する
    // 配置可能エリアの最大幅 = コンテナ幅 - (右目が入るスペース) - (右端の余白)
    const MAX_X_AVAILABLE = this.containerWidth - EYE_WIDTH - randomGap - MIN_EDGE_BUFFER;
    
    // X軸のランダム配置は、MAX_X_AVAILABLEを超えないように Part.randomlyPlaceY の内部ロジックで制御される必要があります。
    // 以前の Part.randomlyPlaceY は X軸の最大値を制御する引数を持たないため、ここでは X軸の配置制限比率を調整する（例: 50%エリア）:
    const AREA_RATIO_X = 0.5; // X軸は中央50%の範囲に制限

    // 左目をY軸制限エリアとX軸制限エリアに配置
    leftEye.randomlyPlaceY(MIN_RATIO_Y, MAX_RATIO_Y, AREA_RATIO_X);

    // ⭐ 念のため、左目の X 座標が MAX_X_AVAILABLE を超えないかチェック ⭐
    // もし Part.randomlyPlaceY のX軸ロジックが単純な中央配置の場合、このチェックが必要です。
    if (leftEye.x > MAX_X_AVAILABLE) {
        // 左目がはみ出す可能性がある場合、手動でX座標を制限する
        leftEye.x = Math.floor(Math.random() * (MAX_X_AVAILABLE - MIN_EDGE_BUFFER)) + MIN_EDGE_BUFFER;
        leftEye.updatePosition();
    }


    // -------------------------------------------------------------------
    // 3. 右目を配置 (左目からの相対配置)
    // -------------------------------------------------------------------

    const rightEye = new Eye(
        randomPath, this.containerWidth, this.containerHeight, EYE_WIDTH, EYE_HEIGHT_DUMMY, 'right'
    );

    const Y_DEVIATION = 15; // 左右の目の高さのランダムなズレ（±15px）

    rightEye.x = leftEye.x + randomGap; // X座標は左目 + ランダム間隔
    
    // Y座標は左目と同じ高さに、ランダムなズレを加える
    rightEye.y = leftEye.y + (Math.random() * (2 * Y_DEVIATION) - Y_DEVIATION); 
    
    // 5. DOMに追加し、位置を更新
    leftEye.appendTo(this.container);
    rightEye.appendTo(this.container);
    rightEye.updatePosition();

    // 配列に追加 (消去ボタン用に両方とも保持)
    this.parts.push(leftEye, rightEye);
}
    
    // 【要件４：顔パーツを全消去するボタン】
    clearAll() {
        // 1. DOMから要素を削除
        this.parts.forEach(part => {
            part.element.remove();
        });

        // 2. 内部配列をクリア
        this.parts = [];
        console.log("パーツを全て消去しました。");
    }

    // 【要件３：ボタンクリックでランダムに追加される】
    setupEventListeners() {
        document.getElementById('add-eye').addEventListener('click', () => {
            this.addPart('eye');
        });
        document.getElementById('add-nose').addEventListener('click', () => {
            this.addPart('nose');
        });
        document.getElementById('add-mouth').addEventListener('click', () => {
            this.addPart('mouth');
        });
        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAll();
        });
    }
}


// アプリケーションの開始
document.addEventListener('DOMContentLoaded', () => {
    // faceContainerのIDを指定してアプリを起動
    new FukuwaraiApp('fukuwarai-face'); 
});