// DOM
const title = document.getElementById('title');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const question = document.getElementById('question');
const startBtn = document.getElementById('startBtn');
const answerBtn = document.getElementById('answer-btn');
const againBtn = document.getElementById('againBtn');
const answer1 = document.getElementById('answer1');
const answer2 = document.getElementById('answer2');
const answer3 = document.getElementById('answer3');
const answer4 = document.getElementById('answer4');
const buttons = document.querySelectorAll('.answer');

// 変数
const gameURL = 'https://opentdb.com/api.php?amount=10&type=multiple';
const totalQuizNum = 10;
const answerChoiceNum = 4;

class Quiz {
  constructor() {
    this.answerChoice = [];
    this.realAnswer = '';
    this.quiz = [];
    this.qCount = 0;
    this.correct = 0;
  }

  async getQuizData() {
    startBtn.classList.add('hide');
    title.textContent = '取得中';
    question.textContent = '少々お待ちください';
    const result = await fetch(gameURL);
    const data = await result.json();
    this.quiz = data.results;
    this.getNextQuestion();
  }

  getNextQuestion() {
    if (this.qCount < totalQuizNum) {
      this.makeQuiz();
    } else {
      this.resultQuizGame();
    }
  }

  makeQuiz() {
    answerBtn.classList.remove('hide');
    category.classList.remove('hide');
    difficulty.classList.remove('hide');
    title.textContent = `問題${this.qCount + 1}`;
    category.textContent = `[ジャンル]${this.quiz[this.qCount].category}`;
    difficulty.textContent = `[難易度]${this.quiz[this.qCount].difficulty}`;
    question.textContent = this.quiz[this.qCount].question;
    const choice = this.shuffleAnswer();
    this.answerChoice = this.quiz[this.qCount].incorrect_answers;
    this.answerChoice.splice(choice, 0, this.quiz[this.qCount].correct_answer);
    this.realAnswer = `answer${choice + 1}`;
    answer1.textContent = this.answerChoice[0];
    answer2.textContent = this.answerChoice[1];
    answer3.textContent = this.answerChoice[2];
    answer4.textContent = this.answerChoice[3];
  }
  
  shuffleAnswer() {
    return Math.floor(Math.random() * answerChoiceNum);
  }

  judgeAnswer() {
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const newId = e.target.id;
        if (this.realAnswer === newId) {
          this.correct++;
        }
      });
      button.addEventListener('click', () => {
        this.qCount++;
        this.getNextQuestion();
      });
    });
  }

  resultQuizGame() {
    title.textContent = `あなたの正解数は${this.correct}です！`;
    question.textContent = '再度チャレンジしたい場合は以下をクリック！';
    category.classList.add('hide');
    difficulty.classList.add('hide');
    answerBtn.classList.add('hide');
    againBtn.classList.remove('hide');
  }

  gameAgain() {
    title.textContent = 'ようこそ';
    question.textContent = '以下のボタンをクリック';
    startBtn.classList.remove('hide');
    againBtn.classList.add('hide');
    quizInstance.qCount = 0;
    quizInstance.correct = 0;
  }
}

// 処理記述
const quizInstance = new Quiz();

startBtn.addEventListener('click', () => {
  quizInstance.getQuizData();
});

againBtn.addEventListener('click', () => {
  quizInstance.gameAgain();
});

quizInstance.judgeAnswer();
