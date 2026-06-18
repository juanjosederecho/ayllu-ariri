const questions = [
  {
    text: '¿Qué significa "Ayllu Ariri" en el proyecto de emprendimiento?',
    options: [
      "Vendedor de productos escolares",
      "Guardián de la comunidad",
      "Juego para estudiantes",
      "Nombre de una tienda",
      "Grupo de música escolar"
    ],
    answer: 1
  },
  {
    text: '¿Cuál es el problema principal que busca solucionar el emprendimiento "Ayllu Ariri"?',
    options: [
      "La falta de juegos en el colegio",
      "La inseguridad o incidencias dentro del colegio y la comunidad",
      "La falta de tareas escolares",
      "La venta de alimentos saludables",
      "La limpieza de las aulas"
    ],
    answer: 1
  },
  {
    text: 'En Design Thinking, la etapa de "empatizar" sirve para:',
    options: [
      "Vender el producto rápidamente",
      "Copiar ideas de otros colegios",
      "Comprender las necesidades y problemas de las personas",
      "Elegir el color del logo",
      "Hacer publicidad en redes sociales"
    ],
    answer: 2
  },
  {
    text: "Para empatizar con la comunidad de Rosaspata, los estudiantes podrían:",
    options: [
      "Preguntar a estudiantes, docentes y vecinos qué problemas de seguridad observan",
      "Inventar problemas sin preguntar a nadie",
      "Comprar materiales sin planificar",
      "Hacer solo dibujos del proyecto",
      "Pensar únicamente en ganar dinero"
    ],
    answer: 0
  },
  {
    text: '¿Cuál sería una buena propuesta de valor para "Ayllu Ariri"?',
    options: [
      "Una aplicación o botón que ayude a reportar incidencias en tiempo real",
      "Una página para vender ropa",
      "Un concurso de canto escolar",
      "Una tienda de golosinas",
      "Un juego sin relación con la seguridad"
    ],
    answer: 0
  },
  {
    text: 'En Design Thinking, la etapa de "definir" consiste en:',
    options: [
      "Identificar claramente el problema que se quiere resolver",
      "Comprar todos los materiales",
      "Presentar el proyecto sin investigarlo",
      "Pintar carteles decorativos",
      "Elegir al azar una idea"
    ],
    answer: 0
  },
  {
    text: "Si los estudiantes crean muchas ideas para mejorar la seguridad, están trabajando la etapa de:",
    options: ["Evaluar", "Idear", "Vender", "Archivar", "Copiar"],
    answer: 1
  },
  {
    text: '¿Qué sería un prototipo del proyecto "Ayllu Ariri"?',
    options: [
      "Una maqueta, dibujo, formulario o botón de alerta de prueba",
      "Un cuaderno sin información",
      "Una lista de asistencia",
      "Una tarea de matemática",
      "Un afiche sin explicación"
    ],
    answer: 0
  },
  {
    text: "¿Por qué es importante probar el botón de alerta antes de usarlo oficialmente?",
    options: [
      "Para saber si funciona bien y si realmente ayuda a reportar incidencias",
      "Para perder tiempo en clase",
      "Para evitar escuchar opiniones",
      "Para cambiar el nombre del colegio",
      "Para no mejorar el proyecto"
    ],
    answer: 0
  },
  {
    text: '¿Qué actitud emprendedora deben mostrar los estudiantes al desarrollar "Ayllu Ariri"?',
    options: [
      "Trabajar en equipo, observar problemas reales y buscar soluciones útiles",
      "Esperar que otros hagan todo",
      "Burlarse de las ideas de sus compañeros",
      "Copiar proyectos sin mejorarlos",
      "Abandonar el proyecto cuando hay dificultades"
    ],
    answer: 0
  }
];

const state = {
  current: 0,
  name: "",
  answers: Array(questions.length).fill(null)
};

const $ = (selector) => document.querySelector(selector);
const letters = ["A", "B", "C", "D", "E"];

