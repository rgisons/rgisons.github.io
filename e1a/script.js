// Данные викторины
const quizData = [
    {
        question: "Где проводится подготовка космонавтов в России? (в ответе напишите НАЗВАНИЕ города)",
        type: "text",
        correct: "Звездный городок"
    },
    {
        question: "Как называется центр подготовки космонавтов в России? (укажите только ФАМИЛИЮ)",
        type: "text",
        correct: "Гагарина"
    },
    {
        question: "Сколько длится общекосмическая подготовка космонавтов в годах? (в ответе напишите только ЧИСЛО)",
        type: "number",
        correct: "2"
    },
    {
        question: "Что изучают космонавты во время подготовки? (выберите все верные варианты)",
        type: "checkbox",
        options: ["Фотографию", "Конструкции бортовых систем", "Теорию космонавтики", "Работу с 3D-принтерами"],
        correct: ["Теорию космонавтики", "Конструкции бортовых систем", "Работу с 3D-принтерами"]
    },
    {
        question: "На каком самолете отрабатывают невесомость?",
        type: "radio",
        options: ["Ту-154", "Ил-76 МДК", "Су-35"],
        correct: "Ил-76 МДК"
    },
    {
        question: "Какой этап является заключительным в подготовке космонавтов?",
        type: "radio",
        options: ["Тренировки на центрифуге", "Медицинский осмотр", "Полеты на самолете"],
        correct: "Тренировки на центрифуге"
    },
    {
        question: "В каком году Роскосмос планирует провести новый набор космонавтов? (в ответе напишите только ЧИСЛО)",
        type: "number",
        correct: "2026"
    },
    {
        question: "Соотнесите понятия с их описаниями",
        type: "match",
        matches: [
            {
                item: "Центрифуга",
                options: ["Используется для имитации перегрузок", "Используется для имитации невесомости", "Используется для изучения теории"],
                correct: "Используется для имитации перегрузок"
            },
            {
                item: "Ил-76 МДК",
                options: ["Используется для имитации перегрузок", "Используется для имитации невесомости", "Используется для изучения теории"],
                correct: "Используется для имитации невесомости"
            }
        ]
    },
    {
        question: "Какие качества проверяются у кандидатов в космонавты? (выберите все верные варианты)",
        type: "checkbox",
        options: ["Профессиональная пригодность", "Физическая подготовка", "Художественные навыки", "Медицинское обследование"],
        correct: ["Профессиональная пригодность", "Физическая подготовка", "Медицинское обследование"]
    }
];

// Элементы DOM
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
        if (question.type === "radio" || question.type === "text" || question.type === "number") {
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
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc46otjgrk50k1CsN0_IX1nXHKPcuPpA7w6T_4BSjxjzTJJ5g/viewform?embedded=true"
                width="640" height="720" frameborder="0" marginheight="0" marginwidth="0" sandbox="allow-same-origin allow-forms">
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