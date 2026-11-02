// Card do catálogo (página inicial)
import { esc, criarImagem } from "./dom.js";
import { formatarMoeda, imagemPlaceholder } from "../models/carro.js";

export function cardCarro(c) {
  const col = document.createElement("div");
  col.className = "col-sm-6 col-lg-4";
  col.innerHTML = `
    <a class="card-carro" href="pages/carro.html?id=${encodeURIComponent(c.id)}">
      <div class="card-carro-foto"></div>
      <div class="card-carro-corpo">
        <span class="card-carro-marca">${esc(c.marca)}</span>
        <h3 class="card-carro-modelo">${esc(c.modelo)}</h3>
        <div class="card-carro-rodape"><span>${esc(c.ano)}</span><span class="etiqueta-preco">${formatarMoeda(c.diaria)} por dia</span></div>
      </div>
    </a>`;
  col.querySelector(".card-carro-foto").append(criarImagem(c, "", imagemPlaceholder, `${c.marca} ${c.modelo} ${c.ano}`));
  return col;
}
