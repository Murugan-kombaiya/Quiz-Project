const startBtn = document.getElementById("start-btn");
const languageSelect = document.getElementById("language-select");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const timerDisplay = document.getElementById("timer");
const scoreText = document.getElementById("score-text");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const langIcon = document.getElementById("lang-icon");

const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");

let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedLanguage = "Python";

startBtn.addEventListener("click", async () => {
  selectedLanguage = languageSelect.value;
  await loadQuestions(selectedLanguage);
  document.querySelector("header").classList.add("hidden");
  quizSection.classList.remove("hidden");
  showQuestion();
});

async function loadQuestions(language) {
  let url = "";
  if (language === "Python") url = "python.json";
  else if (language === "Java") url = "java1.json";
  else if (language === "C++") url = "cpp.json";

  const res = await fetch(url);
  const data = await res.json();
  questions = data.slice(0, 15);
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(updateTimer, 1000);

  // Set language icon based on selectedLanguage
  langIcon.classList.remove("hidden");
  if (selectedLanguage === "Python") langIcon.src = "images/img1.png";
  else if (selectedLanguage === "Java") langIcon.src = "images/img2.png";
  else if (selectedLanguage === "C++") langIcon.src = "images/img3.svg";

  const currentQ = questions[currentIndex];
  questionText.textContent = currentQ.question;
  optionsList.innerHTML = "";
  nextBtn.disabled = true;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  currentQ.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.classList.add("option");
    li.addEventListener("click", () => handleAnswer(li, currentQ.answer));
    optionsList.appendChild(li);
  });
}

function handleAnswer(selectedLi, correctAnswer) {
  const allOptions = document.querySelectorAll("#options-list li");
  allOptions.forEach(li => li.classList.remove("selected"));
  selectedLi.classList.add("selected");

  if (selectedLi.textContent === correctAnswer) {
    selectedLi.classList.add("correct");
    score++;
    correctSound.play();
  } else {
    selectedLi.classList.add("incorrect");
    wrongSound.play();
    allOptions.forEach(li => {
      if (li.textContent === correctAnswer) li.classList.add("correct");
    });
  }

  scoreText.classList.add("score-pop");
  setTimeout(() => scoreText.classList.remove("score-pop"), 400);
  clearInterval(timer);
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    autoSubmitAnswer();
  }
}

function autoSubmitAnswer() {
  const correctAnswer = questions[currentIndex].answer;
  const allOptions = document.querySelectorAll("#options-list li");
  allOptions.forEach(li => {
    if (li.textContent === correctAnswer) li.classList.add("correct");
    else li.classList.add("incorrect");
  });
  nextBtn.disabled = false;
}

function showResult() {
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  scoreText.textContent = `You scored ${score} out of ${questions.length}`;

  // Set feedback text
  const feedback = document.getElementById("feedback-text");
  if (score >= 13) {
    feedback.textContent = "💪 Excellent! You're a coding master!";
  } else if (score >= 9) {
    feedback.textContent = "👏 Great job! You know your stuff.";
  } else if (score >= 5) {
    feedback.textContent = "🙂 Good effort! Keep practicing.";
  } else {
    feedback.textContent = "📘 Keep learning and try again!";
  }
}

