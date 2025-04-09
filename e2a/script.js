const quizData = [
    {
        question: "На каком расстоянии Луна находится от Земли?",
        type: "number",
        correct: "384400"
    },
    {
        question: "Как образовалась Луна?",
        type: "radio",
        options: [
            "В результате взрыва звезды",
            "Она всегда была рядом с Землей",
            "В результате столкновения Земли с крупным объектом"
        ],
        correct: "В результате столкновения Земли с крупным объектом"
    },
    {
        question: "Что такое лунные моря? (в ответе нужно написать ДВА слова с МАЛЕНЬКОЙ буквы)",
        type: "text",
        correct: "застывшая лава"
    },
    {
        question: "Когда человек впервые ступил на Луну? (вводить ф формате ДД.ММ.ГГ)",
        type: "text",
        correct: "20.07.1969"
    },
    {
        question: "Какие явления на Земле вызывает Луна?",
        type: "checkbox",
        options: ["Приливы", "Ураганы", "Землетрясения", "Отливы"],
        correct: ["Приливы", "Отливы"]
    },
    {
        question: "Соотнесите понятия с их описаниями",
        type: "match",
        matches: [
            {
                item: "Лунные моря",
                options: [
                    "Результат ударов метеоритов",
                    "Застывшие равнины лавы",
                    "Горы на поверхности Луны"
                ],
                correct: "Застывшие равнины лавы"
            },
            {
                item: "Лунные кратеры",
                options: [
                    "Результат ударов метеоритов",
                    "Застывшие равнины лавы",
                    "Горы на поверхности Луны"
                ],
                correct: "Результат ударов метеоритов"
            },
            {
                item: "Лунные горы",
                options: [
                    "Результат ударов метеоритов",
                    "Застывшие равнины лавы",
                    "Горы на поверхности Луны"
                ],
                correct: "Горы на поверхности Луны"
            }
        ]
    },
    {
        question: "Какой диаметр у Луны?",
        type: "number",
        correct: "3474"
    },
    {
        question: "Какая миссия первой доставила человека на Луну?",
        type: "radio",
        options: ["Apollo 11", "Apollo 13", "Sputnik 1"],
        correct: "Apollo 11"
    },
    {
        question: "Какую роль Луна играет для Земли?",
        type: "checkbox",
        options: [
            "Стабилизирует ось",
            "Защищает от астероидов",
            "Вызывает приливы",
            "Создает магнитное поле"
        ],
        correct: ["Стабилизирует ось", "Вызывает приливы"]
    },
    {
        question: "Какой возраст Луны?",
        type: "radio",
        options: ["2 миллиарда лет", "4,5 миллиарда лет", "1 миллиард лет"],
        correct: "4,5 миллиарда лет"
    }
];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const introContainer = document.getElementById('intro');
const navigationContainer = document.querySelector('.navigation');
const prevButton = document.getElementById('prev');
const checkButton = document.getElementById('check');
const nextButton = document.getElementById('next');
const startButton = document.getElementById('start-quiz');
let currentQuestion = 0;
let answers = {};

// Проверка загрузки элементов
console.log('startButton:', startButton); // Должно вывести элемент button

// Санитизация ввода
function sanitizeInput(input) {
    return input.replace(/[<>&"']/g, '');
}

// Создание вопроса
function createQuestionElement(item, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = `question ${index === 0 ? 'active' : ''}`;
    questionDiv.dataset.number = index;

    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${item.question}`;
    questionDiv.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    questionDiv.appendChild(optionsDiv);

    if (item.type === "radio") {
        item.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'match-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${index}`;
            input.value = option;
            label.appendChild(input);

            label.appendChild(document.createTextNode(option));
            optionsDiv.appendChild(label);
        });
    } else if (item.type === "text") {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `text-answer${index}`;
        input.placeholder = 'Введите ответ';
        optionsDiv.appendChild(input);
    } else if (item.type === "checkbox") {
        item.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = `question${index}`;
            input.value = option;
            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            optionsDiv.appendChild(label);
            optionsDiv.appendChild(document.createElement('br'));
        });
    } else if (item.type === "number") {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `number-answer${index}`;
        input.placeholder = 'Введите число';
        optionsDiv.appendChild(input);
    } else if (item.type === "date") {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `date-answer${index}`;
        input.placeholder = 'Введите дату (например, 20.07.1969)';
        optionsDiv.appendChild(input);
    } else if (item.type === "match") {
        item.matches.forEach((match, subIndex) => {
            const subDiv = document.createElement('div');
            subDiv.className = 'match-subquestion';

            const p = document.createElement('p');
            p.textContent = match.item;
            subDiv.appendChild(p);

            const select = document.createElement('select');
            select.name = `match${index}-${subIndex}`;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Выберите описание...';
            select.appendChild(defaultOption);

            match.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });

            subDiv.appendChild(select);
            optionsDiv.appendChild(subDiv);
        });
    }

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';
    feedbackDiv.id = `feedback${index}`;
    questionDiv.appendChild(feedbackDiv);

    return questionDiv;
}

