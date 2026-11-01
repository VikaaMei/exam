const cover = document.getElementById("cover");
const content = document.getElementById("content");
const flipBtn = document.getElementById("flipBtn");
const retryBtn = document.getElementById("retryBtn");
const questionsBox = document.getElementById("questions");
const submitBtn = document.getElementById("submitBtn");
const stamp = document.getElementById("stamp");

// MUSIC
const music = new Audio("assets/hannah.mp4");
music.loop = true;
music.volume = 0.4;

let musicStarted = false;

function startMusic() {
  music.play().then(() => {
    musicStarted = true;
    musicBtn.textContent = "♫ MUSIC ON";
  }).catch(() => {
    musicBtn.textContent = "♫ PLAY MUSIC";
  });
}

const musicBtn = document.createElement("button");
musicBtn.className = "music-btn";
musicBtn.textContent = "♫ PLAY MUSIC";
musicBtn.style.cssText = `
  position: fixed;
  bottom: 18px;
  right: 15px;
  z-index: 20;
  padding: 10px 14px;
  border: 1px solid #a98b6d;
  background: #f5eddf;
  color: #765b45;
  font-family: inherit;
  letter-spacing: 1px;
  font-size: 11px;
  display: none;
`;
document.body.appendChild(musicBtn);

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    musicBtn.textContent = "♫ PLAY MUSIC";
  }
});

// FLIP COVER
flipBtn.addEventListener("click", () => {
  cover.classList.add("open");

  setTimeout(() => {
    cover.classList.add("hidden");
    content.classList.remove("hidden");
    musicBtn.style.display = "block";
    revealSections();
    startMusic();
  }, 750);
});

// QUESTIONS
const questions = [
  {
    text: "What is my favorite thing about you?",
    options: [
      "Your existence",
      "Your expensive things",
      "Your phone"
    ],
    answer: 0
  },
  {
    text: "What should you do when I miss you?",
    options: [
      "Ignore me",
      "Give me attention",
      "Disappear"
    ],
    answer: 1
  },
  {
    text: "What makes our relationship special?",
    options: [
      "The little things",
      "The arguments",
      "The competition"
    ],
    answer: 0
  },
  {
    text: "What is the best way to solve a problem?",
    options: [
      "Stay silent forever",
      "Blame each other",
      "Talk and understand"
    ],
    answer: 2
  },
  {
    text: "How long is this examination valid?",
    options: [
      "One day",
      "One week",
      "Forever"
    ],
    answer: 2
  }
];

function renderQuestions() {
  questionsBox.innerHTML = "";

  questions.forEach((q, index) => {
    const question = document.createElement("div");
    question.className = "question";

    let optionsHTML = "";

    q.options.forEach((option, optionIndex) => {
      optionsHTML += `
        <label class="option">
          <input
            type="radio"
            name="question${index}"
            value="${optionIndex}"
          >
          <span>${option}</span>
        </label>
      `;
    });

    question.innerHTML = `
      <h3>${index + 1}. ${q.text}</h3>
      ${optionsHTML}
    `;

    questionsBox.appendChild(question);
  });
}

renderQuestions();

// SUBMIT EXAM
submitBtn.addEventListener("click", () => {
  let score = 0;
  let answered = 0;

  questions.forEach((q, index) => {
    const selected = document.querySelector(
      `input[name="question${index}"]:checked`
    );

    if (selected) {
      answered++;

      if (Number(selected.value) === q.answer) {
        score++;
      }
    }
  });

  if (answered < questions.length) {
    submitBtn.textContent = "— dijawab dulu yaa";
    return;
  }

  if (score < questions.length) {
    submitBtn.textContent = "TRY AGAIN ♡";
    return;
  }

  submitBtn.textContent = "SUBMITTED ✓";
  submitBtn.disabled = true;
  stamp.classList.remove("hidden");
});

// POP-UP ON SCROLL
let observer;

function revealSections() {
  const sections = document.querySelectorAll(".pop");

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.12
  });

  sections.forEach(section => observer.observe(section));
}

// RETRY
retryBtn.addEventListener("click", () => {
  if (observer) observer.disconnect();

  content.classList.add("hidden");
  cover.classList.remove("hidden");
  cover.classList.remove("open");

  music.pause();
  music.currentTime = 0;
  musicBtn.style.display = "none";
  musicBtn.textContent = "♫ PLAY MUSIC";

  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = false;
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "SUBMIT ANSWERS";
  stamp.classList.add("hidden");

  document.querySelectorAll(".pop").forEach(section => {
    section.classList.remove("visible");
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});