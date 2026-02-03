# Chat Frontend

Фронтенд для чат-приложения с поддержкой голосового ввода и стриминга ответов через WebSocket.

## Что внутри

- React 19 + Vite
- WebSocket для real-time коммуникации
- Голосовой ввод через Speech Recognition API
- Автоматический реконнект при разрыве соединения

## Установка

```bash
npm install
```

Создай `.env` файл:
```bash
cp .env.example .env
```

В `.env` пропиши:
```
VITE_WS_URL=ws://localhost:3001
VITE_API_URL=http://localhost:3000
```

## Запуск

```bash
npm run dev
```

## Структура

```
src/
├── components/       # UI компоненты
│   ├── ChatBox/      # Поле ввода + кнопка микрофона
│   ├── ChatMessages/ # Список сообщений
│   └── MainPage/     # Главная страница
├── hooks/
│   ├── useChatSocket.jsx   # WebSocket логика
│   └── useVoiceInput.jsx   # Распознавание речи
├── services/
│   └── websocket.js        # WebSocket сервис
└── App.jsx
```

## Основные фичи

### WebSocket
- Стриминг ответов в реальном времени
- Автоматический реконнект (до 5 попыток)
- Показываются статусы подключения

### Голосовой ввод
- Работает в Chrome/Edge
- Распознает русский язык
- Показывает анимацию при прослушивании
- Обработка ошибок (нет микрофона, отказ в доступе и тд)

### UI
- Адаптивная верстка
- Loading индикаторы
- Автоскролл к новым сообщениям
- Typing индикатор когда бот печатает
- Кнопки блокируются пока идет отправка

## Компоненты

**ChatBox** - инпут для сообщений
- Принимает `onSendMessage`, `isLoading`, `connectionStatus`, `error`
- Enter отправляет, Shift+Enter - новая строка
- Кнопка микрофона если браузер поддерживает

**ChatMessages** - отображение истории
- Принимает `messages` и `isLoading`
- Автоскролл к последнему сообщению
- Показывает typing индикатор

**MainPage** - экран приветствия (показывается до первого сообщения)

## Хуки

**useChatSocket** - управляет WebSocket соединением
```js
const { messages, sendMessage, isLoading, connectionStatus, error } = useChatSocket()
```

**useVoiceInput** - распознавание речи
```js
const { listening, startListening, isSupported } = useVoiceInput(onResult, onError)
```
