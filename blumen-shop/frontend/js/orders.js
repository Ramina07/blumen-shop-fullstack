(function(){
  const iconsScript = document.createElement("script");
  iconsScript.src = "/js/icons.js";
  document.head.appendChild(iconsScript);

  const list = document.getElementById("ordersList");
  const logoutBtn = document.getElementById("logoutBtn");

  function init(){
    const token = Storage.getToken();
    if (!token){
      location.href = "/pages/login.html";
      return false;
    }
    logoutBtn.onclick = () => {
      Storage.clearToken();
      UI.toast("Вы вышли");
      setTimeout(()=>location.href="/", 500);
    };
    return true;
  }

  function card(order){
    const div = document.createElement("div");
    div.className = "card";
    div.style.padding = "14px";
    div.style.marginBottom = "12px";
    const dt = new Date(order.createdAt).toLocaleString("ru-RU");
    const items = order.items || [];

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">
        <div>
          <div style="font-weight:800">Заказ № ${order._id}</div>
          <div class="small">${dt} • Статус: ${order.status}</div>
        </div>
        <div class="badge">Итого: ${formatKZT(order.totals?.total || 0)}</div>
      </div>

      <div style="margin-top:10px; display:grid; gap:8px">
        ${items.map(it => `
          <div style="display:flex;justify-content:space-between;gap:10px;align-items:center; padding:10px; border-radius:16px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08)">
            <div style="display:flex; gap:10px; align-items:center">
              <div style="width:44px;height:44px;border-radius:12px;overflow:hidden;background:rgba(0,0,0,.18)">
                ${it.image ? `<img src="${it.image}" style="width:100%;height:100%;object-fit:cover" />` : ``}
              </div>
              <div>
                <div style="font-size:13px">${it.title}</div>
                <div class="small">${it.qty} шт • ${formatKZT(it.price)} за шт</div>
              </div>
            </div>
            <div style="font-weight:800">${formatKZT(it.price * it.qty)}</div>
          </div>
        `).join("")}
      </div>

      <div style="margin-top:10px; color:rgba(159,176,166,.95); font-size:13px">
        Доставка: Уральск, ${order.delivery?.address || ""}. Оплата: ${order.payment?.method || ""}.
      </div>
    `;
    return div;
  }

  async function load(){
    list.innerHTML = `<div class="note">Загрузка…</div>`;
    try{
      const { orders } = await API.myOrders();
      list.innerHTML = "";
      if (!orders.length){
        list.innerHTML = `<div class="note">Пока нет заказов. Вернитесь в каталог и оформите первый заказ.</div>`;
        return;
      }
      orders.forEach(o => list.appendChild(card(o)));
    }catch(err){
      list.innerHTML = `<div class="note">Не удалось загрузить заказы.</div>`;
      UI.toast(err.message, "err");
    }
  }

  if (init()) load();
})(); 
