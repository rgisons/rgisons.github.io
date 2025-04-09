const quizData = [
    {
        question: "Какая по счету планета Сатурн от Солнца? (в ответе напишите только ЧИСЛО)",
        type: "number",
        correct: "6"
    },
    {
        question: "Из чего состоят кольца Сатурна?",
        type: "checkbox",
        options: ["Лед", "Гелий", "Камни", "Пыль"],
        correct: ["Лед", "Камни", "Пыль"]
    },
    {
        question: "Какие основные элементы составляют атмосферу Сатурна?",
        type: "radio",
        options: ["Водород и гелий", "Кислород и азот", "Углерод и метан"],
        correct: "Водород и гелий"
    },
    {
        question: "Как называется крупнейший спутник Сатурна? (введите ОДНО слово с БОЛЬШОЙ буквы)",
        type: "text",
        correct: "Титан"
    },
    {
        question: "Что делает Сатурн уникальным среди других планет? (выберите все верные варианты)",
        type: "checkbox",
        options: ["Его кольца", "Очень низкая плотность", "Магнитное поле", "Большое количество спутников"],
        correct: ["Его кольца", "Очень низкая плотность", "Большое количество спутников"]
    },
    {
        question: "Какой спутник Сатурна считается перспективным местом для поиска внеземной жизни?",
        type: "radio",
        options: ["Мимас", "Энцелад", "Япет"],
        correct: "Энцелад"
    },
    {
        question: "Соотнесите понятия с их описаниями",
        type: "match",
        matches: [
            {
                item: "Кольца Сатурна",
                options: [
                    "Состоят из льда и камней",
                    "Являются спутниками планеты",
                    "Защищают от солнечного ветра"
                ],
                correct: "Состоят из льда и камней"
            },
            {
                item: "Магнитное поле",
                options: [
                    "Состоят из льда и камней",
                    "Являются спутниками планеты",
                    "Защищают от солнечного ветра"
                ],
                correct: "Защищают от солнечного ветра"
            }
        ]
    },
    {
        question: "Сколько спутников у Сатурна? (укажите приблизительное число)",
        type: "number",
        correct: "80"
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

    if (q.type === "number" || q.type === "text") {
        userAnswer = document.getElementById("answer").value;
    } else if (q.type === "radio") {
        const selected = document.querySelector('input[name="answer"]:checked');
        userAnswer = selected ? selected.value : '';
    } else if (q.type === "checkbox") {
        userAnswer = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => input.value);
    } else if (q.type === "match") {
        userAnswer = q.matches.map((match, index) => {
            const select = document.getElementById(`match-${index}`);
            return select ? select.value : '';
        });
    }

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