"use strict";

const modeToggle = document.getElementById("mode-thumb");
const quizEl = document.querySelector(".quiz");
const quizOptions = document.querySelector(".quiz-options");
const chooseSubjectPage = document.querySelector(".choose-subject-page");
const questionsPage = document.querySelector(".questions-page");
const answersContainer = document.querySelector(".answer-container");
const questionsEl = document.querySelector(".questions");
const submitBtn = document.querySelector(".submit");
const completingBar = document.getElementById("completing-bar");
const errorMsg = document.querySelector(".error-msg");
const nextBtn = document.querySelector(".next");
const desktop = document.querySelector(".desktop");
const header = document.querySelector(".header-name");
const iconEl = document.querySelector(".icon");
const iconContainer = document.querySelector(".icon-container");
iconContainer.style.display = "none";

let selectedIndex;
let baseValue = 10;
let selectedAnswerEl = null;
let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let globalTitle;
let globalIcon;
let clickedquestion;

const colors = {
  html: "#fdf2ea",
  css: "#e5fcf0",
  js: "#ecf0fe",
  accessibility: "#f4e7fe",
};

// Toggle Dark-Light Mode
let darkMode = localStorage.getItem("darkMode");
const enableDarkMode = () => {
  quizEl.classList.add("darkmode");
  localStorage.setItem("darkMode", "enabled");
  modeToggle.checked = true;
};

const disableDarkMode = () => {
  quizEl.classList.remove("darkmode");
  localStorage.setItem("darkMode", null);
  modeToggle.checked = false;
};

if (darkMode === "enabled") {
  enableDarkMode();
} else {
  disableDarkMode();
}

modeToggle.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

const setBackgroundColor = (question) => {
  iconContainer.style.backgroundColor = colors[question];
};

quizOptions.addEventListener("click", (e) => {
  e.preventDefault();
  const clickedElement = e.target;
  const childrenArray = Array.from(clickedElement.parentNode.children);
  selectedIndex = childrenArray.indexOf(clickedElement);
  clickedquestion = clickedElement.id;

  fetchData();

  chooseSubjectPage.style.display = "none";
  questionsPage.style.display = "block";
  iconContainer.style.display = "flex";
});

const setTitleandIcon = () => {
  const formattedIcon = globalIcon.startsWith(".")
    ? globalIcon.slice(1)
    : globalIcon;
  iconEl.src = `${formattedIcon}`;
  setBackgroundColor(clickedquestion);

  header.innerText = globalTitle;
};

const escapeCharacters = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const createQuestions = (questions, currentQuestionIndex) => {
  questionsEl.innerHTML = "";

  const html = `
    <p class="question-navigation">Question ${currentQuestionIndex + 1} of ${
    questions.length
  }</p>
    <p class="question">${escapeCharacters(
      questions[currentQuestionIndex].question
    )}</p>
  `;

  questionsEl.insertAdjacentHTML("beforeend", html);
  createAnswers(questions[currentQuestionIndex].options);

  let completingBarValue = Math.min(baseValue + currentQuestionIndex * 10, 97);
  updateCompletingBar(`${completingBarValue}%`);
};

const createAnswers = (options) => {
  const html = `
    <ul class="answers">
      <li><span>A</span><p class="answer">${escapeCharacters(
        options[0]
      )}</p></li>
      <li><span>B</span><p class="answer">${escapeCharacters(
        options[1]
      )}</p></li>
      <li><span>C</span><p class="answer">${escapeCharacters(
        options[2]
      )}</p></li>
      <li><span>D</span><p class="answer">${escapeCharacters(
        options[3]
      )}</p></li>
    </ul>
  `;
  answersContainer.innerHTML = "";
  answersContainer.insertAdjacentHTML("beforeend", html);

  getAnswer();
};

const getAnswer = () => {
  const answersEl = document.querySelector(".answers");

  const handleClick = (e) => {
    const answer = e.target.closest("li");
    if (!answer) return;

    const activeElement = document.querySelector("li.active");
    if (activeElement) {
      activeElement.classList.remove("active");
    }
    answer.classList.add("active");

    if (errorMsg) errorMsg.style.display = "none";
    selectedAnswerEl = answer;
  };

  if (answersEl) {
    answersEl.addEventListener("click", handleClick);
  }
};

const checkAnswer = (selectedAnswerEl, correctAnswer) => {
  if (!selectedAnswerEl) {
    errorMsg.style.display = "flex";
    return;
  }

  const links = document.querySelectorAll(".answers li");
  links.forEach((link) => {
    const correctOption = link.querySelector("p");
    if (correctOption.textContent === correctAnswer) {
      link.classList.add("correct");
    }
  });

  const selectedAnswer = selectedAnswerEl.querySelector("p").textContent;

  if (selectedAnswer === correctAnswer) {
    selectedAnswerEl.classList.add("correct-answer");
    getScore(correctAnswer, selectedAnswer);
  } else {
    selectedAnswerEl.classList.add("wrong");
  }
};

const getScore = (correctAnswer, selectedAnswer) => {
  if (correctAnswer === selectedAnswer) score++;
};

const updateCompletingBar = (width) => {
  completingBar.style.setProperty("--before-width", width);
};

submitBtn.addEventListener("click", () => {
  const correctAnswer = questions[currentQuestionIndex].answer;
  checkAnswer(selectedAnswerEl, correctAnswer);

  if (selectedAnswerEl) {
    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
  }
});

const nextQuestion = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    createQuestions(questions, currentQuestionIndex);
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
    selectedAnswerEl = null;
  } else {
    showResult(score);
  }
};

if (nextBtn) {
  nextBtn.addEventListener("click", nextQuestion);
}

const showResult = (score) => {
  if (questionsPage) questionsPage.innerHTML = "";
  const formattedIcon = globalIcon.startsWith(".")
    ? globalIcon.slice(1)
    : globalIcon;
  const html = `
  <div class="score-container">
    <div class="text-wrapper">
      <p class="quiz-text">
        Quiz completed <br />
        <p class="boldtext">You scored...</p>
      </p>
    </div>

    <div class="score-wrapper">
      <div class="score-box">
        <div class="category">
          <div class="score-icon-container">
            <img src="${formattedIcon}" class="icon" />
          </div>
          <div class="category-text">${globalTitle}</div>
        </div>

        <p class="score">${score}</p>
        <p class="score-text">out of ${questions.length}</p>
      </div>
      <button class="again-btn">Play Again</button>
    </div>
  </div>
  `;

  questionsPage.innerHTML = html;

  setBackgroundColor(clickedquestion);

  const scoreIconContainer = document.querySelector(".score-icon-container");

  scoreIconContainer.style.backgroundColor = colors[clickedquestion];

  const againBtn = document.querySelector(".again-btn");
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      location.reload();
    });
  }
};

// API
const apiUrl = "../data.json";

const fetchData = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (selectedIndex === null || selectedIndex === undefined) return;

    const quizData = data.quizzes[selectedIndex];

    questions = quizData.questions;

    globalTitle = quizData.title;
    globalIcon = quizData.icon;

    setTitleandIcon();

    currentQuestionIndex = 0;
    createQuestions(questions, currentQuestionIndex);
  } catch (error) {
    console.error("Error:", error);
  }
};
