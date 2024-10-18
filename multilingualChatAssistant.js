// Проверяем, поддерживает ли браузер API распознавания речи
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const synth = window.speechSynthesis;
    const startBtn = document.getElementById('start-record-btn');
    const outputText = document.getElementById('output-text');
    const languageSelector = document.getElementById('language');
    const chatbox = document.getElementById('chatbox');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

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
        addMessageToChat('user', transcript);
        respondToUser(transcript, recognition.lang); // Обработка ответа
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
        },
        'ru-RU': {
            "привет": ["здравствуйте", "хай"],
            "пока": ["до свидания", "прощай"],
        },
        'kk-KZ': {
            "сәлем": ["ассалаумағалейкум", "қайырлы күн"],
            "қош": ["сау бол", "қош бол"],
        }
    };

    const antonymsDB = {
        'en-US': {
            "good": "bad",
            "happy": "sad",
        },
        'ru-RU': {
            "хорошо": "плохо",
            "счастливый": "грустный",
        },
        'kk-KZ': {
            "жақсы": "жаман",
            "қуанышты": "қайғылы",
        }
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

        // Отправляем текстовый ответ в чат
        addMessageToChat('assistant', response);

        // Озвучка ответа
        const utterThis = new SpeechSynthesisUtterance(response);
        utterThis.lang = language;
        synth.speak(utterThis);
    }

    // Функция для добавления сообщения в чат
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'assistant-message');
        messageElement.textContent = sender === 'user' ? `You: ${message}` : `Assistant: ${message}`;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Прокручиваем вниз, чтобы видеть новые сообщения
    }

    // Обработка текстовых сообщений через чат
    sendBtn.addEventListener('click', () => {
        const userMessage = chatInput.value;
        if (userMessage.trim()) {
            addMessageToChat('user', userMessage);
            respondToUser(userMessage, languageSelector.value);
            chatInput.value = ''; // Очищаем поле ввода
        }
    });
} else {
    alert('Web Speech API is not supported in this browser.');
}
