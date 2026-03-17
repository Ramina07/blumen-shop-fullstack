require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  {
    title: "51 красная роза Premium",
    slug: "51-krasnaya-roza-premium",
    category: "Розы",
    price: 32990,
    oldPrice: 36990,
    images: ["/assets/img/products/rose-red-51.jpg"],
    description: "Пышный букет из 51 красной розы. Подойдет для признания, годовщины и важных событий.",
    composition: ["Роза красная — 51 шт", "Упаковка", "Лента"],
    tags: ["хит", "классика"],
    rating: 4.9
  },
  {
    title: "Букет тюльпанов Mix (25 шт)",
    slug: "tulip-mix-25",
    category: "Тюльпаны",
    price: 15990,
    images: ["/assets/img/products/tulip-mix-25.jpg"],
    description: "Яркий микс тюльпанов для хорошего настроения.",
    composition: ["Тюльпаны — 25 шт", "Упаковка", "Лента"],
    tags: ["весна", "новинка"],
    rating: 4.8
  },
  {
    title: "Пионы нежные (9 шт)",
    slug: "piony-nezhnye-9",
    category: "Пионы",
    price: 27990,
    images: ["/assets/img/products/peony-9.jpg"],
    description: "Нежные пионы в стильной упаковке.",
    composition: ["Пионы — 9 шт", "Упаковка", "Лента"],
    tags: ["премиум"],
    rating: 4.9
  },
  {
    title: "Евробукет \"Сахарная вата\"",
    slug: "evrobuket-saharnaya-vata",
    category: "Сборные букеты",
    price: 21990,
    images: ["/assets/img/products/euro-cotton.jpg"],
    description: "Сборный букет в пастельных оттенках.",
    composition: ["Розы", "Эустома", "Зелень", "Упаковка"],
    tags: ["евро", "нежный"],
    rating: 4.7
  },
  {
    title: "Цветы в коробке \"Pink Box\"",
    slug: "cvety-v-korobke-pink-box",
    category: "В коробке",
    price: 24990,
    images: ["/assets/img/products/box-pink.jpg"],
    description: "Композиция в шляпной коробке. Удобно дарить и перевозить.",
    composition: ["Розы", "Гортензия", "Оазис", "Коробка"],
    tags: ["коробка", "подарок"],
    rating: 4.8
  },
  {
    title: "Корзина цветов \"Большой праздник\"",
    slug: "korzina-bolshoj-prazdnik",
    category: "В корзине",
    price: 39990,
    images: ["/assets/img/products/basket-party.jpg"],
    description: "Большая корзина для ярких событий.",
    composition: ["Микс цветов", "Оазис", "Корзина"],
    tags: ["вау", "праздник"],
    rating: 4.9
  },
  {
    title: "Ромашки (35 шт)",
    slug: "romashki-35",
    category: "Ромашки",
    price: 13990,
    images: ["/assets/img/products/daisy-35.jpg"],
    description: "Легкий летний букет ромашек.",
    composition: ["Ромашки — 35 шт", "Упаковка", "Лента"],
    tags: ["лето"],
    rating: 4.6
  },
  {
    title: "Хризантемы белые (15 шт)",
    slug: "hrizantemy-belye-15",
    category: "Хризантемы",
    price: 14990,
    images: ["/assets/img/products/chrys-15.jpg"],
    description: "Нежный и стойкий букет хризантем.",
    composition: ["Хризантемы — 15 шт", "Упаковка", "Лента"],
    tags: ["стойкий"],
    rating: 4.7
  }
];

for (let i = 1; i <= 16; i++) {
  products.push({
    title: `Букет роз розовых (${19 + i} шт)`,
    slug: `buket-roz-rozovyh-${19 + i}`,
    category: "Розы",
    price: 12990 + i * 700,
    images: ["/assets/img/products/rose-pink.jpg"],
    description: "Актуальный букет розовых роз в стильной упаковке.",
    composition: [`Розы — ${19 + i} шт`, "Упаковка", "Лента"],
    tags: i % 2 ? ["популярное"] : ["новинка"],
    rating: 4.7
  });
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ Добавлено товаров: ${products.length}`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
