// DOM
const title = document.getElementById('title');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const question = document.getElementById('question');
const startBtn = document.getElementById('startBtn');
const answerBtn = document.getElementById('answer-btn');
const answer1 = document.getElementById('answer1');
const answer2 = document.getElementById('answer2');
const answer3 = document.getElementById('answer3');
const answer4 = document.getElementById('answer4');

// クイズの基本情報
const quizInfo = {
  qCount: 0,
  correct: 0,
  quizzes: [],
  answerChoice: [],
  realAnswer: '',
  quizAgain: 0,
};

class Quiz {
  constructor(quiz) {
    this.quiz = quiz;
  }

  makeQuiz(qCount) {
    answerBtn.classList.remove('hide');
    title.innerHTML = `問題${quizInfo.qCount + 1}`;
    category.innerHTML = `[ジャンル]${this.quiz[qCount].category}`;
    difficulty.innerHTML = `[難易度]${this.quiz[qCount].difficulty}`;
    question.innerHTML = this.quiz[qCount].question;
    const choice = random();
    quizInfo.answerChoice = this.quiz[qCount].incorrect_answers;
    quizInfo.answerChoice.splice(choice, 0, this.quiz[qCount].correct_answer);
    quizInfo.realAnswer = `answer${choice + 1}`;
    answer1.innerHTML = quizInfo.answerChoice[0];
    answer2.innerHTML = quizInfo.answerChoice[1];
    answer3.innerHTML = quizInfo.answerChoice[2];
    answer4.innerHTML = quizInfo.answerChoice[3];
  }
}

const sendApiRequest = async () => {
  const result = await fetch(
    'https://opentdb.com/api.php?amount=10&type=multiple'
  );
  const data = await result.json();
  startBtn.classList.add('hide');
  title.innerHTML = '取得中';
  question.innerHTML = '少々お待ちください';
  quizInfo.quizzes = data.results;
  // クイズインスタンスの作成
  let quizInstance = `quizInstance${quizInfo.quizAgain}`
  quizInstance = new Quiz(quizInfo.quizzes);
  console.log(quizInstance);
  nextQuiz(quizInstance);
  makeAnswerKey(quizInstance);
};

// スタートボタンをクリックしてクイズ開始
startBtn.addEventListener('click', () => {
  sendApiRequest();
});

// 次の問題の表示 or 結果を表示する。
const nextQuiz = (quizInstance) => {
  if (quizInfo.qCount < quizInfo.quizzes.length) {
    quizInstance.makeQuiz(quizInfo.qCount);
  } else {
    quizResult();
  }
};

// 正解のボタンが押されると、correctが＋１される。そして次の問題へ
function makeAnswerKey(quizInstance) {
  const buttons = document.querySelectorAll('.answer');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const newId = e.target.id;
      if (quizInfo.realAnswer == newId) {
        quizInfo.correct++;
        console.log(quizInfo.correct);
      }
    });
    button.addEventListener('click', () => {
      quizInfo.qCount++;
      nextQuiz(quizInstance);
    });
  });
}

// クイズの結果を表示
function quizResult() {
  title.innerHTML = `あなたの正解数は${quizInfo.correct}です！`;
  question.innerHTML = '再度チャレンジしたい場合は以下をクリック！';
  category.classList.add('hide');
  difficulty.classList.add('hide');
  answerBtn.classList.add('hide');
  againBtn.classList.remove('hide');
}

// ホーム画面へ戻る
function toHome() {
  const againBtn = document.getElementById('againBtn');
  againBtn.addEventListener('click', () => {
    title.innerHTML = 'ようこそ';
    question.innerHTML = '以下のボタンをクリック';
    startBtn.classList.remove('hide');
    againBtn.classList.add('hide');
    quizInfo.qCount = 0;
    quizInfo.correct = 0;
    quizInfo.quizAgain++;
  });
}
toHome();

/*
   quizオブジェクトの正解・不正解の解答をシャッフルする。
  */
function random() {
  let correctNumber = Math.floor(Math.random() * 4);
  return correctNumber;
}
