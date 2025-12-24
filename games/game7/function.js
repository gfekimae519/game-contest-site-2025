export function getRandomNumber(){
  return Math.floor(Math.random() * 99) + 1;
}

export function setNumber(center, positions){
  const answerNumber = getRandomNumber();
  center.textContent = answerNumber;

  const answerPos = positions[Math.floor(Math.random() * positions.length)];
  answerPos.textContent = answerNumber;

  positions.forEach(pos => {
    if(pos === answerPos) return;
    let num;
    do{
      num = getRandomNumber();
    }while(num === answerNumber);
    pos.textContent = num;
  });

  return answerPos.id;
}

let fadeTimer = null;

export function fadeIn(bgm) {
  // 既存フェードがあれば止める
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }

  bgm.muted = false;
  bgm.volume = 0;
  bgm.play();

  let v = 0;
  fadeTimer = setInterval(() => {
    v += 0.002;
    bgm.volume = Math.min(v, 0.015);

    if (v >= 0.020) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }, 100);
}

