(function(){
  // Icons
  const iconsScript = document.createElement("script");
  iconsScript.src = "/js/icons.js";
  document.head.appendChild(iconsScript);

  UI.setYear();

  const productsGrid = document.getElementById("productsGrid");
  const categorySelect = document.getElementById("categorySelect");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");

  const cartBtn = document.getElementById("cartBtn");
  const cartModal = document.getElementById("cartModal");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const cartList = document.getElementById("cartList");

  const cartCount = document.getElementById("cartCount");
  const itemsSumEl = document.getElementById("itemsSum");
  const deliveryFeeEl = document.getElementById("deliveryFee");
  const totalSumEl = document.getElementById("totalSum");

  const loginBtn = document.getElementById("loginBtn");
  const ordersLink = document.getElementById("ordersLink");

  const DELIVERY_FEE = 1500;

  function updateAuthUI(){
    const token = Storage.getToken();
    if (token) {
      loginBtn.textContent = "Аккаунт";
      loginBtn.onclick = () => location.href = "/pages/orders.html";
      if (ordersLink) ordersLink.style.display = "";
    } else {
      loginBtn.textContent = "Войти";
      loginBtn.onclick = () => location.href = "/pages/login.html";
      if (ordersLink) ordersLink.style.display = "none";
    }
  }

  function getCart(){
    return Storage.getCart();
  }

  function setCart(cart){
    Storage.setCart(cart);
    renderCartBadge();
  }

  function renderCartBadge(){
    const cart = getCart();
    const count = cart.reduce((s, it) => s + it.qty, 0);
    cartCount.textContent = String(count);
  }

  function cartTotals(cart){
    const itemsSum = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const deliveryFee = cart.length ? DELIVERY_FEE : 0;
    return { itemsSum, deliveryFee, total: itemsSum + deliveryFee };
  }

  function openCart(){
    renderCart();
    cartModal.classList.add("open");
    cartModal.setAttribute("aria-hidden", "false");
  }
  function closeCart(){
    cartModal.classList.remove("open");
    cartModal.setAttribute("aria-hidden", "true");
  }

  function renderCart(){
    const cart = getCart();
    cartList.innerHTML = "";

    if (!cart.length){
      cartList.innerHTML = `<div class="note">Корзина пустая. Добавьте товары из каталога.</div>`;
    } else {
      cart.forEach((it) => {
        const row = document.createElement("div");
        row.className = "cart__item";
        row.innerHTML = `
          <div class="cart__thumb">
            ${it.image ? `<img src="${it.image}" alt="">` : `<div style="height:100%;display:grid;place-items:center;color:rgba(159,176,166,.9);font-size:12px">нет фото</div>`}
          </div>
          <div>
            <p class="cart__name">${it.title}</p>
            <div class="cart__line">
              <div class="qty">
                <button data-act="dec">−</button>
                <span>${it.qty}</span>
                <button data-act="inc">+</button>
              </div>
              <span class="note">${formatKZT(it.price)} за шт</span>
              <button class="btn btn--danger" data-act="del">Удалить</button>
            </div>
          </div>
          <div class="cart__sum">${formatKZT(it.price * it.qty)}</div>
        `;

        row.querySelectorAll("button").forEach((b) => {
          b.addEventListener("click", () => {
            const act = b.dataset.act;
            const c = getCart();
            const idx = c.findIndex(x => x.productId === it.productId);
            if (idx < 0) return;

            if (act === "inc") c[idx].qty += 1;
            if (act === "dec") c[idx].qty = Math.max(1, c[idx].qty - 1);
            if (act === "del") c.splice(idx, 1);

            setCart(c);
            renderCart();
          });
        });

        cartList.appendChild(row);
      });
    }

    const t = cartTotals(cart);
    itemsSumEl.textContent = formatKZT(t.itemsSum);
    deliveryFeeEl.textContent = formatKZT(t.deliveryFee);
    totalSumEl.textContent = formatKZT(t.total);
  }

  function addToCart(product){
    const cart = getCart();
    const found = cart.find((x) => x.productId === product._id);
    if (found) found.qty += 1;
    else cart.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      qty: 1,
      image: product.images?.[0] || ""
    });
    setCart(cart);
    UI.toast("Добавлено в корзину");
  }

  function productCard(p){
    const div = document.createElement("div");
    div.className = "product";
    const img = p.images?.[0] || "";
    div.innerHTML = `
      <div class="product__img">
        ${img ? `<img src="${img}" alt="">` : `<div class="placeholder">Картинка товара<br/>/assets/img/products/...</div>`}
      </div>
      <div class="product__body">
        <h3 class="product__title">${p.title}</h3>
        <div class="product__meta">
          <div class="price">
            <span class="price__now">${formatKZT(p.price)}</span>
            ${p.oldPrice ? `<span class="price__old">${formatKZT(p.oldPrice)}</span>` : ``}
          </div>
          <span class="badge">${p.category}</span>
        </div>
        <div class="product__actions">
          <button class="btn" data-act="details">Подробнее</button>
          <button class="btn btn--primary" data-act="add">В корзину</button>
        </div>
      </div>
    `;

    div.querySelector('[data-act="add"]').onclick = () => addToCart(p);

    div.querySelector('[data-act="details"]').onclick = () => {
      window.location.href = `/pages/product.html?slug=${p.slug}`;
};

return div;
  }

  async function load(){
    productsGrid.innerHTML = `<div class="note">Загрузка каталога…</div>`;
    try{
      const params = {
        category: categorySelect.value,
        sort: sortSelect.value,
        search: searchInput.value.trim()
      };
      const { items } = await API.getProducts(params);
      const order = { hit: 4, wow: 3, combo: 2, mono: 1 };

items.sort((a, b) => {
  const aTag = (a.tags || []).find(t => order[t] !== undefined);
  const bTag = (b.tags || []).find(t => order[t] !== undefined);

  const aScore = aTag ? order[aTag] : 0;
  const bScore = bTag ? order[bTag] : 0;

  if (aScore !== bScore) return bScore - aScore;   // сначала группы
  return (b.price || 0) - (a.price || 0);           // внутри группы: дороже выше
});
      productsGrid.innerHTML = "";
      if (!items.length){
        productsGrid.innerHTML = `<div class="note">Ничего не найдено. Попробуйте другой запрос.</div>`;
        return;
      }
      items.forEach((p) => productsGrid.appendChild(productCard(p)));
    }catch(e){
      productsGrid.innerHTML = `<div class="note">Не удалось загрузить товары. Проверьте запуск сервера и MongoDB.</div>`;
      UI.toast(e.message || "Ошибка загрузки", "err");
    }
  }

  // Listeners
  categorySelect.addEventListener("change", load);
  sortSelect.addEventListener("change", load);
  let t;
  searchInput.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(load, 350);
  });

  cartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartModal.addEventListener("click", (e) => { if (e.target === cartModal) closeCart(); });

  clearCartBtn.addEventListener("click", () => {
    setCart([]);
    renderCart();
  });

  updateAuthUI();
  renderCartBadge();
  load();
})(); 
