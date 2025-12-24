import {fadeIn, setNumber } from "./function.js";

// ===== ゲーム状態 =====
let score = 0;
let time = 30;
let timerId = null;
let answerDirection = "";
let isPlaying = false;
let isOn = false;
let canInput = true;


// ===== DOM取得 =====
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const bgmBtn = document.getElementById("bgm-btn");
const closeBtn = document.getElementById("close-btn")
const howToBtn = document.getElementById("howTo-btn");
const bgm = document.getElementById("bgm");

const modalA =document.getElementById("modal-A");
const modalB = document.getElementById("modal-B");
const finalScore = document.getElementById("finalScore");
const retryBtn = document.getElementById("retryBtn");
const seFinish =document.getElementById("se-finish");
const seOk =document.getElementById("se-ok");
const seNg =document.getElementById("se-ng");
const scoreRank = document.querySelector(".score-rank");
const rankEc = document.getElementById("rank-Ec");
const rankNi = document.getElementById("rank-Ni");
const rankBa = document.getElementById("rank-Ba");

const up = document.getElementById("Up");
const left = document.getElementById("Left");
const center = document.getElementById("Center");
const right = document.getElementById("Right");
const down = document.getElementById("Down");
const cross = document.querySelector(".Cross");
const positions = [up, left, right, down];

export function resetRank() {
  scoreRank.querySelectorAll("img").forEach(img => {
    img.classList.add("hidden");
  });
}

// ===== BGM切り替え処理 =====
bgmBtn.addEventListener("click", () => {
  if (!isOn) {
    fadeIn(bgm);                 // 既存フェードインを使う
    bgmBtn.textContent = "BGM OFF";
    isOn = true;
  } else {
    bgm.pause();                 // フェードアウトなしで停止
    bgmBtn.textContent = "BGM ON";
    isOn = false;
  }
});

// ===== How toオープン処理 =====
howToBtn.addEventListener("click",() =>{
  modalA.classList.remove("hidden");
})

// ===== How toクローズ処理 =====
closeBtn.addEventListener("click", () => {
    modalA.classList.add("hidden");
});

// ===== 初期化 =====
function resetGame(){
  score = 0;
  time = 30;
  isPlaying = false;
  scoreEl.textContent = score;
  timeEl.textContent = time;
  clearNumbers();
  resetRank();
  
}

// 数字消去
function clearNumbers(){
  center.textContent = "";
  positions.forEach(p => p.textContent = "");
}

// 問題生成
function nextQuestion(){
  answerDirection = setNumber(center, positions);
}

// タイマー
function startTimer(){
  timerId = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if(time <= 0){
      endGame();
    }
  }, 1000);
}

// ゲーム開始
function startGame(){
  resetGame();
  isPlaying = true;
  startBtn.style.display = "none";
  modalB.classList.add("hidden");

  cross.classList.remove("hidden");
  nextQuestion();
  startTimer();

  if (seFinish) {
  seFinish.volume = 0;
  seFinish.play().then(() => {
    seFinish.pause();
    seFinish.currentTime = 0;
    seFinish.volume = 0.02;
  }).catch(()=>{});
}
}

// ゲーム終了
function endGame(){
  clearInterval(timerId);
  isPlaying = false;
  finalScore.textContent = score;
  modalB.classList.remove("hidden");
  cross.classList.add("hidden");

  if (seFinish) {
    seFinish.pause();
    seFinish.currentTime = 0;
    seFinish.volume = 0.02;
    seFinish.play().catch(e => console.log(e));
  }

  startBtn.style.display = "inline-block";
    switch (true) {
    case score >= 20:
        // 20点以上
        rankEc.classList.remove("hidden");
        break;

    case score >= 10:
        // 10〜19点
        rankNi.classList.remove("hidden");
        break;

    default:
        // 0〜9点
        rankBa.classList.remove("hidden");
        }
}

function showMark(targetEl, isCorrect) {
  const mark = document.createElement("div");
  mark.classList.add("mark");
  mark.classList.add(isCorrect ? "ok" : "ng");
  mark.textContent = isCorrect ? "〇" : "×";

  targetEl.appendChild(mark);

  // 0.5秒後に消す
  setTimeout(() => {
    mark.remove();
  }, 500);
}

// キー入力
function handleKeyDown(e){
  e.preventDefault();
  if(!isPlaying || !canInput) return;

  let input = "";
  let targetEl = null;

  if(e.key === "ArrowUp"){
    input = "Up";
    targetEl = up;
  }
  if(e.key === "ArrowLeft"){
    input = "Left";
    targetEl = left;
  }
  if(e.key === "ArrowRight"){
    input = "Right";
    targetEl = right;
  }
  if(e.key === "ArrowDown"){
    input = "Down";
    targetEl = down;
  }

  if(input === "") return;

  if(input === answerDirection){
    if (seOk) {
      seOk.currentTime = 0;   // 連打対策
      seOk.volume = 0.02;     // 好みで調整
      seOk.playbackRate = 2;
      seOk.play().catch(e => console.log(e));
    }
    canInput = false;
    score++;
    scoreEl.textContent = score;

    showMark(center, true);
    showMark(targetEl, true);

    setTimeout(() => {
      nextQuestion();
      canInput = true;
    }, 300); // ← 表示時間
  } else { 
      if (seNg) {
      seNg.currentTime = 0;   // 連打対策
      seNg.volume = 0.04;     // 好みで調整
      seNg.playbackRate = 2;
      seNg.play().catch(e => console.log(e));
    }
    canInput = false;
    score = Math.max(0, score - 1);
    scoreEl.textContent = score;

    showMark(center, false);
    showMark(targetEl, false);

    setTimeout(() => {
      nextQuestion();
      canInput = true;
    }, 300);
  }

}


// ===== イベント登録 =====
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);
document.addEventListener("keydown", handleKeyDown);

// 初期状態
resetGame();
