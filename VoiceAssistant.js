// Проверяем, поддерживает ли браузер API распознавания речи
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const synth = window.speechSynthesis;
    const startBtn = document.getElementById('start-record-btn');
    const outputText = document.getElementById('output-text');
    const languageSelector = document.getElementById('language');

    // Выбор языка из выпадающего списка
    languageSelector.addEventListener('change', () => {
        recognition.lang = languageSelector.value;
    });

    // Начинаем распознавание речи по клику
    startBtn.addEventListener('click', () => {
        recognition.start();
        outputText.textContent = 'Listening...';
    });

    // Обработка распознанной речи
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        outputText.textContent = 'You said: ' + transcript;
        respondToUser(transcript, recognition.lang); // Добавляем обработку на основе языка
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        outputText.textContent = 'Error occurred in recognition: ' + event.error;
    };

    // База данных синонимов и антонимов (упрощенная версия в JSON-формате)
    const synonymsDB = {
        'en-US': {
            "hello": ["hi", "hey", "greetings"],
            "goodbye": ["bye", "farewell"],
            "Имя": ["Ваще имя?", "Как тебя зовут?"],
            "Умеешь": ["Что вы умеете?", "Что ты умеешь?"],
            "Работаете": ["Как вы работаете", "Как ты работаешь?"],
            "Помоги мне": ["Помоги!", "Можешь помочь мне с чем-то?"],
            "Сегодня": ["Сегодня день", "Какой сегодня день?"],
            "Сколько часов?": ["Которые час?", "Сколько сейчас времени?"],
            "Погода": ["Сегодня погода?", "Какая погода?"],
            "Что такое Робот?": ["Что такое ИИ?", "Что такое искусственный интеллект?"],
            "Погода": ["Сегодня погода?", "Как включить музыку?"],
            "Погода": ["", "Как пользоваться с веб сайтом?"],
            "Ой бля": ["Что то не так", "Что пошло не так!"],
        },
        'ru-RU': {
            "привет": ["здравствуйте", "хай"],
            "пока": ["до свидания", "прощай"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
        },
        'kk-KZ': {
            "сәлем": ["ассалаумағалейкум", "қайырлы күн"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
            "қош": ["сау бол", "қош бол"],
        }
    };

    const antonymsDB = {
        'en-US': {
            "good": "bad",
            "happy": "sad",
            "": "",
            "": "",
            "": "",
            "": "",
            "": "",
            "": "",
        },
        'ru-RU': {
            "хорошо": "плохо",
            "счастливый": "грустный",
            "": "",
            "": "",
            "": "",
            "": "",
            "": "",
            "": "",
        },
        'kk-KZ': {
            "жақсы": "жаман",
            "қуанышты": "қайғылы",
            "": "",
            "": "",
            "": "",
            "": "",
            "": "",
            "": "",
        },
    };

    // Функция для обработки команды и ответа в зависимости от языка
    function respondToUser(command, language) {
        let response = '';
        const synonyms = synonymsDB[language];
        const antonyms = antonymsDB[language];

        // Простая логика для ответа на основе команд
        if (command.includes('hello') || command.includes('hi')) {
            response = 'Hello! How can I help you today?';
        } else if (command.includes('привет')) {
            response = 'Привет! Как я могу помочь?';
        } else if (command.includes('сәлем')) {
            response = 'Сәлем! Қалай көмектесе аламын?';
        } else if (command.includes('goodbye') || command.includes('пока') || command.includes('қош')) {
            response = 'Goodbye! Have a great day!';
        } else {
            response = "Sorry, I didn't understand that.";
        }

        // Добавляем обработку синонимов и антонимов (для примера)
        for (let key in synonyms) {
            if (synonyms[key].includes(command)) {
                response = `Did you mean "${key}"?`;
            }
        }

        const utterThis = new SpeechSynthesisUtterance(response);
        utterThis.lang = language;
        synth.speak(utterThis);
    }
} else {
    alert('Web Speech API is not supported in this browser.');
}
