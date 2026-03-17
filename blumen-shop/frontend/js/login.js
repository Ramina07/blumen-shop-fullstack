(function(){
  const iconsScript = document.createElement("script");
  iconsScript.src = "/js/icons.js";
  document.head.appendChild(iconsScript);

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const payload = Object.fromEntries(fd.entries());

    try{
      const { token } = await API.login(payload);
      Storage.setToken(token);
      UI.toast("Вы вошли в аккаунт");
      setTimeout(() => location.href = "/", 600);
    }catch(err){
      UI.toast(err.message, "err");
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(registerForm);
    const payload = Object.fromEntries(fd.entries());

    if ((payload.password || "").length < 6){
      UI.toast("Пароль должен быть минимум 6 символов", "err");
      return;
    }

    try{
      const { token } = await API.register(payload);
      Storage.setToken(token);
      UI.toast("Аккаунт создан");
      setTimeout(() => location.href = "/", 600);
    }catch(err){
      UI.toast(err.message, "err");
    }
  });
})(); 
