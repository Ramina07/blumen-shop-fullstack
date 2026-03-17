(function(){
  const iconsScript = document.createElement("script");
  iconsScript.src = "/js/icons.js";
  document.head.appendChild(iconsScript);

  const ordersLink = document.getElementById("ordersLink");
  const logoutBtn = document.getElementById("logoutBtn");

  const cartEl = document.getElementById("checkoutCart");
  const itemsSumEl = document.getElementById("itemsSum");
  const deliveryFeeEl = document.getElementById("deliveryFee");
  const totalSumEl = document.getElementById("totalSum");
  const form = document.getElementById("checkoutForm");

  const DELIVERY_FEE = 1500;

  function cartTotals(cart){
    const itemsSum = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const deliveryFee = cart.length ? DELIVERY_FEE : 0;
    return { itemsSum, deliveryFee, total: itemsSum + deliveryFee };
  }

  function renderCart(){
    const cart = Storage.getCart();
    if (!cart.length){
      cartEl.innerHTML = `<div class="note">Корзина пустая. Вернитесь в каталог и добавьте товары.</div>`;
    } else {
      cartEl.innerHTML = `<div class="cart__list"></div>`;
      const list = cartEl.querySelector(".cart__list");

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
              <span class="note">${it.qty} шт</span>
              <span class="note">${formatKZT(it.price)} за шт</span>
            </div>
          </div>
          <div class="cart__sum">${formatKZT(it.price * it.qty)}</div>
        `;
        list.appendChild(row);
      });
    }

    const t = cartTotals(cart);
    itemsSumEl.textContent = formatKZT(t.itemsSum);
    deliveryFeeEl.textContent = formatKZT(t.deliveryFee);
    totalSumEl.textContent = formatKZT(t.total);
  }

  function initAuth(){
    const token = Storage.getToken();
    if (token){
      if (ordersLink) ordersLink.style.display = "";
      if (logoutBtn) {
        logoutBtn.style.display = "";
        logoutBtn.onclick = () => {
          Storage.clearToken();
          UI.toast("Вы вышли");
          setTimeout(()=>location.href="/", 500);
        };
      }
      return true;
    }
    location.href = "/pages/login.html";
    return false;
  }

  function buildOrderPayload(formValues){
    const cart = Storage.getCart();
    const t = cartTotals(cart);

    return {
      items: cart.map((x) => ({
        productId: x.productId,
        title: x.title,
        price: x.price,
        qty: x.qty,
        image: x.image || ""
      })),
      customer: {
        name: formValues.name,
        phone: formValues.phone
      },
      delivery: {
        city: "Уральск",
        address: formValues.address,
        comment: formValues.comment || "",
        date: formValues.date || "",
        time: formValues.time || ""
      },
      payment: {
        method: formValues.paymentMethod
      },
      totals: {
        itemsSum: t.itemsSum,
        deliveryFee: t.deliveryFee,
        total: t.total
      }
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cart = Storage.getCart();
    if (!cart.length){
      UI.toast("Корзина пустая", "err");
      return;
    }

    const fd = new FormData(form);
    const values = Object.fromEntries(fd.entries());

    try{
      const payload = buildOrderPayload(values);
      const { orderId } = await API.createOrder(payload);
      Storage.setCart([]);
      UI.toast("Заказ создан! Номер: " + orderId);
      setTimeout(() => location.href = "/pages/orders.html", 900);
    }catch(err){
      UI.toast(err.message, "err");
    }
  });

  if (initAuth()){
    renderCart();
  }
})(); 
