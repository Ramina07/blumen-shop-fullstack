const Storage = {
  getToken() {
    return localStorage.getItem("blumen_token");
  },
  setToken(token) {
    localStorage.setItem("blumen_token", token);
  },
  clearToken() {
    localStorage.removeItem("blumen_token");
  },

  getCart() {
    try { return JSON.parse(localStorage.getItem("blumen_cart") || "[]"); }
    catch { return []; }
  },
  setCart(cart) {
    localStorage.setItem("blumen_cart", JSON.stringify(cart || []));
  }
};
