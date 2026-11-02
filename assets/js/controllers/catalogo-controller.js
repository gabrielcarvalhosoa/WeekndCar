// Página inicial: carrossel de destaques, filtro por categoria e grade de carros
import { renderNavbar } from "../components/navbar.js";
import { cardCarro } from "../components/card-carro.js";
import { montarCarrossel } from "../components/carrossel.js";
import { CATEGORIAS } from "../models/carro.js";
import { listar } from "../services/carro-service.js";

const $ = (id) => document.getElementById(id);
renderNavbar($("navbar"));

let carros = [];

function mostrar(categoria) {
  const lista = categoria === "todos" ? carros : carros.filter((c) => c.categoria === categoria);
  $("grade").replaceChildren(...lista.map(cardCarro));
  $("contagem").textContent = lista.length === 1 ? "1 carro disponível" : `${lista.length} carros disponíveis`;
  $("filtros").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.categoria === categoria)));
}

try {
  carros = await listar();
  montarCarrossel($("destaques"), [...carros].sort((a, b) => b.diaria - a.diaria).slice(0, 6));
  $("filtros").innerHTML = [["todos", "Todos"], ...Object.entries(CATEGORIAS)]
    .map(([chave, nome]) => `<button type="button" class="btn btn-filtro" data-categoria="${chave}" aria-pressed="false">${nome}</button>`)
    .join("");
  $("filtros").addEventListener("click", (e) => {
    const botao = e.target.closest("button");
    if (botao) mostrar(botao.dataset.categoria);
  });
  mostrar("todos");
} catch {
  $("destaques").hidden = true;
  $("grade").innerHTML = `<div class="col-12"><div class="alert alert-danger" role="alert">Não foi possível carregar o catálogo. Verifique se o comando npm run api está rodando.</div></div>`;
}
