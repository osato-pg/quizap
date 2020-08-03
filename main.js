// DOM
const title = document.getElementById("title");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const question = document.getElementById("question");
const startBtn = document.getElementById("startBtn");
const answerBtn = document.getElementById("answer-btn");
const answer1 = document.getElementById("answer1");
const answer2 = document.getElementById("answer2");
const answer3 = document.getElementById("answer3");
const answer4 = document.getElementById("answer4");
let realAnswer = "";

// 変数
let qCount = 0;
let correct = 0;
let quiz = [];
let answerChoice = [];

// クイズ開始
function quizStart() {
  startBtn.addEventListener("click", () => {
    sendApiRequest();
    waiting();
  });
}

function waiting() {
  startBtn.classList.add("hide");
  title.innerHTML = "取得中";
  question.innerHTML = "少々お待ちください";
}

async function sendApiRequest() {
  let result = await fetch(
    "https://opentdb.com/api.php?amount=10&type=multiple"
  );
  let data = await result.json();
  quiz = data;
  useApiData(data);
}

// クイズ１問目表示
function useApiData(data) {
  answerBtn.classList.remove("hide");
  title.innerHTML = `問題${qCount + 1}`;
  category.innerHTML = `[ジャンル]${data.results[qCount].category}`;
  difficulty.innerHTML = `[難易度]${data.results[qCount].difficulty}`;
  question.innerHTML = data.results[qCount].question;
  let choice = random();
  answerChoice = data.results[qCount].incorrect_answers;
  answerChoice.splice(choice, 0, data.results[qCount].correct_answer);
  realAnswer = `answer${choice + 1}`;
  answer1.innerHTML = answerChoice[0];
  answer2.innerHTML = answerChoice[1];
  answer3.innerHTML = answerChoice[2];
  answer4.innerHTML = answerChoice[3];
}

function random() {
  let correctNumber = Math.floor(Math.random() * 4);
  return correctNumber;
}

function makeAnswerKey() {
  const buttons = document.querySelectorAll(".answer");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const newId = e.target.id;
      if (realAnswer == newId) {
        correct++;
      }
    });
    button.addEventListener("click", display);
  });
}

function display() {
  let qMax = qMaxFunc(qCount);
  if (qMax) {
    qCount++;
    useApiData(quiz);
  } else {
    title.innerHTML = `あなたの正解数は${correct}です！`;
    question.innerHTML = "再度チャレンジしたい場合は以下をクリック！";
    category.classList.add("hide");
    difficulty.classList.add("hide");
    answerBtn.classList.add("hide");
    againBtn.classList.remove("hide");
  }
}

function qMaxFunc(qCount) {
  if (qCount < 9) {
    return true;
  } else {
    return false;
  }
}

// ホームへ戻る
function toHome() {
  const againBtn = document.getElementById("againBtn");
  againBtn.addEventListener("click", () => {
    title.innerHTML = "ようこそ";
    question.innerHTML = "以下のボタンをクリック";
    startBtn.classList.remove("hide");
    againBtn.classList.add("hide");
    qCount = 0;
    correct = 0;
  });
}

// イベント
quizStart();
toHome();
makeAnswerKey();
