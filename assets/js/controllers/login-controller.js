import { entrar } from "../auth/auth.js";
import { renderNavbar } from "../components/navbar.js";

renderNavbar(document.getElementById("navbar"), true);

const form = document.getElementById("form-login");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.classList.add("d-none");
  try {
    await entrar(form.elements.email.value.trim(), form.elements.senha.value);
    location.href = "../index.html";
  } catch (err) {
    msg.textContent = err instanceof TypeError
      ? "Não foi possível conectar à API. Verifique se o comando npm run api está rodando."
      : err.message;
    msg.classList.remove("d-none");
  }
});
