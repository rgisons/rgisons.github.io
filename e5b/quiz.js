const quizData = [
    {
        question: "Какой фильм рассказывает о путешествии через червоточину? (в ответе напишите только название)",
        type: "text",
        correct: "Интерстеллар"
    },
    {
        question: "Как называется фильм, где астронавт остался один на Марсе? (в ответе напишите только название)",
        type: "text",
        correct: "Марсианин"
    },
    {
        question: "Какой российский фильм рассказывает о первом выходе в открытый космос?",
        type: "radio",
        options: ["Салют-7", "Время первых", "Вызов"],
        correct: "Время первых"
    },
    {
        question: "Какой фильм был частично снят на борту МКС?",
        type: "radio",
        options: ["Вызов", "Гравитация", "Аполлон-13"],
        correct: "Вызов"
    },
    {
        question: "Какие фильмы о космосе вышли после 2015 года? (выберите все верные варианты)",
        type: "checkbox",
        options: ["Интерстеллар", "Марсианин", "Время первых", "Вызов"],
        correct: ["Марсианин", "Время первых", "Вызов"]
    }
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
    scoreDisplay.textContent = `Поздравяляем, вы прошли виктоину! Ваш результат: ${score} из ${quizData.length}`;
    codeDisplay.textContent = `Ваш уникальный код, который нужно вставить в форму ниже: ${randomCode}${score}`;
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