const screens = {
  start: $("#startScreen"),
  quiz: $("#quizScreen"),
  result: $("#resultScreen")
};

function setScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
}

function updateProgress() {
  $("#progressText").textContent = `${Math.min(state.current + 1, questions.length)}/${questions.length}`;
}

function renderQuestion() {
  const question = questions[state.current];
  $("#studentBadge").textContent = state.name;
  $("#questionNumber").textContent = `Pregunta ${state.current + 1} de ${questions.length}`;
  $("#questionText").textContent = question.text;
  $("#answers").innerHTML = "";

  question.options.forEach((option, index) => {
    const answer = document.createElement("button");
    answer.type = "button";
    answer.className = `answer${state.answers[state.current] === index ? " selected" : ""}`;
    answer.innerHTML = `<span class="letter">${letters[index]}</span><span>${option}</span>`;
    answer.addEventListener("click", () => {
      state.answers[state.current] = index;
      renderQuestion();
    });
    $("#answers").appendChild(answer);
  });

  $("#backBtn").disabled = state.current === 0;
  $("#nextBtn").textContent = state.current === questions.length - 1 ? "Ver resultado" : "Siguiente";
  $("#nextBtn").disabled = state.answers[state.current] === null;
  updateProgress();
}

function getScore() {
  return state.answers.reduce((score, answer, index) => {
    return score + (answer === questions[index].answer ? 1 : 0);
  }, 0);
}

function getAppUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  return url.toString();
}

function renderResults() {
  const score = getScore();
  const percentage = Math.round((score / questions.length) * 100);
  const appUrl = getAppUrl();

  $("#resultTitle").textContent = `${score} de ${questions.length} respuestas correctas`;
  $("#resultCopy").textContent =
    percentage >= 70
      ? "Buen trabajo. El proyecto demuestra una mirada atenta a la seguridad escolar y comunitaria."
      : "Sigue practicando. Revisa las respuestas y vuelve a intentarlo con calma.";
  $("#scoreValue").textContent = `${percentage}%`;
  $("#resultName").textContent = state.name;
  $("#appUrl").textContent = appUrl;
  $("#qrImage").src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(appUrl)}`;

  $("#reviewList").innerHTML = "";
  questions.forEach((question, index) => {
    const isCorrect = state.answers[index] === question.answer;
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `
      <span class="${isCorrect ? "status-ok" : "status-bad"}">${isCorrect ? "OK" : "X"}</span>
      <span>${index + 1}. ${letters[question.answer]}) ${question.options[question.answer]}</span>
    `;
    $("#reviewList").appendChild(item);
  });

  updateProgress();
}

$("#startForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#studentName").value.trim();
  if (!name) return;
  state.name = name;
  state.current = 0;
  state.answers = Array(questions.length).fill(null);
  setScreen("quiz");
  renderQuestion();
});

$("#backBtn").addEventListener("click", () => {
  if (state.current > 0) {
    state.current -= 1;
    renderQuestion();
  }
});

$("#nextBtn").addEventListener("click", () => {
  if (state.current < questions.length - 1) {
    state.current += 1;
    renderQuestion();
    return;
  }
  setScreen("result");
  renderResults();
});

$("#restartBtn").addEventListener("click", () => {
  state.current = 0;
  state.answers = Array(questions.length).fill(null);
  setScreen("start");
  updateProgress();
});

$("#shareBtn").addEventListener("click", async () => {
  const text = `Evaluación Ayllu Ariri - ${state.name}: ${getScore()} de ${questions.length}`;
  const url = getAppUrl();
  if (navigator.share) {
    await navigator.share({ title: "Ayllu Ariri", text, url });
    return;
  }
  await navigator.clipboard.writeText(`${text}\n${url}`);
  $("#shareBtn").textContent = "Enlace copiado";
  setTimeout(() => {
    $("#shareBtn").textContent = "Compartir";
  }, 1600);
});

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}

updateProgress();
