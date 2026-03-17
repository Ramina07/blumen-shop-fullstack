const API = {
  async request(path, opts = {}) {
    const base = (window.BLUMEN_CONFIG && window.BLUMEN_CONFIG.API_BASE) || "";
    const url = base + path;

    const headers = Object.assign(
      { "Content-Type": "application/json" },
      opts.headers || {}
    );

    const token = Storage.getToken();
    if (token) headers.Authorization = "Bearer " + token;

    const res = await fetch(url, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.message || "Ошибка запроса";
      throw new Error(msg);
    }
    return data;
  },

  getProducts(params = {}) {
    const q = new URLSearchParams(params).toString();
    return API.request(`/api/products${q ? "?" + q : ""}`);
  },

  getProduct(slug) {
    return API.request(`/api/products/${encodeURIComponent(slug)}`);
  },

  register(payload) {
    return API.request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },

  login(payload) {
    return API.request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
  },

  me() {
    return API.request("/api/auth/me");
  },

  createOrder(payload) {
    return API.request("/api/orders", { method: "POST", body: JSON.stringify(payload) });
  },

  myOrders() {
    return API.request("/api/orders/my");
  }
};
