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
        questionDiv.innerHTML += '<div style="text-align: left;"><input type="number" id="answer" required></div>';
    } else if (q.type === "text") {
        questionDiv.innerHTML += `<div style="text-align: left;"><input type="text" id="answer" placeholder="${q.placeholder || ''}" required></div>`;
    } else if (q.type === "radio") {
        let optionsHtml = '<div class="options" id="radio-options">';
        q.options.forEach((option, index) => {
            optionsHtml += `<label><input type="radio" name="answer" value="${option}" id="radio-${index}">${option}</label>`;
        });
        questionDiv.innerHTML += optionsHtml + '</div>';
    } else if (q.type === "checkbox") {
        let optionsHtml = '<div class="options" id="checkbox-options">';
        q.options.forEach((option, index) => {
            optionsHtml += `<label><input type="checkbox" name="answer" value="${option}" id="checkbox-${index}">${option}</label>`;
        });
        questionDiv.innerHTML += optionsHtml + '</div>';
    } else if (q.type === "match") {
        let matchesHtml = '<div class="options" id="match-options">';
        q.matches.forEach((match, index) => {
            matchesHtml += `
                <div class="match-item">
                    <p>${match.item}</p>
                    <select id="match-${index}" required>
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

    // Проверка для числовых и текстовых ответов
    if (q.type === "number" || q.type === "text") {
        const input = document.getElementById("answer");
        userAnswer = input.value.trim();
        if (!userAnswer) {
            input.style.border = "2px solid red";
            isValid = false;
        } else {
            input.style.border = "";
        }
    } 
    // Проверка для радио-кнопок
    else if (q.type === "radio") {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            document.getElementById("radio-options").style.border = "2px solid red";
            isValid = false;
        } else {
            document.getElementById("radio-options").style.border = "";
            userAnswer = selected.value;
        }
    } 
    // Проверка для чекбоксов
    else if (q.type === "checkbox") {
        const selected = Array.from(document.querySelectorAll('input[name="answer"]:checked'));
        if (selected.length === 0) {
            document.getElementById("checkbox-options").style.border = "2px solid red";
            isValid = false;
        } else {
            document.getElementById("checkbox-options").style.border = "";
            userAnswer = selected.map(input => input.value);
        }
    } 
    // Проверка для соответствий
    else if (q.type === "match") {
        userAnswer = [];
        let allSelected = true;
        
        q.matches.forEach((match, index) => {
            const select = document.getElementById(`match-${index}`);
            if (!select.value) {
                select.style.border = "2px solid red";
                allSelected = false;
            } else {
                select.style.border = "";
                userAnswer.push(select.value);
            }
        });
        
        if (!allSelected) {
            isValid = false;
        }
    }

    if (!isValid) {
        alert("Пожалуйста, ответьте на вопрос перед продолжением!");
        return;
    }

    // Сохраняем ответ и проверяем его
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
    scoreDisplay.textContent = `Поздравляем, вы прошли викторину! Ваш результат: ${score} из ${quizData.length}`;
    codeDisplay.textContent = `Ваш уникальный код, который нужно вставить в форму ниже: ${randomCode}${score} P.S. Форму можно опустить вниз`;
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
