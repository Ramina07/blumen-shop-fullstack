# Важно про MongoDB Atlas

Не вставляй логин/пароль Atlas прямо в код и не коммить их в репозиторий.
Подключение делается только через файл **backend/.env**.

# BLUMEN — Flower boutique (Уральск) — Fullstack (Node.js + Express + MongoDB + Vanilla Frontend)

Это готовый учебный проект магазина цветов: каталог, поиск/фильтр, корзина, авторизация, оформление заказа, страница заказов.

## 1) Что установлено
- Node.js 18+ (лучше 20)
- MongoDB Community + MongoDB Compass

## 2) Быстрый запуск (самый простой)
### Шаг A. Запусти MongoDB
1. Установи MongoDB Community.
2. Убедись, что сервис MongoDB запущен.
3. В Compass можно проверить подключение:
   - URI: `mongodb://127.0.0.1:27017`

### Шаг B. Настрой backend
1. Открой папку `backend`
2. Создай файл `.env` (скопируй `.env.example` → `.env`)
3. В `.env` оставь так:
   - `MONGO_URI=mongodb://127.0.0.1:27017/blumen`
   - `JWT_SECRET=...` (можно оставить как есть)

### Шаг C. Поставь зависимости и запусти сервер
В терминале (в папке `backend`):
```bash
npm install
npm run seed
npm start
```

Открой в браузере:
- `http://localhost:5050`

## 3) Как добавить товары (вариант 1 — seed скрипт)
Команда уже есть:
```bash
npm run seed
```
Она очистит коллекцию `products` и добавит набор товаров.

## 4) Как добавить товары через MongoDB Compass (вариант 2)
1. Открой Compass → подключись к `mongodb://127.0.0.1:27017`
2. Database: `blumen`
3. Collection: `products`
4. Нажми **Insert Document**
5. Пример документа товара:

```json
{
  "title": "Букет из белых роз (25 шт)",
  "slug": "buket-belyh-roz-25",
  "category": "Розы",
  "price": 19990,
  "oldPrice": 22990,
  "images": ["/assets/img/products/rose-white-25.jpg"],
  "description": "Классический белый букет для особого случая.",
  "composition": ["Роза белая — 25 шт", "Упаковка", "Лента"],
  "inStock": true,
  "tags": ["классика", "подарок"],
  "rating": 4.8
}
```

Важно:
- `slug` должен быть уникальным.
- `images` — путь к картинке внутри `frontend/assets/...`

## 5) Куда добавить картинки
Смотри папку:
- `frontend/assets/img/hero.jpg` — баннер на главной
- `frontend/assets/img/products/*.jpg` — картинки товаров

Проект уже добавил ссылки на такие имена файлов:
- `rose-red-51.jpg`
- `tulip-mix-25.jpg`
- `peony-9.jpg`
- `euro-cotton.jpg`
- `box-pink.jpg`
- `basket-party.jpg`
- `daisy-35.jpg`
- `chrys-15.jpg`
- `rose-pink.jpg` (общая картинка для розовых роз)

Ты можешь:
- либо назвать картинки так же
- либо поменять поле `images` у товара в MongoDB

## 6) Авторизация и заказы
- Вход/регистрация: `/pages/login.html`
- После входа появляется пункт **Мои заказы**
- Корзина хранится в `localStorage`
- Заказ сохраняется в MongoDB в коллекции `orders`

## 7) Частые проблемы
- Пишет "Не удалось загрузить товары": убедись, что сервер запущен и MongoDB работает
- Ошибка подключения к Mongo: проверь `MONGO_URI` и запущен ли сервис MongoDB

Удачи! 🙂
