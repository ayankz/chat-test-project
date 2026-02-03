# Чат с OpenAI

Простое чат-приложение с голосовым вводом и стримингом ответов.

## Что внутри

- **Frontend** - React + Vite, голосовой ввод, WebSocket
- **Backend** - Node.js + Express, OpenAI API, WebSocket сервер

## Быстрый старт

### Backend

```bash
cd backend
npm install
cp .env.example .env
# добавь свой OPENAI_API_KEY в .env
npm run dev
```

Сервер запустится на `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Откроется на `http://localhost:5173`

## Что можно делать

- Писать сообщения в чат
- Использовать голосовой ввод (работает в Chrome/Edge)
- Получать стриминг ответы от GPT
- История диалога сохраняется

## Технологии

**Frontend:**
- React 19
- WebSocket для реального времени
- Speech Recognition API

**Backend:**
- Express 5
- OpenAI API (gpt-4o-mini)
- WebSocket (ws)

Подробнее смотри в README внутри каждой папки.
