// Barra de navegação que muda conforme a sessão (visitante, cliente ou agente)
import { sessao, sair } from "../auth/auth.js";
import { esc } from "./dom.js";

export function renderNavbar(alvo, emPages = false) {
  const p = emPages ? "" : "pages/";
  const raiz = emPages ? "../" : "";
  const s = sessao();
  const itens = s
    ? [
        ...(s.tipo === "cliente"
          ? [`<a class="nav-link" href="${p}meus-pedidos.html">Meus pedidos</a>`, `<a class="nav-link" href="${p}cadastro.html">Meu cadastro</a>`]
          : [`<a class="nav-link" href="${p}painel-agente.html">Painel do agente</a>`]),
        `<span class="nav-link">${esc(s.nome)}</span>`,
        `<button id="btn-sair" type="button" class="btn btn-sm btn-wc ms-lg-2">Sair</button>`,
      ]
    : [
        `<a class="nav-link" href="${p}login.html">Entrar</a>`,
        `<a class="btn btn-sm btn-wc ms-lg-2" href="${p}cadastro.html">Cadastrar-se</a>`,
      ];
  alvo.innerHTML = `
    <div class="faixa-retro"></div>
    <nav class="navbar navbar-expand-lg"><div class="container">
      <a class="navbar-brand fs-3" href="${raiz}index.html">WeekndCar</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Abrir menu"><span class="navbar-toggler-icon"></span></button>
      <div id="menu" class="collapse navbar-collapse"><div class="navbar-nav ms-auto align-items-lg-center">${itens.join("")}</div></div>
    </div></nav>`;
  alvo.querySelector("#btn-sair")?.addEventListener("click", () => {
    sair();
    location.href = `${raiz}index.html`;
  });
}
