function formatKZT(n){
  const x = Math.round(Number(n || 0));
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
}

const UI = {
  toast(msg, type="ok"){
    const host = document.getElementById("toast");
    if (!host) return alert(msg);
    const div = document.createElement("div");
    div.className = "toast__item " + (type === "err" ? "toast__item--err" : "toast__item--ok");
    div.textContent = msg;
    host.appendChild(div);
    setTimeout(() => div.remove(), 2600);
  },

  setYear(){
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  },

  requireAuthOrRedirect(){
    const token = Storage.getToken();
    if (!token) {
      location.href = "/pages/login.html";
      return false;
    }
    return true;
  }
};
