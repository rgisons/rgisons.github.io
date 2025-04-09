const quizData = [
    { question: "На каком расстоянии Луна находится от Земли?", type: "number", correct: "384400" },
    { question: "Как образовалась Луна?", type: "radio", options: ["В результате взрыва звезды", "Она всегда была рядом с Землей", "В результате столкновения Земли с крупным объектом"], correct: "В результате столкновения Земли с крупным объектом" },
    { question: "Что такое лунные моря? (в ответе нужно написать ДВА слова с МАЛЕНЬКОЙ буквы)", type: "text", correct: "застывшая лава" },
    { question: "Когда человек впервые ступил на Луну?", type: "text", placeholder: "дд.мм.гггг", correct: "20.07.1969" },
    { question: "Какие явления на Земле вызывает Луна?", type: "checkbox", options: ["Приливы", "Ураганы", "Землетрясения", "Отливы"], correct: ["Приливы", "Отливы"] },
    { question: "Соотнесите понятия с их описаниями", type: "match", matches: [
        { item: "Лунные моря", options: ["Результат ударов метеоритов", "Застывшие равнины лавы", "Горы на поверхности Луны"], correct: "Застывшие равнины лавы" },
        { item: "Лунные кратеры", options: ["Результат ударов метеоритов", "Застывшие равнины лавы", "Горы на поверхности Луны"], correct: "Результат ударов метеоритов" },
        { item: "Лунные горы", options: ["Результат ударов метеоритов", "Застывшие равнины лавы", "Горы на поверхности Луны"], correct: "Горы на поверхности Луны" }
    ]},
    { question: "Какой диаметр у Луны?", type: "number", correct: "3474" },
    { question: "Какая миссия первой доставила человека на Луну?", type: "radio", options: ["Apollo 11", "Apollo 13", "Sputnik 1"], correct: "Apollo 11" },
    { question: "Какую роль Луна играет для Земли?", type: "checkbox", options: ["Стабилизирует ось", "Защищает от астероидов", "Вызывает приливы", "Создает магнитное поле"], correct: ["Стабилизирует ось", "Вызывает приливы"] },
    { question: "Какой возраст Луны?", type: "radio", options: ["2 миллиарда лет", "4,5 миллиарда лет", "1 миллиард лет"], correct: "4,5 миллиарда лет" }
];

let currentQuestion = 0;
let score = 0;
let answers = [];

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const questionDiv = document.getElementById("question");
const scoreDisplay = document.getElementById("score");
const codeDisplay = document.getElementById("code");

const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");
const copyButton = document.getElementById("copyButton");

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
copyButton.addEventListener("click", copyCode);

function startQuiz() {
    intro.style.display = "none";
    quiz.style.display = "block";
    showQuestion();
}

function showQuestion() {
    const q = quizData[currentQuestion];
    questionDiv.innerHTML = `<div class="question">${q.question}</div>`;

    if (q.type === "number") {
        questionDiv.innerHTML += '<div style="text-align: left;"><input type="number" id="answer"></div>';
    } else if (q.type === "text") {
        questionDiv.innerHTML += `<div style="text-align: left;"><input type="text" id="answer" placeholder="${q.placeholder || ''}"></div>`;
    } else if (q.type === "radio") {
        let optionsHtml = '<div class="options">';
        q.options.forEach(option => {
            optionsHtml += `<label><input type="radio" name="answer" value="${option}">${option}</label>`;
        });
        questionDiv.innerHTML += optionsHtml + '</div>';
    } else if (q.type === "checkbox") {
        let optionsHtml = '<div class="options">';
        q.options.forEach(option => {
            optionsHtml += `<label><input type="checkbox" name="answer" value="${option}">${option}</label>`;
        });
        questionDiv.innerHTML += optionsHtml + '</div>';
    } else if (q.type === "match") {
        let matchesHtml = '<div class="options">';
        q.matches.forEach((match, index) => {
            matchesHtml += `
                <div class="match-item">
                    <p>${match.item}</p>
                    <select id="match-${index}">
                        <option value="">Выберите вариант</option>
                        ${match.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                </div>`;
        });
        questionDiv.innerHTML += matchesHtml + '</div>';
    }

    if (currentQuestion === quizData.length - 1) {
        nextButton.textContent = "Завершить";
    } else {
        nextButton.textContent = "Следующий вопрос";
    }
}

function nextQuestion() {
    const q = quizData[currentQuestion];
    let userAnswer;
    let isValid = true;

    if (q.type === "number" || q.type === "text") {
        userAnswer = document.getElementById("answer").value;
        if (!userAnswer) {
            alert("Пожалуйста, введите ответ");
            isValid = false;
        }
    } else if (q.type === "radio") {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            alert("Пожалуйста, выберите один вариант");
            isValid = false;
        } else {
            userAnswer = selected.value;
        }
    } else if (q.type === "checkbox") {
        const selected = document.querySelectorAll('input[name="answer"]:checked');
        if (selected.length === 0) {
            alert("Пожалуйста, выберите хотя бы один вариант");
            isValid = false;
        } else {
            userAnswer = Array.from(selected).map(input => input.value);
        }
    } else if (q.type === "match") {
        userAnswer = q.matches.map((match, index) => {
            const select = document.getElementById(`match-${index}`);
            return select ? select.value : '';
        });
        
        if (userAnswer.some(answer => !answer)) {
            alert("Пожалуйста, сопоставьте все элементы");
            isValid = false;
        }
    }

    if (!isValid) return;

    answers[currentQuestion] = userAnswer;
    checkAnswer(userAnswer, q);
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function checkAnswer(userAnswer, question) {
    if (question.type === "checkbox") {
        if (JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correct.sort())) {
            score++;
        }
    } else if (question.type === "match") {
        if (userAnswer.every((ans, i) => ans === question.matches[i].correct)) {
            score++;
        }
    } else {
        if (JSON.stringify(userAnswer) === JSON.stringify(question.correct)) {
            score++;
        }
    }
}

function showResult() {
    quiz.style.display = "none";
    result.style.display = "block";
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    scoreDisplay.textContent = `Ваш результат: ${score} из ${quizData.length}`;
    codeDisplay.textContent = `Ваш код: ${randomCode}${score}`;
}

function copyCode() {
    const codeText = codeDisplay.textContent.split(': ')[1];
    navigator.clipboard.writeText(codeText)
        .then(() => {
            alert('Код скопирован!');
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
            alert('Не удалось скопировать код');
        });
}