// Построение викторины
function buildQuiz() {
    console.log('Building quiz...');
    quizData.forEach((item, index) => {
        quizContainer.appendChild(createQuestionElement(item, index));
    });
    console.log('Quiz built:', quizContainer.innerHTML);
}

// Показать вопрос
function showQuestion(index) {
    const questions = document.querySelectorAll('.question');
    questions[currentQuestion].classList.remove('active');
    questions[index].classList.add('active');
    currentQuestion = index;

    prevButton.style.display = currentQuestion === 0 ? 'none' : 'inline';
    checkButton.style.display = answers[currentQuestion] ? 'none' : 'inline';
    nextButton.style.display = answers[currentQuestion] && currentQuestion < quizData.length - 1 ? 'inline' : 'none';

    updateFeedback();
}

// Обновить обратную связь
function updateFeedback() {
    const feedback = document.querySelector(`#feedback${currentQuestion}`);
    feedback.innerHTML = '';
}

// Проверка ответа
function checkAnswer() {
    const currentQ = document.querySelector(`.question[data-number="${currentQuestion}"]`);
    let selected;

    if (quizData[currentQuestion].type === "radio") {
        selected = currentQ.querySelector(`input[name="question${currentQuestion}"]:checked`);
        if (!selected) return alert('Пожалуйста, выберите ответ!');
        answers[currentQuestion] = selected.value;
    } else if (quizData[currentQuestion].type === "text") {
        selected = sanitizeInput(currentQ.querySelector(`#text-answer${currentQuestion}`).value.trim());
        if (!selected) return alert('Пожалуйста, введите ответ!');
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "checkbox") {
        selected = Array.from(currentQ.querySelectorAll(`input[name="question${currentQuestion}"]:checked`))
            .map(input => input.value);
        if (selected.length === 0) return alert('Пожалуйста, выберите хотя бы один вариант!');
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "number") {
        selected = sanitizeInput(currentQ.querySelector(`#number-answer${currentQuestion}`).value.trim());
        if (!selected) return alert('Пожалуйста, введите число!');
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "match") {
        selected = [];
        for (let subIndex = 0; subIndex < quizData[currentQuestion].matches.length; subIndex++) {
            const match = quizData[currentQuestion].matches[subIndex];
            const selectedOption = currentQ.querySelector(`select[name="match${currentQuestion}-${subIndex}"]`).value;
            if (!selectedOption) return alert(`Пожалуйста, выберите описание для "${match.item}"!`);
            selected.push(selectedOption);
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "date") {
        selected = sanitizeInput(currentQ.querySelector(`#date-answer${currentQuestion}`).value.trim());
        if (!selected) return alert('Пожалуйста, введите дату!');
        answers[currentQuestion] = selected;
    }

    checkButton.style.display = 'none';
    nextButton.style.display = currentQuestion < quizData.length - 1 ? 'inline' : 'none';

    if (currentQuestion < quizData.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        showResults();
    }
}

// Генерация уникального кода
function generateCode(score) {
    const baseCode = Math.floor(100000 + Math.random() * 900000);
    return `${baseCode}${score}`;
}

// Показать результаты
function showResults() {
    let score = 0;
    quizData.forEach((question, index) => {
        if (question.type === "radio" || question.type === "text" || question.type === "number" || question.type === "date") {
            if (answers[index] === question.correct) score++;
        } else if (question.type === "checkbox") {
            if (JSON.stringify(answers[index]?.sort()) === JSON.stringify(question.correct.sort())) score++;
        } else if (question.type === "match") {
            const correctAnswers = question.matches.map(m => m.correct);
            if (JSON.stringify(answers[index]) === JSON.stringify(correctAnswers)) score++;
        }
    });

    const uniqueCode = generateCode(score);

    quizContainer.style.display = 'none';
    navigationContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    resultContainer.innerHTML = `
        <p>Викторина завершена! Вы набрали ${score} из ${quizData.length} баллов! Пожалуйста, введите код в форму.</p>
        <div>
            <p>Ваш уникальный код: <strong id="unique-code">${uniqueCode}</strong></p>
            <button id="copy-code">Скопировать код</button>
        </div>
        <div id="yandex-form-container">
        <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSc46otjgrk50k1CsN0_IX1nXHKPcuPpA7w6T_4BSjxjzTJJ5g/viewform?embedded=true"
        width="640" 
        height="720" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0">
        Загрузка…
        </iframe>
        </div>

    `;

    document.getElementById('copy-code').addEventListener('click', () => {
        const code = document.getElementById('unique-code').textContent;
        navigator.clipboard.writeText(code)
            .then(() => alert('Код скопирован в буфер обмена!'))
            .catch(err => alert('Не удалось скопировать код: ' + err));
    });
}

// Инициализация
function init() {
    console.log('Initializing...');
    buildQuiz();
    startButton.addEventListener('click', () => {
        console.log('Start button clicked!');
        introContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        navigationContainer.style.display = 'block';
        showQuestion(0);
    });
    prevButton.addEventListener('click', () => showQuestion(currentQuestion - 1));
    checkButton.addEventListener('click', checkAnswer);
    nextButton.addEventListener('click', () => showQuestion(currentQuestion + 1));
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    init();
});
